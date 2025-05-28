const express = require('express');
const {
   createProject,
   getAllProjects,
   getProjectById,
   updateProjectStatus,
   getProjectFundingProgress,
   getFarmerTotalInvestment, // <-- Add this
} = require('../../controllers/projects/ProjectController');
const authMiddleware = require('../../middleware/farmers/authMiddleware');
const adminAuth = require('../../middleware/admins/authMiddleware');

const router = express.Router();

// PUBLIC GET routes (must be defined first)
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.get('/:id/funding-progress', getProjectFundingProgress); // <-- Already present
router.get('/farmer/:farmerId/total-investment', getFarmerTotalInvestment); // <-- Add this

// PROTECTED routes
router.post('/', authMiddleware, createProject);
router.patch('/:id/status', adminAuth, updateProjectStatus);

module.exports = router;
