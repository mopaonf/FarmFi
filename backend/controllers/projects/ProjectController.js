const Project = require('../../models/projects/Project');

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

      const projects = await Project.find(filter)
         .populate('farmer', 'name email')
         .sort('-createdAt');

      // Calculate available units and add to response
      const processedProjects = projects.map((project) => {
         const availableUnits =
            project.totalUnits - (project.unitsInvested || 0);
         return {
            ...project.toObject(),
            availableUnits,
            isAvailable:
               availableUnits > 0 && project.fundingStatus !== 'completed',
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

module.exports = {
   createProject,
   getAllProjects,
   getProjectById,
   updateProjectStatus,
   getProjectFundingStatus,
};
