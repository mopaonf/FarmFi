const express = require('express');
const {
   getPendingInvestments,
   confirmInvestment,
   rejectInvestment,
   getInvestmentDetails,
   getInvestmentStats,
   getInvestmentsByProject,
   getInvestments,
   getInvestorInvestments,
} = require('../../controllers/investments/InvestmentController');
const auth = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/roleCheck');
const Investment = require('../../models/investments/Investment');

const router = express.Router();

// Apply auth middleware first for these specific routes
router.get('/my-investments', auth, getInvestorInvestments);

// Raw investments endpoint (for compatibility)
router.get('/raw', getInvestments);

// Grouped/summary endpoint (for contributors/analytics)
router.get('/', getInvestmentsByProject);

router.use(auth); // Protect all remaining investment routes
router.get('/pending', isAdmin, getPendingInvestments);
router.get('/details/:id', isAdmin, getInvestmentDetails);
router.get('/stats', isAdmin, getInvestmentStats);
router.post('/confirm/:id', isAdmin, confirmInvestment);
router.post('/reject/:id', isAdmin, rejectInvestment);

module.exports = router;
