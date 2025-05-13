const express = require('express');
const {
   signup,
   login,
   getProfile,
   updateProfile,
   deleteProfile,
} = require('../../controllers/farmers/FarmerController');
const authMiddleware = require('../../middleware/farmers/authMiddleware');
const Project = require('../../models/projects/Project');

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

// Get all projects for the logged-in farmer
router.get('/projects', authMiddleware, async (req, res) => {
   try {
      const projects = await Project.find({ farmer: req.user.id });
      res.json(projects);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
});

module.exports = router;
