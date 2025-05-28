const express = require('express');
const {
   getAllTransactions,
   getTransactionDetails,
} = require('../../controllers/transactions/TransactionController');
const auth = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/roleCheck');

const router = express.Router();

router.use(auth);
router.get('/', isAdmin, getAllTransactions);
router.get(
   '/:walletId/transaction/:transactionId',
   isAdmin,
   getTransactionDetails
);

module.exports = router;
