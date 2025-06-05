const express = require('express');
const {
   signup,
   login,
   getProfile,
   updateProfile,
   deleteProfile,
   getAllFarmers,
   deleteFarmer,
   getFarmerById, // Add this
   updateFarmerByAdmin, // Add this
} = require('../../controllers/farmers/FarmerController');
const authMiddleware = require('../../middleware/farmers/authMiddleware');
const adminAuth = require('../../middleware/admins/authMiddleware');
const Project = require('../../models/projects/Project'); // Import Project model
const {
   requestProjectCompletion,
   submitProjectProfit,
} = require('../../controllers/projects/ProjectController');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected farmer routes (must come before admin catch-all)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
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

// Farmer requests project completion
router.post(
   '/projects/:id/request-completion',
   authMiddleware,
   requestProjectCompletion
);

// Farmer submits profit for a completed project
router.post('/projects/:id/submit-profit', authMiddleware, submitProjectProfit);

// Admin routes (catch-all must come last)
router.get('/', adminAuth, getAllFarmers);
router.get('/:id', adminAuth, getFarmerById);
router.delete('/:id', adminAuth, deleteFarmer);
router.put('/:id', adminAuth, updateFarmerByAdmin);

module.exports = router;
