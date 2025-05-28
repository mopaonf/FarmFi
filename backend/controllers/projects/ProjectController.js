const Project = require('../../models/projects/Project');
const Investment = require('../../models/investments/Investment');
const Wallet = require('../../models/wallets/Wallet');
const mongoose = require('mongoose');

const createProject = async (req, res) => {
   try {
      const project = new Project({
         ...req.body,
         farmer: req.user.id,
         status: 'submitted', // Ensure lowercase
      });
      await project.save();
      res.status(201).json(project);
   } catch (error) {
      console.error('Project submission error:', error); // Add this line
      res.status(400).json({ message: error.message, error });
   }
};

const getAllProjects = async (req, res) => {
   try {
      const { status } = req.query;
      let filter = {};

      if (status) {
         filter.status = new RegExp(`^${status}$`, 'i');
      }

      // Fetch all projects with farmer populated
      const projects = await Project.find(filter)
         .populate('farmer', 'name email')
         .sort('-createdAt');

      // For each project, fetch its total investment (confirmed only)
      const projectIds = projects.map((project) => project._id);
      const investmentsAgg = await Investment.aggregate([
         { $match: { project: { $in: projectIds }, status: 'confirmed' } },
         { $group: { _id: '$project', total: { $sum: '$amount' } } },
      ]);
      // Map: { projectId: total }
      const investmentMap = {};
      investmentsAgg.forEach((item) => {
         investmentMap[item._id.toString()] = item.total;
      });

      // Calculate available units and add to response, include totalInvestment
      const processedProjects = projects.map((project) => {
         const availableUnits =
            project.totalUnits - (project.unitsInvested || 0);
         const totalInvestment = investmentMap[project._id.toString()] || 0;
         return {
            ...project.toObject(),
            availableUnits,
            isAvailable:
               availableUnits > 0 && project.fundingStatus !== 'completed',
            totalInvestment, // <-- add this field
         };
      });

      res.json(processedProjects);
   } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: error.message });
   }
};

const getProjectById = async (req, res) => {
   try {
      // No .select() on Project, only populate farmer's name/email
      const project = await Project.findById(req.params.id).populate(
         'farmer',
         'name email'
      );
      if (!project)
         return res.status(404).json({ message: 'Project not found' });

      // Ensure backward compatibility for older projects
      if (
         !project.return_start_year_or_month &&
         project.return_start_year_or_month
      ) {
         project.return_start_year_or_month =
            project.return_start_year_or_month;
      }

      res.json(project);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

const updateProjectStatus = async (req, res) => {
   try {
      const { status } = req.body;
      // Convert status to lowercase and validate
      const normalizedStatus = status.toLowerCase();
      if (!['active', 'denied'].includes(normalizedStatus)) {
         return res.status(400).json({ message: 'Invalid status' });
      }

      const project = await Project.findByIdAndUpdate(
         req.params.id,
         { status: normalizedStatus },
         { new: true }
      );
      if (!project)
         return res.status(404).json({ message: 'Project not found' });
      res.json(project);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

const getProjectFundingStatus = async (req, res) => {
   try {
      const project = await Project.findById(req.params.id);
      if (!project) {
         return res.status(404).json({ error: 'Project not found' });
      }

      const fundingDetails = {
         totalUnits: project.totalUnits,
         unitsInvested: project.unitsInvested,
         fundingProgress: project.fundingProgress,
         fundingStatus: project.fundingStatus,
         remainingUnits: project.totalUnits - project.unitsInvested,
         totalAmount: project.totalUnits * project.unitPrice,
         raisedAmount: project.unitsInvested * project.unitPrice,
      };

      res.json(fundingDetails);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

const getProjectFundingProgress = async (req, res) => {
   try {
      const projectId = req.params.id;

      // FIX: Use new mongoose.Types.ObjectId(projectId)
      const projectObjectId = new mongoose.Types.ObjectId(projectId);

      // 1. Get total confirmed investments for this project
      const totalInvestmentAgg = await Investment.aggregate([
         { $match: { project: projectObjectId, status: 'confirmed' } },
         { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      const totalInvestment = totalInvestmentAgg[0]?.total || 0;

      // 2. Get all disbursement transactions for this project
      const disbursementTxs = await Wallet.aggregate([
         { $unwind: '$transactions' },
         {
            $match: {
               $or: [
                  { 'transactions.type': 'disbursement' },
                  { 'transactions.type': 'payout' },
               ],
               'transactions.project': projectObjectId,
            },
         },
         {
            $project: {
               id: '$transactions._id',
               project: '$transactions.project',
               amount: '$transactions.amount',
               date: '$transactions.timestamp',
               reference: '$transactions.reference',
            },
         },
      ]);

      // Get project title for each disbursement
      const project = await Project.findById(projectId).select('title');
      const projectTitle = project ? project.title : '';

      const disbursementHistory = disbursementTxs.map((tx) => ({
         id: tx.id,
         projectTitle,
         amount: tx.amount,
         date: tx.date,
         reference: tx.reference,
      }));

      res.json({
         totalInvestment,
         disbursementHistory,
      });
   } catch (error) {
      console.error('Error in getProjectFundingProgress:', error);
      res.status(500).json({ error: error.message });
   }
};

// New: Get total investment for all projects of a farmer
const getFarmerTotalInvestment = async (req, res) => {
   try {
      const farmerId = req.params.farmerId;
      // FIX: Use new mongoose.Types.ObjectId(farmerId)
      const farmerObjectId = new mongoose.Types.ObjectId(farmerId);

      // Find all project IDs for this farmer
      const projects = await Project.find({ farmer: farmerObjectId }).select(
         '_id'
      );
      const projectIds = projects.map((p) => p._id);

      if (projectIds.length === 0) {
         return res.json({ totalInvestment: 0 });
      }

      // Sum all confirmed investments for these projects
      const agg = await Investment.aggregate([
         { $match: { project: { $in: projectIds }, status: 'confirmed' } },
         { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      const totalInvestment = agg[0]?.total || 0;

      res.json({ totalInvestment });
   } catch (error) {
      console.error('Error in getFarmerTotalInvestment:', error);
      res.status(500).json({ error: error.message });
   }
};

module.exports = {
   createProject,
   getAllProjects,
   getProjectById,
   updateProjectStatus,
   getProjectFundingStatus,
   getProjectFundingProgress,
   getFarmerTotalInvestment,
};
