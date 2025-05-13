const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
      },
      description: {
         type: String,
         required: true,
      },
      category: {
         type: String,
         required: true,
         enum: ['crop', 'livestock', 'processing'],
      },
      location: {
         type: String,
         required: true,
      },
      land_size: {
         type: Number,
         required: true,
         min: 0,
      },
      budget_total: {
         type: Number,
         required: true,
         min: 0,
      },
      funding_goal: {
         type: Number,
         required: true,
         min: 0,
      },
      duration_in_months: {
         type: Number,
         required: true,
         min: 1,
         max: 240,
      },
      investment_model: {
         type: String,
         required: true,
         enum: ['crowdfunding', 'fixed_return', 'profit_sharing'],
      },
      risk_level: {
         type: String,
         required: true,
         enum: ['low', 'medium', 'high'],
         default: 'medium',
      },
      status: {
         type: String,
         required: true,
         enum: [
            'draft',
            'under_review',
            'Active',
            'Submitted',
            'Completed',
            'Denied',
            'funded',
            'rejected',
         ],
         default: 'draft',
      },
      photos: [
         {
            url: { type: String },
            name: { type: String },
            type: { type: String },
         },
      ],
      documents: [
         {
            url: { type: String },
            name: { type: String },
            type: { type: String },
            size: { type: Number },
         },
      ],
      start_date: {
         type: Date,
         required: true,
      },
      end_date: {
         type: Date,
         required: true,
      },
      investment_per_unit: {
         type: Number,
         required: true,
         min: 0,
      },
      total_units: {
         type: Number,
         required: true,
         min: 0,
      },
      expected_roi_range: {
         type: String,
         required: true,
      },
      return_frequency: {
         type: String,
         required: true,
      },
      return_start_year: {
         type: String,
         required: true,
      },
      contract_duration: {
         type: String,
         required: true,
      },
      annual_net_profit_estimate: {
         type: String,
         required: true,
      },
      risks_and_mitigation: {
         type: String,
         required: true,
      },
      pitch_video: {
         url: { type: String },
         name: { type: String },
         type: { type: String },
      },
      farmer_bio: {
         type: String,
         required: true,
      },
      farmer: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Farmer',
         required: true,
      },
      progress: {
         type: Number,
         default: 0,
         min: 0,
         max: 100,
      },
      total_invested: {
         type: Number,
         default: 0,
         min: 0,
      },
      investors_count: {
         type: Number,
         default: 0,
         min: 0,
      },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

// Virtual field for funding progress percentage
ProjectSchema.virtual('funding_progress').get(function () {
   return this.total_invested
      ? (this.total_invested / this.funding_goal) * 100
      : 0;
});

// Ensure end_date is after start_date
ProjectSchema.pre('save', function (next) {
   if (this.end_date <= this.start_date) {
      next(new Error('End date must be after start date'));
   }
   next();
});

module.exports = mongoose.model('Project', ProjectSchema);
