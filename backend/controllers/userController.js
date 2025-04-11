const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
   try {
      const { username, name, email, password } = req.body;

      // Validate required fields
      if (!username || !name || !email || !password) {
         return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
         $or: [{ email }, { username }],
      });

      if (existingUser) {
         return res.status(400).json({
            error:
               existingUser.email === email
                  ? 'Email already registered'
                  : 'Username already taken',
         });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
         username,
         name,
         email,
         password: hashedPassword,
      });
      await user.save();

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.status(201).json({ user: userResponse, token });
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

      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
         return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.json({ user: userResponse, token });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
};

// Remove unused functions
module.exports = { signup, login };
