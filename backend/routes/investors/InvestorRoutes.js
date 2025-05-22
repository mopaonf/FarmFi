const express = require('express');
const {
   signup,
   login,
   getAllInvestors,
} = require('../../controllers/investors/InvestorController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/', getAllInvestors);

module.exports = router;
