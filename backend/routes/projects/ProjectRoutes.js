const express = require('express');
const {
   createProject,
   getAllProjects,
   getProjectById,
   updateProjectStatus,
   getProjectFundingProgress,
   getFarmerTotalInvestment,
   approveProjectCompletion,
   approveProjectProfit,
   approveProfitSubmission,
   rejectProfitSubmission,
   releaseProfitToInvestors,
   getProfitReleaseHistory,
   updateProjectLocations,
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
router.patch('/:id/approve-completion', adminAuth, approveProjectCompletion); // <-- Add this
router.patch('/:id/approve-profit', adminAuth, approveProjectProfit); // <-- Add this
// Approve/reject profit submission by transactionId
router.patch(
   '/:projectId/profit-submission/:transactionId/approve',
   adminAuth,
   approveProfitSubmission
);
router.patch(
   '/:projectId/profit-submission/:transactionId/reject',
   adminAuth,
   rejectProfitSubmission
);
// Add admin endpoint to release profit to investors
router.post('/:id/release-profit', adminAuth, releaseProfitToInvestors);
// Add admin endpoint to get profit release history for a project
router.get('/:id/profit-releases', adminAuth, getProfitReleaseHistory);
// Admin endpoint to ensure all project locations are within Cameroon
// This endpoint will:
// 1. Reset any locations outside of Cameroon to be within Cameroon's boundaries
// 2. Assign appropriate regional coordinates based on crop category
// 3. Ensure all projects have proper location structure (address, lat, lng)
router.post('/update-locations', adminAuth, updateProjectLocations);

module.exports = router;
