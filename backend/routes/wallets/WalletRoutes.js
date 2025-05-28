const express = require('express');
const router = express.Router();
const walletController = require('../../controllers/wallets/walletController');
const auth = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/roleCheck');
const { validateTransaction } = require('../../middleware/validateTransaction');

// Public routes
router.post('/webhook/payment-callback', walletController.handlePaymentWebhook);

// Protected routes (require authentication)
router.use(auth);

// Get wallet information and stats
router.get('/stats', walletController.getWalletStats);
router.get('/transactions', walletController.getTransactions);

// Deposit and withdrawal
router.post('/deposit', validateTransaction, walletController.depositFunds);
router.post('/withdraw', validateTransaction, walletController.withdrawFunds);

// Investment operations
router.post('/invest', validateTransaction, walletController.investFromWallet);

// Admin routes
router.use(isAdmin);
router.post(
   '/confirm-investment/:investmentId',
   walletController.confirmInvestment
);
router.post('/process-returns/:userId', walletController.processReturns);
router.post('/admin-credit', walletController.adminCreditWallet);
router.post('/admin-disburse-farmer', walletController.adminDisburseToFarmer);

module.exports = router;
