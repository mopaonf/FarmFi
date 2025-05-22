const Investment = require('../../models/investments/Investment');
const Project = require('../../models/projects/Project');
const Wallet = require('../../models/wallets/Wallet');

const getPendingInvestments = async (req, res) => {
   try {
      // Explicitly filter by pending status
      const investments = await Investment.find({
         status: 'pending',
         // Add any other relevant filters
      })
         .populate('investor')
         .populate({
            path: 'project',
            select:
               'title description location duration expectedReturn unitPrice totalUnits unitsInvested total_invested investors_count fundingStatus fundingProgress',
         })
         .sort('-createdAt');

      res.json(investments);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

const getInvestmentDetails = async (req, res) => {
   try {
      const investment = await Investment.findById(req.params.id)
         .populate('investor')
         .populate('project')
         .populate({
            path: 'wallet',
            select: 'transactions',
         });

      if (!investment) {
         return res.status(404).json({ error: 'Investment not found' });
      }

      res.json(investment);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

const getInvestmentStats = async (req, res) => {
   try {
      const stats = await Investment.aggregate([
         {
            $group: {
               _id: '$status',
               count: { $sum: 1 },
               totalAmount: { $sum: '$amount' },
            },
         },
      ]);

      res.json(stats);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

const confirmInvestment = async (req, res) => {
   let updatedProject = null;
   let investmentDoc = null; // renamed to avoid conflict

   try {
      investmentDoc = await Investment.findById(req.params.id);
      if (!investmentDoc) {
         return res.status(404).json({ error: 'Investment not found' });
      }

      if (investmentDoc.status !== 'pending') {
         return res.status(400).json({
            error: 'Investment has already been processed',
         });
      }

      const project = await Project.findById(investmentDoc.project);
      if (!project) {
         return res.status(404).json({ error: 'Project not found' });
      }

      // Check available units
      if (project.unitsInvested + investmentDoc.units > project.totalUnits) {
         return res
            .status(400)
            .json({ error: 'Investment would exceed available units' });
      }

      // Update project stats
      project.unitsInvested += investmentDoc.units;
      project.total_invested += investmentDoc.amount;
      project.investors_count += 1;

      // Update funding status
      const progress = (project.unitsInvested / project.totalUnits) * 100;
      project.fundingProgress = progress;

      if (progress === 0) {
         project.fundingStatus = 'pending';
         project.status = 'draft'; // Use correct enum value
      } else if (progress < 100) {
         project.fundingStatus = 'funding';
         project.status = 'active'; // Use correct enum value
      } else if (progress >= 100) {
         project.fundingStatus = 'funded';
         project.status = 'funded'; // Use correct enum value
      }

      updatedProject = await project.save();

      // Update investment status
      investmentDoc.status = 'confirmed';
      await investmentDoc.save();

      // Update wallet
      const wallet = await Wallet.findOne({ userId: investmentDoc.investor });
      if (wallet) {
         const transaction = wallet.transactions.find(
            (t) =>
               t.investment &&
               t.investment.toString() === investmentDoc._id.toString()
         );
         if (transaction) {
            transaction.status = 'confirmed';
            await wallet.save();
         }
      }

      res.status(200).json({
         success: true,
         message: 'Investment confirmed successfully',
         project: {
            unitsInvested: updatedProject.unitsInvested,
            fundingProgress: updatedProject.fundingProgress,
            fundingStatus: updatedProject.fundingStatus,
            total_invested: updatedProject.total_invested,
            investors_count: updatedProject.investors_count,
            status: updatedProject.status,
         },
      });
   } catch (error) {
      console.error('Confirmation error:', error);

      // Rollback changes
      if (updatedProject) {
         try {
            updatedProject.unitsInvested -= investmentDoc.units;
            updatedProject.total_invested -= investmentDoc.amount;
            updatedProject.investors_count -= 1;
            await updatedProject.save();
         } catch (rollbackError) {
            console.error('Rollback error:', rollbackError);
         }
      }

      if (investmentDoc) {
         try {
            investmentDoc.status = 'pending';
            await investmentDoc.save();
         } catch (rollbackError) {
            console.error('Rollback error:', rollbackError);
         }
      }

      res.status(500).json({
         success: false,
         error: error.message || 'Failed to confirm investment',
      });
   }
};

const rejectInvestment = async (req, res) => {
   try {
      const investment = await Investment.findById(req.params.id);
      if (!investment) {
         return res.status(404).json({ error: 'Investment not found' });
      }

      investment.status = 'rejected';
      await investment.save();

      res.json({ message: 'Investment rejected successfully' });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

module.exports = {
   getPendingInvestments,
   confirmInvestment,
   rejectInvestment,
   getInvestmentDetails,
   getInvestmentStats,
};
