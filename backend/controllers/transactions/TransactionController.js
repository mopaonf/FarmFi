const Wallet = require('../../models/wallets/Wallet');
const mongoose = require('mongoose');

const getAllTransactions = async (req, res) => {
   try {
      const transactions = await Wallet.aggregate([
         { $unwind: '$transactions' },
         // Lookup for Investor (user)
         {
            $lookup: {
               from: 'investors',
               localField: 'userId',
               foreignField: '_id',
               as: 'investorInfo',
            },
         },
         // Lookup for Farmer (userType: Farmer)
         {
            $lookup: {
               from: 'farmers',
               localField: 'userId',
               foreignField: '_id',
               as: 'farmerInfo',
            },
         },
         // Lookup for Admin (userType: Admin)
         {
            $lookup: {
               from: 'admins',
               localField: 'userId',
               foreignField: '_id',
               as: 'adminInfo',
            },
         },
         {
            $lookup: {
               from: 'investments',
               localField: 'transactions.investment',
               foreignField: '_id',
               as: 'investmentDetails',
            },
         },
         {
            $lookup: {
               from: 'projects',
               localField: 'investmentDetails.project',
               foreignField: '_id',
               as: 'projectDetails',
            },
         },
         // Add direct project lookup for disbursement transactions
         {
            $lookup: {
               from: 'projects',
               localField: 'transactions.project',
               foreignField: '_id',
               as: 'projectInfo',
            },
         },
         {
            $project: {
               _id: '$transactions._id',
               transactionId: '$transactions._id',
               type: '$transactions.type',
               amount: '$transactions.amount',
               status: '$transactions.status',
               description: '$transactions.description',
               reference: '$transactions.reference',
               metadata: '$transactions.metadata',
               timestamp: { $toDate: '$transactions.timestamp' },
               // User logic: prefer investor, then farmer, then admin
               user: {
                  $cond: [
                     { $gt: [{ $size: '$investorInfo' }, 0] },
                     {
                        _id: { $arrayElemAt: ['$investorInfo._id', 0] },
                        name: { $arrayElemAt: ['$investorInfo.name', 0] },
                        email: { $arrayElemAt: ['$investorInfo.email', 0] },
                        phone: { $arrayElemAt: ['$investorInfo.phone', 0] },
                        type: 'Investor',
                     },
                     {
                        $cond: [
                           { $gt: [{ $size: '$farmerInfo' }, 0] },
                           {
                              _id: { $arrayElemAt: ['$farmerInfo._id', 0] },
                              name: { $arrayElemAt: ['$farmerInfo.name', 0] },
                              email: { $arrayElemAt: ['$farmerInfo.email', 0] },
                              phone: { $arrayElemAt: ['$farmerInfo.phone', 0] },
                              type: 'Farmer',
                           },
                           {
                              $cond: [
                                 { $gt: [{ $size: '$adminInfo' }, 0] },
                                 {
                                    _id: {
                                       $arrayElemAt: ['$adminInfo._id', 0],
                                    },
                                    name: {
                                       $arrayElemAt: ['$adminInfo.name', 0],
                                    },
                                    email: {
                                       $arrayElemAt: ['$adminInfo.email', 0],
                                    },
                                    phone: {
                                       $arrayElemAt: ['$adminInfo.phone', 0],
                                    },
                                    type: 'Admin',
                                 },
                                 null,
                              ],
                           },
                        ],
                     },
                  ],
               },
               investment: {
                  $cond: {
                     if: { $gt: [{ $size: '$investmentDetails' }, 0] },
                     then: {
                        _id: { $arrayElemAt: ['$investmentDetails._id', 0] },
                        amount: {
                           $arrayElemAt: ['$investmentDetails.amount', 0],
                        },
                        units: {
                           $arrayElemAt: ['$investmentDetails.units', 0],
                        },
                        status: {
                           $arrayElemAt: ['$investmentDetails.status', 0],
                        },
                        project: {
                           $let: {
                              vars: {
                                 proj: {
                                    $arrayElemAt: ['$projectDetails', 0],
                                 },
                              },
                              in: {
                                 _id: '$$proj._id',
                                 title: '$$proj.title',
                              },
                           },
                        },
                     },
                     else: null,
                  },
               },
               // Add disbursementProject for disbursement transactions
               disbursementProject: {
                  $cond: [
                     { $eq: ['$transactions.type', 'disbursement'] },
                     {
                        $let: {
                           vars: {
                              proj: {
                                 $arrayElemAt: ['$disbursementProject', 0],
                              },
                           },
                           in: {
                              _id: '$$proj._id',
                              title: '$$proj.title',
                              description: '$$proj.description',
                              unitPrice: '$$proj.unitPrice',
                           },
                        },
                     },
                     null,
                  ],
               },
               // Add project field for profit_submission and other types
               project: {
                  $cond: [
                     { $gt: [{ $size: '$projectInfo' }, 0] },
                     {
                        _id: { $arrayElemAt: ['$projectInfo._id', 0] },
                        title: { $arrayElemAt: ['$projectInfo.title', 0] },
                     },
                     // fallback to null or just the ObjectId if you want
                     '$transactions.project',
                  ],
               },
            },
         },
         {
            $addFields: {
               formattedDate: {
                  $dateToString: {
                     format: '%Y-%m-%dT%H:%M:%S.%LZ',
                     date: '$timestamp',
                  },
               },
            },
         },
         {
            $project: {
               _id: 1,
               transactionId: 1,
               type: 1,
               amount: 1,
               status: 1,
               description: 1,
               reference: 1,
               metadata: 1,
               timestamp: 1,
               formattedDate: 1,
               user: 1,
               investment: 1,
               disbursementProject: 1,
               project: 1, // <-- include project in output
            },
         },
         { $sort: { timestamp: -1 } },
      ]);

      const processedTransactions = transactions.map((t) => ({
         ...t,
         createdAt: t.formattedDate,
         user: t.user || {
            name: 'Unknown User',
            email: 'N/A',
            phone: 'N/A',
            type: 'N/A',
         },
         investment: t.investment || {
            _id: null,
            amount: null,
            units: null,
            status: null,
            project: { _id: null, title: null },
         },
         disbursementProject: t.disbursementProject || null,
         // Normalize project: if it's an object, keep as is; if it's ObjectId, wrap as {_id: ...}
         project:
            t.project && typeof t.project === 'object'
               ? t.project
               : t.project
               ? { _id: t.project }
               : null,
      }));

      res.json(processedTransactions);
   } catch (error) {
      console.error('Transaction fetch error:', error);
      res.status(500).json({ error: error.message });
   }
};

const getTransactionDetails = async (req, res) => {
   try {
      const { walletId, transactionId } = req.params;

      const wallet = await Wallet.findById(walletId)
         .populate('userId', 'name email phone type')
         .populate({
            path: 'transactions.investment',
            populate: {
               path: 'project',
               select: 'title unitPrice totalUnits',
            },
         });

      if (!wallet) {
         return res.status(404).json({ error: 'Wallet not found' });
      }

      const transaction = wallet.transactions.id(transactionId);
      if (!transaction) {
         return res.status(404).json({ error: 'Transaction not found' });
      }

      // If it's a Campay transaction, check its current status
      if (transaction.campayReference && transaction.status === 'pending') {
         try {
            const campayService = require('../../services/campayService');
            const status = await campayService.checkTransactionStatus(
               transaction.campayReference
            );

            if (
               status.status === 'SUCCESSFUL' &&
               transaction.status === 'pending'
            ) {
               // Update wallet balance for successful deposits
               if (transaction.type === 'deposit') {
                  wallet.balance += transaction.amount;
               }
               transaction.status = 'confirmed';
               await wallet.save();
            } else if (
               status.status === 'FAILED' &&
               transaction.status === 'pending'
            ) {
               transaction.status = 'failed';
               await wallet.save();
            }
         } catch (error) {
            console.error('Error checking Campay status:', error);
         }
      }

      res.json({
         transaction,
         user: wallet.userId,
         walletBalance: wallet.balance,
         lastChecked: new Date().toISOString(),
      });
   } catch (error) {
      console.error('Transaction details error:', error);
      res.status(500).json({ error: error.message });
   }
};

// Admin: Approve withdrawal
const approveWithdrawal = async (req, res) => {
   try {
      const transactionId = req.params.transactionId;
      // Find the wallet containing this transaction
      const wallet = await Wallet.findOne({
         'transactions._id': transactionId,
      });
      if (!wallet) {
         return res.status(404).json({ message: 'Wallet not found' });
      }
      const transaction = wallet.transactions.id(transactionId);
      if (!transaction || transaction.type !== 'withdrawal') {
         return res
            .status(404)
            .json({ message: 'Withdrawal transaction not found' });
      }
      if (transaction.status !== 'pending') {
         return res
            .status(400)
            .json({ message: 'Withdrawal already processed' });
      }
      transaction.status = 'confirmed';
      wallet.lastUpdated = new Date();
      await wallet.save();
      res.json({ message: 'Withdrawal approved and marked as confirmed.' });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Admin: Decline withdrawal
const declineWithdrawal = async (req, res) => {
   try {
      const transactionId = req.params.transactionId;
      // Find the wallet containing this transaction
      const wallet = await Wallet.findOne({
         'transactions._id': transactionId,
      });
      if (!wallet) {
         return res.status(404).json({ message: 'Wallet not found' });
      }
      const transaction = wallet.transactions.id(transactionId);
      if (!transaction || transaction.type !== 'withdrawal') {
         return res
            .status(404)
            .json({ message: 'Withdrawal transaction not found' });
      }
      if (transaction.status !== 'pending') {
         return res
            .status(400)
            .json({ message: 'Withdrawal already processed' });
      }
      // Refund the amount to the wallet
      wallet.balance += transaction.amount;
      transaction.status = 'failed';
      wallet.lastUpdated = new Date();
      await wallet.save();
      res.json({ message: 'Withdrawal declined and amount refunded.' });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

module.exports = {
   getAllTransactions,
   getTransactionDetails,
   approveWithdrawal,
   declineWithdrawal,
};
