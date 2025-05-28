const Wallet = require('../../models/wallets/Wallet');
const mongoose = require('mongoose');

const getAllTransactions = async (req, res) => {
   try {
      const transactions = await Wallet.aggregate([
         { $unwind: '$transactions' },
         {
            $lookup: {
               from: 'investors',
               localField: 'userId',
               foreignField: '_id',
               as: 'userInfo',
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
               user: {
                  $cond: {
                     if: { $gt: [{ $size: '$userInfo' }, 0] },
                     then: {
                        _id: { $arrayElemAt: ['$userInfo._id', 0] },
                        name: { $arrayElemAt: ['$userInfo.name', 0] },
                        email: { $arrayElemAt: ['$userInfo.email', 0] },
                        phone: { $arrayElemAt: ['$userInfo.phone', 0] },
                        type: { $arrayElemAt: ['$userInfo.type', 0] },
                     },
                     else: null,
                  },
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

      const transaction = wallet.transactions.id(transactionId);
      if (!transaction) {
         return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json({
         transaction,
         user: wallet.userId,
         walletBalance: wallet.balance,
      });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

module.exports = {
   getAllTransactions,
   getTransactionDetails,
};
