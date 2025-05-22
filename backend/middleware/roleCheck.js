const jwt = require('jsonwebtoken');
const Admin = require('../models/admins/Admin'); // Updated path to match your structure

const isAdmin = async (req, res, next) => {
   try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
         return res.status(401).json({ message: 'Authentication required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
         return res.status(403).json({ message: 'Admin access required' });
      }

      req.user = admin; // Match the property name used in your admin controller
      next();
   } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
   }
};

const isFarmer = async (req, res, next) => {
   try {
      const farmer = await Farmer.findById(req.user.id);
      if (!farmer) {
         return res.status(403).json({ message: 'Farmer access required' });
      }
      next();
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

module.exports = { isAdmin, isFarmer };
