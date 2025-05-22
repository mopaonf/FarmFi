const Investor = require('../../models/investors/Investor');
const Wallet = require('../../models/wallets/Wallet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
   try {
      const { username, name, email, password, phone, type } = req.body;

      // Validate required fields
      if (!username || !name || !email || !password || !phone || !type) {
         return res.status(400).json({ error: 'All fields are required' });
      }

      // Validate investor type
      if (!['Individual', 'Corporate'].includes(type)) {
         return res.status(400).json({ error: 'Invalid investor type' });
      }

      // Check if investor already exists
      const existingInvestor = await Investor.findOne({
         $or: [{ email }, { username }],
      });

      if (existingInvestor) {
         return res.status(400).json({
            error:
               existingInvestor.email === email
                  ? 'Email already registered'
                  : 'Username already taken',
         });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const investor = new Investor({
         username,
         name,
         email,
         password: hashedPassword,
         phone,
         type,
      });
      await investor.save();

      // Create wallet for new investor
      const wallet = new Wallet({
         userId: investor._id,
         balance: 0,
         transactions: [],
      });
      await wallet.save();

      // Remove password from response
      const investorResponse = investor.toObject();
      delete investorResponse.password;

      const token = jwt.sign({ userId: investor._id }, process.env.JWT_SECRET);
      res.status(201).json({
         user: investorResponse,
         wallet: wallet,
         token,
      });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

const login = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res
            .status(400)
            .json({ error: 'Email and password are required' });
      }

      const investor = await Investor.findOne({ email });
      if (!investor) {
         return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, investor.password);
      if (!isValid) {
         return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Remove password from response
      const investorResponse = investor.toObject();
      delete investorResponse.password;

      const token = jwt.sign({ userId: investor._id }, process.env.JWT_SECRET);
      res.json({ user: investorResponse, token });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

const getAllInvestors = async (req, res) => {
   try {
      const investors = await Investor.find({}).select('-password');
      res.json(investors);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

module.exports = { signup, login, getAllInvestors };
