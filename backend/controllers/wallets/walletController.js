const mongoose = require('mongoose');
const Wallet = require('../../models/wallets/Wallet');
const Investment = require('../../models/investments/Investment');
const { generateTransactionRef } = require('../../utils/helpers');

exports.createWalletForUser = async (userId) => {
   const existing = await Wallet.findOne({ userId });
   if (existing) return existing;

   const wallet = new Wallet({ userId });
   return await wallet.save();
};

exports.getWallet = async (req, res) => {
   try {
      const wallet = await Wallet.findOne({ userId: req.user.id });
      if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

      res.json(wallet);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

exports.depositFunds = async (req, res) => {
   let { amount, description, userId } = req.body;
   userId =
      userId ||
      (req.user && (req.user.id || req.user._id || req.user.userId)) ||
      req.userId ||
      (req.query && req.query.userId);

   amount = Number(amount);

   if (!userId) {
      return res.status(400).json({ message: 'User ID not found in request' });
   }
   if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
   }

   try {
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

      wallet.balance += amount;
      wallet.transactions.push({
         type: 'deposit',
         amount,
         status: 'confirmed',
         description,
         reference: generateTransactionRef(),
      });
      wallet.lastUpdated = new Date();

      await wallet.save();
      res.json({ message: 'Deposit successful', balance: wallet.balance });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

exports.investFromWallet = async (req, res) => {
   const { projectId, amount, units, description } = req.body;
   const userId = req.user.id;

   try {
      // Find user's wallet
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
         return res.status(404).json({ message: 'Wallet not found' });
      }

      // Verify sufficient balance
      if (wallet.balance < amount) {
         return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Create new investment
      const investment = new Investment({
         investor: userId,
         project: projectId,
         amount,
         units,
         status: 'pending',
      });
      await investment.save();

      // Generate transaction reference
      const reference = generateTransactionRef();

      // Update wallet balance and add transaction
      const previousBalance = wallet.balance;
      const newBalance = previousBalance - amount;

      const updateResult = await Wallet.findOneAndUpdate(
         { userId, balance: previousBalance }, // ensures balance hasn't changed
         {
            $set: { balance: newBalance },
            $push: {
               transactions: {
                  type: 'investment',
                  amount,
                  status: 'pending',
                  project: projectId,
                  investment: investment._id,
                  description,
                  reference,
                  metadata: {
                     previousBalance,
                     newBalance,
                     units,
                  },
               },
            },
         },
         { new: true }
      );

      if (!updateResult) {
         // If update failed, delete the investment and return error
         await Investment.findByIdAndDelete(investment._id);
         return res.status(400).json({
            message: 'Balance changed during transaction, please try again',
         });
      }

      res.json({
         message: 'Investment pending confirmation',
         investment,
         previousBalance,
         newBalance,
         deductedAmount: amount,
      });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

exports.adminCreditWallet = async (req, res) => {
   const { userId, amount, type, description } = req.body;

   if (!['admin-credit', 'admin-debit'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
   }

   try {
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

      if (type === 'admin-debit' && wallet.balance < amount) {
         return res
            .status(400)
            .json({ message: 'Insufficient balance to debit' });
      }

      wallet.balance += type === 'admin-credit' ? amount : -amount;
      wallet.transactions.push({
         type,
         amount,
         status: 'confirmed',
         description,
      });
      wallet.lastUpdated = new Date();

      await wallet.save();
      res.json({ message: 'Wallet updated by admin', balance: wallet.balance });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

exports.withdrawFunds = async (req, res) => {
   let { amount, description, userId } = req.body;
   userId =
      userId ||
      (req.user && (req.user.id || req.user._id || req.user.userId)) ||
      req.userId ||
      (req.query && req.query.userId);

   const amt = Number(amount);

   if (!userId) {
      return res.status(400).json({ message: 'User ID not found in request' });
   }
   if (isNaN(amt) || amt <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
   }

   try {
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) {
         return res.status(404).json({ message: 'Wallet not found' });
      }
      if (wallet.balance < amt) {
         return res.status(400).json({ message: 'Insufficient balance' });
      }

      wallet.balance -= amt;
      wallet.transactions.push({
         type: 'withdrawal',
         amount: amt,
         status: 'pending',
         description,
         reference: generateTransactionRef(),
      });
      wallet.lastUpdated = new Date();

      await wallet.save();
      res.json({
         message: 'Withdrawal request received',
         balance: wallet.balance,
      });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

exports.confirmInvestment = async (req, res) => {
   const { investmentId, projectId } = req.body;

   try {
      const wallet = await Wallet.findOne({
         'transactions.investment': investmentId,
      });

      if (!wallet) {
         return res
            .status(404)
            .json({ message: 'Investment transaction not found' });
      }

      const transaction = wallet.transactions.find(
         (t) =>
            t.investment.toString() === investmentId && t.type === 'investment'
      );

      if (transaction.status !== 'pending') {
         return res
            .status(400)
            .json({ message: 'Investment already processed' });
      }

      transaction.status = 'confirmed';
      wallet.totalInvested += transaction.amount;
      await wallet.save();

      res.json({ message: 'Investment confirmed', transaction });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

exports.processReturns = async (req, res) => {
   const { investmentId, amount, description } = req.body;
   const userId = req.params.userId;

   try {
      const wallet = await Wallet.findOne({ userId });
      if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

      wallet.balance += amount;
      wallet.totalReturns += amount;
      wallet.transactions.push({
         type: 'payout',
         amount,
         status: 'confirmed',
         investment: investmentId,
         description,
         reference: generateTransactionRef(),
      });

      await wallet.save();
      res.json({
         message: 'Returns processed successfully',
         balance: wallet.balance,
      });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

exports.getWalletStats = async (req, res) => {
   try {
      // Safely access all possible sources
      let userId =
         (req.user && (req.user.id || req.user._id || req.user.userId)) ||
         req.userId ||
         (req.body && req.body.userId) ||
         (req.query && req.query.userId);

      if (!userId) {
         return res.status(400).json({
            message:
               'User ID not found in request. Please provide userId in the request body, query, or ensure authentication is set up.',
         });
      }

      // Handle ObjectId conversion more safely
      let objectId;
      if (typeof userId === 'string') {
         if (mongoose.Types.ObjectId.isValid(userId)) {
            objectId = new mongoose.Types.ObjectId(userId);
         } else {
            return res.status(400).json({ message: 'Invalid user ID format' });
         }
      } else {
         objectId = userId;
      }

      // Try to find wallet without userType first, then with specific userType
      let wallet = await Wallet.findOne({ userId: objectId });

      if (!wallet) {
         // If not found, try with userType filters
         wallet =
            (await Wallet.findOne({ userId: objectId, userType: 'Farmer' })) ||
            (await Wallet.findOne({ userId: objectId, userType: 'Investor' }));
      }

      if (!wallet) {
         return res.status(404).json({ message: 'Wallet not found' });
      }

      // Get total confirmed investments
      const investments = await Investment.find({
         investor: objectId, // Use objectId instead of req.user.id
         status: 'confirmed',
      });

      const totalInvested = investments.reduce(
         (sum, inv) => sum + inv.amount,
         0
      );

      const stats = {
         balance: wallet.balance,
         totalInvested,
         totalReturns: wallet.totalReturns || 0,
         pendingReturns: wallet.pendingReturns || 0,
         recentTransactions: wallet.transactions.slice(-5),
      };

      res.json(stats);
   } catch (err) {
      console.error('Wallet stats error:', err);
      res.status(500).json({ message: err.message });
   }
};

exports.handlePaymentWebhook = async (req, res) => {
   // Payment gateway webhook handler implementation
   res.status(200).json({ received: true });
};

exports.getTransactions = async (req, res) => {
   try {
      const wallet = await Wallet.findOne({ userId: req.user.id })
         .populate({
            path: 'transactions.project',
            select: 'title description unitPrice',
            model: 'Project',
         })
         .populate({
            path: 'transactions.investment',
            select: 'units status amount',
            model: 'Investment',
         });

      if (!wallet) {
         return res.status(404).json({ message: 'Wallet not found' });
      }

      const transactions = wallet.transactions.map((t) => {
         const trans = t.toObject();

         if (t.type === 'investment' && t.project) {
            trans.description = `Investment in ${t.project.title}`; // Use actual project title
            trans.projectDetails = {
               title: t.project.title,
               units: t.investment?.units || 0,
            };
         }

         return trans;
      });

      console.log('Processed transactions:', transactions); // For debugging
      res.json(transactions);
   } catch (error) {
      console.error('Transaction fetch error:', error);
      res.status(500).json({ message: error.message });
   }
};

exports.adminDisburseToFarmer = async (req, res) => {
   const { farmerId, projectId, amount, description } = req.body;
   if (!farmerId || !projectId || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
   }
   try {
      // Find or create farmer wallet
      let wallet = await Wallet.findOne({
         userId: farmerId,
         userType: 'Farmer',
      });
      if (!wallet) {
         wallet = new Wallet({
            userId: farmerId,
            userType: 'Farmer',
            balance: 0,
            transactions: [],
         });
      }
      wallet.balance += amount;
      wallet.transactions.push({
         type: 'disbursement',
         amount,
         status: 'confirmed',
         project: projectId,
         description: description || `Disbursement for project ${projectId}`,
         reference: generateTransactionRef(),
      });
      wallet.lastUpdated = new Date();
      await wallet.save();
      res.json({ message: 'Disbursement successful', balance: wallet.balance });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};
