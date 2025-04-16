const jwt = require('jsonwebtoken');
const Farmer = require('../../models/farmers/Farmer');

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
      req.user = decoded; // Attach user info to the request

      const farmer = await Farmer.findById(req.user.id);
      if (!farmer) {
         return res.status(404).json({ message: 'Farmer not found' });
      }

      req.farmer = farmer; // Attach the farmer object to the request for downstream use
      next();
   } catch (error) {
      console.error('Auth Middleware Error:', error.message); // Log error for debugging
      res.status(401).json({ message: 'Invalid token' });
   }
};

module.exports = authMiddleware;
