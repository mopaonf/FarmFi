const Project = require('../../models/projects/Project');
const Wallet = require('../../models/wallets/Wallet');
const Investment = require('../../models/investments/Investment');
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

// Farmer requests project completion
const requestProjectCompletion = async (req, res) => {
   try {
      const project = await Project.findById(req.params.id);
      if (!project)
         return res.status(404).json({ message: 'Project not found' });
      if (project.farmer.toString() !== req.user.id) {
         return res.status(403).json({ message: 'Not authorized' });
      }
      if (project.status !== 'funded') {
         return res
            .status(400)
            .json({ message: 'Only funded projects can request completion' });
      }
      project.status = 'pending_completion';
      project.completionRequest = {
         notes: req.body.notes || '',
         requestedAt: new Date(),
      };
      await project.save();
      res.json({ message: 'Completion request submitted for admin approval.' });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Admin approves project completion
const approveProjectCompletion = async (req, res) => {
   try {
      const project = await Project.findById(req.params.id);
      if (!project)
         return res.status(404).json({ message: 'Project not found' });
      if (project.status !== 'pending_completion') {
         return res
            .status(400)
            .json({ message: 'Project is not pending completion' });
      }
      project.status = 'completed';
      project.completionApprovedAt = new Date();
      await project.save();
      res.json({ message: 'Project marked as completed.' });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Farmer submits profit for a completed project
const submitProjectProfit = async (req, res) => {
   try {
      const project = await Project.findById(req.params.id);
      if (!project)
         return res.status(404).json({ message: 'Project not found' });
      if (project.farmer.toString() !== req.user.id) {
         return res.status(403).json({ message: 'Not authorized' });
      }
      if (project.status !== 'completed') {
         return res
            .status(400)
            .json({ message: 'Only completed projects can submit profit' });
      }
      const { amount, notes } = req.body;
      if (!amount || amount <= 0) {
         return res
            .status(400)
            .json({ message: 'Profit amount must be positive' });
      }

      // Deduct profit from farmer's wallet (pending transaction)
      const Wallet = require('../../models/wallets/Wallet');
      const farmerWallet = await Wallet.findOne({
         userId: req.user.id,
         userType: 'Farmer',
      });
      if (!farmerWallet) {
         return res.status(404).json({ message: 'Farmer wallet not found' });
      }
      if (farmerWallet.balance < amount) {
         return res
            .status(400)
            .json({ message: 'Insufficient wallet balance' });
      }

      // Generate a unique reference for the transaction
      const reference = `PROFIT-SUBMIT-${project._id}-${Date.now()}`;

      // Add a pending transaction for profit payout
      farmerWallet.balance -= amount;
      const transaction = {
         type: 'profit_submission',
         amount,
         status: 'pending',
         project: project._id,
         description: `Profit submission for project ${project.title}`,
         reference,
      };
      farmerWallet.transactions.push(transaction);
      await farmerWallet.save();

      // Add to profitSubmissions array on the project
      project.profitSubmissions = project.profitSubmissions || [];
      project.profitSubmissions.push({
         transactionId: reference,
         amount,
         notes: notes || '',
         submittedAt: new Date(),
         status: 'pending',
      });

      // Optionally update pendingProfit for backward compatibility
      project.pendingProfit = {
         amount,
         notes: notes || '',
         submittedAt: new Date(),
         status: 'pending',
      };

      await project.save();
      res.json({
         message:
            'Profit submitted for admin approval and recorded as a transaction.',
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Admin approves profit and distributes to investors
const approveProjectProfit = async (req, res) => {
   try {
      const project = await Project.findById(req.params.id);
      if (!project)
         return res.status(404).json({ message: 'Project not found' });
      if (
         !project.pendingProfit ||
         project.pendingProfit.status !== 'pending'
      ) {
         return res
            .status(400)
            .json({ message: 'No pending profit to approve' });
      }
      // Get all confirmed investments for this project
      const investments = await Investment.find({
         project: project._id,
         status: 'confirmed',
      });
      const totalInvested = investments.reduce(
         (sum, inv) => sum + inv.amount,
         0
      );
      if (totalInvested === 0) {
         return res
            .status(400)
            .json({ message: 'No investments to distribute profit' });
      }

      // --- Use totalProfit for distribution ---
      // Recalculate totalProfit to ensure it's up to date
      await Project.recalculateTotalProfit(project._id);
      // Use only the latest approved profit submission for this payout
      // (Or use project.totalProfit if you want to distribute all at once)
      // Here, we distribute only the pendingProfit amount
      const profitAmount = project.pendingProfit.amount;

      for (const inv of investments) {
         const share = (inv.amount / totalInvested) * profitAmount;
         // Find investor wallet
         const wallet = await Wallet.findOne({ userId: inv.investor });
         if (wallet) {
            wallet.balance += share;
            wallet.transactions.push({
               type: 'payout',
               amount: share,
               status: 'confirmed',
               project: project._id,
               investment: inv._id,
               description: `Profit payout for project ${project.title}`,
               reference: `PROFIT-${project._id}-${Date.now()}`,
            });
            await wallet.save();
         }
      }
      // Mark profit as approved
      project.pendingProfit.status = 'approved';
      await project.save();
      res.json({ message: 'Profit distributed to investors.' });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Admin approves profit submission (by transactionId)
const approveProfitSubmission = async (req, res) => {
   try {
      const { projectId, transactionId } = req.params;
      const project = await Project.findById(projectId);
      if (!project)
         return res.status(404).json({ message: 'Project not found' });

      const submission = project.profitSubmissions.find(
         (ps) => ps.transactionId === transactionId
      );
      if (!submission)
         return res
            .status(404)
            .json({ message: 'Profit submission not found' });
      if (submission.status !== 'pending') {
         return res
            .status(400)
            .json({ message: 'Submission already processed' });
      }

      submission.status = 'approved';
      submission.adminReviewedAt = new Date();
      submission.adminReviewer = req.user.id; // assuming admin id is in req.user

      // Optionally update pendingProfit for backward compatibility
      if (project.pendingProfit && project.pendingProfit.status === 'pending') {
         project.pendingProfit.status = 'approved';
      }

      // Update the corresponding wallet transaction status to 'confirmed'
      const Wallet = require('../../models/wallets/Wallet');
      const wallet = await Wallet.findOne({
         'transactions.reference': transactionId,
      });
      if (wallet) {
         const tx = wallet.transactions.find(
            (t) => t.reference === transactionId
         );
         if (tx && tx.status === 'pending') {
            tx.status = 'confirmed';
            // --- Ensure transaction amount matches the approved profit submission ---
            tx.amount = submission.amount;
            await wallet.save();
         }
      }

      // --- Recalculate totalProfit after approval ---
      await Project.recalculateTotalProfit(projectId);

      await project.save();
      res.json({ message: 'Profit submission approved.' });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Admin rejects profit submission (by transactionId)
const rejectProfitSubmission = async (req, res) => {
   try {
      const { projectId, transactionId } = req.params;
      const project = await Project.findById(projectId);
      if (!project)
         return res.status(404).json({ message: 'Project not found' });

      const submission = project.profitSubmissions.find(
         (ps) => ps.transactionId === transactionId
      );
      if (!submission)
         return res
            .status(404)
            .json({ message: 'Profit submission not found' });
      if (submission.status !== 'pending') {
         return res
            .status(400)
            .json({ message: 'Submission already processed' });
      }

      submission.status = 'rejected';
      submission.adminReviewedAt = new Date();
      submission.adminReviewer = req.user.id;

      // Optionally update pendingProfit for backward compatibility
      if (project.pendingProfit && project.pendingProfit.status === 'pending') {
         project.pendingProfit.status = 'rejected';
      }

      // Update the corresponding wallet transaction status to 'failed'
      const Wallet = require('../../models/wallets/Wallet');
      const wallet = await Wallet.findOne({
         'transactions.reference': transactionId,
      });
      if (wallet) {
         const tx = wallet.transactions.find(
            (t) => t.reference === transactionId
         );
         if (tx && tx.status === 'pending') {
            tx.status = 'failed';
            // --- Ensure transaction amount matches the rejected profit submission ---
            tx.amount = submission.amount;
            await wallet.save();
         }
      }

      // --- Recalculate totalProfit after rejection ---
      await Project.recalculateTotalProfit(projectId);

      await project.save();
      res.json({ message: 'Profit submission rejected.' });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Release profit to investors for a completed project (admin action)
const releaseProfitToInvestors = async (req, res) => {
   try {
      const projectId = req.params.id;
      const project = await Project.findById(projectId);
      if (!project)
         return res.status(404).json({ message: 'Project not found' });

      // Only allow for completed projects with profit to distribute
      if (project.status !== 'completed') {
         return res.status(400).json({ message: 'Project is not completed.' });
      }
      if (!project.totalProfit || project.totalProfit <= 0) {
         return res.status(400).json({ message: 'No profit to distribute.' });
      }
      if (!project.totalUnits || project.totalUnits <= 0) {
         return res.status(400).json({ message: 'Project has no units.' });
      }

      // Get all confirmed investments for this project
      const investments = await Investment.find({
         project: project._id,
         status: 'confirmed',
      });

      if (!investments.length) {
         return res
            .status(400)
            .json({ message: 'No investors to distribute profit.' });
      }

      // Calculate profit per unit
      const profitPerUnit = project.totalProfit / project.totalUnits;

      // Track payouts for response
      const payouts = [];

      // Distribute profit to each investor based on their units
      for (const inv of investments) {
         const investorUnits = inv.units || 0;
         if (investorUnits <= 0) continue;
         const investorProfit = profitPerUnit * investorUnits;

         // Find or create investor wallet
         let wallet = await Wallet.findOne({
            userId: inv.investor,
            userType: 'Investor',
         });
         if (!wallet) {
            wallet = new Wallet({
               userId: inv.investor,
               userType: 'Investor',
               balance: 0,
               transactions: [],
            });
         }

         wallet.balance += investorProfit;
         wallet.totalReturns = (wallet.totalReturns || 0) + investorProfit;
         wallet.transactions.push({
            type: 'payout',
            amount: investorProfit,
            status: 'confirmed',
            project: project._id,
            investment: inv._id,
            description: `Profit payout for project ${project.title}`,
            reference: `PROFIT-${project._id}-${Date.now()}-${inv.investor}`,
            paymentMethod: 'system',
         });
         await wallet.save();

         payouts.push({
            investor: inv.investor,
            units: investorUnits,
            profit: investorProfit,
         });
      }

      // Optionally, mark profit as released (add a flag or timestamp)
      project.lastProfitReleasedAt = new Date();

      // --- NEW: Mark all approved profitSubmissions as 'completed' ---
      if (Array.isArray(project.profitSubmissions)) {
         project.profitSubmissions = project.profitSubmissions.map((ps) =>
            ps.status === 'approved' ? { ...ps, status: 'completed' } : ps
         );
      }

      // --- Record profit release history ---
      project.profitReleaseHistory = project.profitReleaseHistory || [];
      project.profitReleaseHistory.push({
         amount: project.totalProfit,
         date: project.lastProfitReleasedAt,
      });
      project.lastProfitReleasedAmount = project.totalProfit;

      // --- Reset totalProfit to 0 so profit can't be released again ---
      project.totalProfit = 0;

      await project.save();

      res.json({
         message: 'Profit released to investors.',
         payouts,
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Get profit release history for a project
const getProfitReleaseHistory = async (req, res) => {
   try {
      const projectId = req.params.id;
      const project = await Project.findById(projectId);
      if (!project)
         return res.status(404).json({ message: 'Project not found' });

      // We'll use lastProfitReleasedAt and keep a history array on the project
      // If not present, fallback to profitSubmissions with status 'approved' and released
      // For now, let's assume we store a profitReleaseHistory array on the project
      // If not, fallback to lastProfitReleasedAt and last released amount
      if (
         project.profitReleaseHistory &&
         Array.isArray(project.profitReleaseHistory)
      ) {
         const total = project.profitReleaseHistory.reduce(
            (sum, r) => sum + (r.amount || 0),
            0
         );
         return res.json({
            history: project.profitReleaseHistory,
            total,
         });
      }

      // Fallback: if not, just return lastProfitReleasedAt and last released amount
      const history = [];
      if (project.lastProfitReleasedAt && project.lastProfitReleasedAmount) {
         history.push({
            amount: project.lastProfitReleasedAmount,
            date: project.lastProfitReleasedAt,
         });
      }
      return res.json({
         history,
         total: history.reduce((sum, r) => sum + (r.amount || 0), 0),
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Utility to update project locations with coordinates
const updateProjectLocations = async (req, res) => {
   try {
      // Define Cameroon bounding box
      const CAMEROON_BOUNDS = {
         north: 13.0833,
         south: 1.6546,
         west: 8.3822,
         east: 16.1921,
      };

      // Check if coordinates are within Cameroon
      const isInCameroon = (lat, lng) => {
         return (
            lat >= CAMEROON_BOUNDS.south &&
            lat <= CAMEROON_BOUNDS.north &&
            lng >= CAMEROON_BOUNDS.west &&
            lng <= CAMEROON_BOUNDS.east
         );
      };

      // Cameroon coordinates for different project types
      const sampleLocations = {
         maize: {
            lat: 10.2,
            lng: 14.3,
            radius: 0.5,
            addresses: [
               'Garoua, North Region',
               'Maroua, Far North Region',
               'Yagoua, Far North Region',
            ],
         },
         coffee: {
            lat: 5.5,
            lng: 10.4,
            radius: 0.3,
            addresses: [
               'Bafoussam, West Region',
               'Dschang, West Region',
               'Nkongsamba, Littoral Region',
            ],
         },
         avocado: {
            lat: 4.2,
            lng: 9.3,
            radius: 0.4,
            addresses: [
               'Buea, Southwest Region',
               'Limbe, Southwest Region',
               'Kumba, Southwest Region',
            ],
         },
         rice: {
            lat: 8.6,
            lng: 13.7,
            radius: 0.6,
            addresses: [
               'Yagoua, Far North Region',
               'Kousseri, Far North Region',
               'Kaele, Far North Region',
            ],
         },
         banana: {
            lat: 4.05,
            lng: 9.76,
            radius: 0.4,
            addresses: [
               'Douala, Littoral Region',
               'Tiko, Southwest Region',
               'Penja, Littoral Region',
            ],
         },
         default: {
            lat: 7.3697,
            lng: 12.3547,
            radius: 2.0,
            addresses: [
               'Ngaoundéré, Adamawa Region',
               'Yaoundé, Centre Region',
               'Bertoua, East Region',
               'Bamenda, Northwest Region',
            ],
         },
      };

      // Generate random coordinates within Cameroon for a given project category
      const getCameroonCoordinates = (project) => {
         const category = project.category?.toLowerCase() || '';
         let region = sampleLocations.default;

         if (category.includes('maize')) region = sampleLocations.maize;
         else if (category.includes('coffee')) region = sampleLocations.coffee;
         else if (category.includes('avocado'))
            region = sampleLocations.avocado;
         else if (category.includes('rice')) region = sampleLocations.rice;
         else if (category.includes('banana')) region = sampleLocations.banana;

         // Add some random variation within the region
         const randomLat = region.lat + (Math.random() - 0.5) * region.radius;
         const randomLng = region.lng + (Math.random() - 0.5) * region.radius;

         // Select a random address from the region's address list
         const randomAddressIndex = Math.floor(
            Math.random() * region.addresses.length
         );
         const address = region.addresses[randomAddressIndex];

         return {
            lat: randomLat,
            lng: randomLng,
            address: address,
         };
      };

      // Find ALL projects to check and possibly update locations
      const projects = await Project.find({});

      if (!projects.length) {
         return res.json({ message: 'No projects to update' });
      }

      // Track the number of updates made
      let updatedCount = 0;
      let resetCount = 0;

      // Update each project to ensure location is in Cameroon
      for (const project of projects) {
         let locationObj;
         let needsUpdate = false;

         // Case 1: Location is a string (old format)
         if (typeof project.location === 'string') {
            // Convert to object with Cameroon coordinates
            needsUpdate = true;
            const existingAddress = project.location;
            const cameroonCoords = getCameroonCoordinates(project);
            locationObj = {
               address: existingAddress || cameroonCoords.address,
               lat: cameroonCoords.lat,
               lng: cameroonCoords.lng,
            };
            resetCount++;
         }
         // Case 2: Location doesn't exist or is empty object
         else if (
            !project.location ||
            Object.keys(project.location).length === 0
         ) {
            needsUpdate = true;
            locationObj = getCameroonCoordinates(project);
            updatedCount++;
         }
         // Case 3: Missing lat/lng coordinates
         else if (!project.location.lat || !project.location.lng) {
            needsUpdate = true;
            const existingAddress = project.location.address;
            const cameroonCoords = getCameroonCoordinates(project);
            locationObj = {
               address: existingAddress || cameroonCoords.address,
               lat: cameroonCoords.lat,
               lng: cameroonCoords.lng,
            };
            updatedCount++;
         }
         // Case 4: Location exists but coordinates are outside Cameroon
         else if (!isInCameroon(project.location.lat, project.location.lng)) {
            needsUpdate = true;
            const existingAddress = project.location.address;
            const cameroonCoords = getCameroonCoordinates(project);
            locationObj = {
               address: existingAddress || cameroonCoords.address,
               lat: cameroonCoords.lat,
               lng: cameroonCoords.lng,
            };
            resetCount++;
         }

         if (needsUpdate && locationObj) {
            project.location = locationObj;
            await project.save();
         }
      }

      res.json({
         success: true,
         message: `Updated ${updatedCount} projects with new coordinates and reset ${resetCount} locations to be within Cameroon`,
         totalProjects: projects.length,
      });
   } catch (error) {
      console.error('Error updating project locations:', error);
      res.status(500).json({ error: error.message });
   }
};

module.exports = {
   createProject,
   getAllProjects,
   getProjectById,
   updateProjectStatus,
   updateProjectLocations,
   getProjectFundingStatus,
   getProjectFundingProgress,
   getFarmerTotalInvestment,
   requestProjectCompletion,
   approveProjectCompletion,
   submitProjectProfit,
   approveProjectProfit,
   approveProfitSubmission,
   rejectProfitSubmission,
   releaseProfitToInvestors,
   getProfitReleaseHistory,
   updateProjectLocations,
};
