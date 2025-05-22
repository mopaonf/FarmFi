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
      ref: 'Investor', // ✅ fixed reference here
      required: true,
      unique: true,
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
