const express = require('express');
const {
   signup,
   login,
   getProfile,
   updateProfile,
   deleteProfile,
} = require('../../controllers/farmers/FarmerController');
const authMiddleware = require('../../middleware/farmers/authMiddleware');

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Get profile route
router.get('/profile', authMiddleware, getProfile);

// Update profile route
router.put('/profile', authMiddleware, updateProfile); // Ensure this route exists

// Delete profile route
router.delete('/profile', authMiddleware, deleteProfile);

module.exports = router;
