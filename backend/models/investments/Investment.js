const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema(
   {
      investor: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Investor',
         required: true,
      },
      project: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Project',
         required: true,
      },
      amount: {
         type: Number,
         required: true,
      },
      status: {
         type: String,
         enum: ['pending', 'confirmed', 'rejected'],
         default: 'pending',
      },
      units: {
         type: Number,
         required: true,
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model('Investment', investmentSchema);
