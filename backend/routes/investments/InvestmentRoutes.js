const express = require('express');
const {
   getPendingInvestments,
   confirmInvestment,
   rejectInvestment,
   getInvestmentDetails,
   getInvestmentStats,
   getInvestmentsByProject,
   getInvestments, 
} = require('../../controllers/investments/InvestmentController');
const auth = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/roleCheck');
const Investment = require('../../models/investments/Investment');

const router = express.Router();

// Raw investments endpoint (for compatibility)
router.get('/raw', getInvestments);

// Grouped/summary endpoint (for contributors/analytics)
router.get('/', getInvestmentsByProject);

router.use(auth); // Protect all investment routes
router.get('/pending', isAdmin, getPendingInvestments);
router.get('/details/:id', isAdmin, getInvestmentDetails);
router.get('/stats', isAdmin, getInvestmentStats);
router.post('/confirm/:id', isAdmin, confirmInvestment);
router.post('/reject/:id', isAdmin, rejectInvestment);

module.exports = router;
