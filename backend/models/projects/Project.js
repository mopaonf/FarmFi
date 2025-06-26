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
         address: {
            type: String,
            required: true,
         },
         lat: {
            type: Number,
            default: null,
         },
         lng: {
            type: Number,
            default: null,
         },
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
            'active',
            'funded',
            'completed',
            'denied',
            'pending_completion',
            'awaiting_admin_completion',
            'submitted',
         ],
         default: 'draft',
         set: (v) => v.toLowerCase(),
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
      expected_roi_range: {
         type: String,
         required: true,
      },
      return_frequency: {
         type: String,
         required: true,
      },
      return_start_year_or_month: {
         type: String, // e.g., "month 4" or "year 3"
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
      unitPrice: {
         type: Number,
         required: true,
         min: 0,
      },
      totalUnits: {
         type: Number,
         required: true,
         min: 0,
      },
      unitsInvested: {
         type: Number,
         default: 0,
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
      fundingStatus: {
         type: String,
         enum: ['pending', 'funding', 'funded', 'completed'],
         default: 'pending',
         set: (v) => v.toLowerCase(),
      },
      fundingProgress: {
         type: Number,
         default: 0, // Percentage of funding completed
      },
      pendingProfit: {
         amount: { type: Number },
         notes: { type: String },
         submittedAt: { type: Date },
         status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
         },
      },
      profitSubmissions: [
         {
            transactionId: { type: String, required: true },
            amount: { type: Number, required: true },
            notes: { type: String },
            submittedAt: { type: Date, required: true },
            status: {
               type: String,
               enum: ['pending', 'approved', 'rejected', 'completed'], // <-- add 'completed'
               default: 'pending',
            },
            adminReviewedAt: { type: Date },
            adminReviewer: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Admin',
            },
         },
      ],
      totalProfit: {
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

// Add method to update funding status automatically
ProjectSchema.methods.updateFundingStatus = function () {
   const progress = (this.unitsInvested / this.totalUnits) * 100;
   this.fundingProgress = progress;

   if (progress === 0) {
      this.fundingStatus = 'pending';
   } else if (progress < 100) {
      this.fundingStatus = 'funding';
   } else if (progress >= 100) {
      this.fundingStatus = 'funded';
   }

   return this.save();
};

// --- NEW STATIC METHOD: recalculate totalProfit ---
ProjectSchema.statics.recalculateTotalProfit = async function (projectId) {
   const project = await this.findById(projectId);
   if (!project) return 0;
   const total = (project.profitSubmissions || [])
      .filter((ps) => ps.status === 'approved')
      .reduce((sum, ps) => sum + (ps.amount || 0), 0);
   project.totalProfit = total;
   await project.save();
   return total;
};

module.exports = mongoose.model('Project', ProjectSchema);
