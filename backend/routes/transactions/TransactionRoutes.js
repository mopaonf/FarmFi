const express = require('express');
const {
   getAllTransactions,
   getTransactionDetails,
   approveWithdrawal,
   declineWithdrawal,
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

// Admin: Approve/Decline withdrawal endpoints
router.post('/:transactionId/approve-withdrawal', isAdmin, approveWithdrawal);
router.post('/:transactionId/decline-withdrawal', isAdmin, declineWithdrawal);

module.exports = router;
