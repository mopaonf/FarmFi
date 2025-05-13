const express = require('express');
const {
   login,
   getProfile,
} = require('../../controllers/admins/AdminController');
const authMiddleware = require('../../middleware/admins/authMiddleware');

const router = express.Router();

// Admin login
router.post(
   '/login',
   (req, res, next) => {
      console.log('Admin login route hit');
      next();
   },
   login
);

// Get admin profile
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
