const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
   type: {
      type: String,
      enum: [
         'deposit',
         'withdrawal',
         'investment',
         'payout',
         'admin-credit',
         'admin-debit',
         'disbursement',
         'profit_submission', // <-- ensure this is present
      ],
      required: true,
   },
   amount: {
      type: Number,
      required: true,
      min: 0,
   },
   status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', 'processing'],
      default: 'pending',
   },
   project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
   },
   investment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investment',
      default: null,
   },
   description: {
      type: String,
      default: '',
   },
   timestamp: {
      type: Date,
      default: Date.now,
   },
   reference: {
      type: String,
      unique: true,
      required: true,
      sparse: true, // <-- add this line
   },
   campayReference: {
      type: String,
      default: null,
      index: true, // for faster lookup
   },
   paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'mobile_money', 'card', 'system', 'admin'],
      default: 'system',
   },
   metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
   },
});

const walletSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      // Allow both Investor and Farmer
      refPath: 'userType',
   },
   userType: {
      type: String,
      required: true,
      enum: ['Investor', 'Farmer'],
   },
   balance: {
      type: Number,
      required: true,
      default: 0,
   },
   currency: {
      type: String,
      default: 'FCFA',
   },
   transactions: [transactionSchema],
   lastUpdated: {
      type: Date,
      default: Date.now,
   },
   totalInvested: {
      type: Number,
      default: 0,
   },
   totalReturns: {
      type: Number,
      default: 0,
   },
   pendingReturns: {
      type: Number,
      default: 0,
   },
   isLocked: {
      type: Boolean,
      default: false,
   },
});

module.exports = mongoose.model('Wallet', walletSchema);

// Example document to insert into the wallets collection for an investor:
// {
//    userId: ObjectId("682bbf0a084d7b2d92a766dc"),
//    userType: "Investor",
//    balance: 0,
//    currency: "FCFA",
//    transactions: [],
//    lastUpdated: new Date(),
//    totalInvested: 0,
//    totalReturns: 0,
//    pendingReturns: 0,
//    isLocked: false
// }
