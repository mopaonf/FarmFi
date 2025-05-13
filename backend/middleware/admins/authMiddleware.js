const jwt = require('jsonwebtoken');
const Admin = require('../../models/admins/Admin');

const authMiddleware = async (req, res, next) => {
   const authHeader = req.header('Authorization');

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
         .status(401)
         .json({ message: 'No token provided or invalid format' });
   }

   const token = authHeader.replace('Bearer ', '');

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      const admin = await Admin.findById(req.user.id);
      if (!admin) {
         return res.status(404).json({ message: 'Admin not found' });
      }

      req.admin = admin;
      next();
   } catch (error) {
      console.error('Admin Auth Middleware Error:', error.message);
      res.status(401).json({ message: 'Invalid token' });
   }
};

module.exports = authMiddleware;
