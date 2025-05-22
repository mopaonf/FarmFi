const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema(
   {
      username: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      phone: { type: String, required: false },
      type: { type: String, required: true, enum: ['Individual', 'Corporate'] },
      totalInvestment: { type: Number, default: 0 },
   },
   { timestamps: true }
);

module.exports = mongoose.model('Investor', investorSchema);
