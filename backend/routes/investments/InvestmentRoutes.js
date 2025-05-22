const express = require('express');
const {
   getPendingInvestments,
   confirmInvestment,
   rejectInvestment,
   getInvestmentDetails,
   getInvestmentStats,
} = require('../../controllers/investments/InvestmentController');
const auth = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/roleCheck');

const router = express.Router();

router.use(auth); // Protect all investment routes
router.get('/pending', isAdmin, getPendingInvestments);
router.get('/details/:id', isAdmin, getInvestmentDetails);
router.get('/stats', isAdmin, getInvestmentStats);
router.post('/confirm/:id', isAdmin, confirmInvestment);
router.post('/reject/:id', isAdmin, rejectInvestment);

module.exports = router;
