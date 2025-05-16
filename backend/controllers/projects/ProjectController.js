const Project = require('../../models/projects/Project');

// Farmer submits a project
exports.createProject = async (req, res) => {
   try {
      const project = new Project({
         ...req.body,
         farmer: req.user.id,
         status: 'Submitted',
      });
      await project.save();
      res.status(201).json(project);
   } catch (error) {
      console.error('Project submission error:', error); // Add this line
      res.status(400).json({ message: error.message, error });
   }
};

// Admin: Get all projects (optionally filter by status)
exports.getAllProjects = async (req, res) => {
   try {
      const { status } = req.query;
      const filter = status ? { status } : {};
      // No .select() on Project, only populate farmer's name/email
      const projects = await Project.find(filter).populate(
         'farmer',
         'name email'
      );
      res.json(projects);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Admin: Get project details
exports.getProjectById = async (req, res) => {
   try {
      // No .select() on Project, only populate farmer's name/email
      const project = await Project.findById(req.params.id).populate(
         'farmer',
         'name email'
      );
      if (!project)
         return res.status(404).json({ message: 'Project not found' });

      // Ensure backward compatibility for older projects
      if (!project.return_start_year_or_month && project.return_start_year) {
         project.return_start_year_or_month = project.return_start_year;
      }

      res.json(project);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// Admin: Approve or reject project
exports.updateProjectStatus = async (req, res) => {
   try {
      const { status } = req.body;
      if (!['Active', 'Denied'].includes(status)) {
         return res.status(400).json({ message: 'Invalid status' });
      }
      const project = await Project.findByIdAndUpdate(
         req.params.id,
         { status },
         { new: true }
      );
      if (!project)
         return res.status(404).json({ message: 'Project not found' });
      res.json(project);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};
