const Admin = require('../../models/admins/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin login
exports.login = async (req, res) => {
   const { email, password } = req.body;

   try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
         return res.status(404).json({ message: 'Admin not found' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
         return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
         expiresIn: '1d',
      });

      // Send admin data in response
      res.status(200).json({
         message: 'Login successful',
         token,
         admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
         },
      });
   } catch (error) {
      res.status(500).json({ message: 'Server error', error });
   }
};

// Get admin profile
exports.getProfile = async (req, res) => {
   try {
      const admin = await Admin.findById(req.user.id).select('-password');
      if (!admin) {
         return res.status(404).json({ message: 'Admin not found' });
      }
      res.status(200).json(admin);
   } catch (error) {
      res.status(500).json({ message: 'Server error', error });
   }
};
