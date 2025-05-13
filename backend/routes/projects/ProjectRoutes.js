const express = require('express');
const {
   createProject,
   getAllProjects,
   getProjectById,
   updateProjectStatus,
} = require('../../controllers/projects/ProjectController');
const authMiddleware = require('../../middleware/farmers/authMiddleware');
const adminAuth = require('../../middleware/admins/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createProject);
router.get('/', adminAuth, getAllProjects);
router.get('/:id', adminAuth, getProjectById);
router.patch('/:id/status', adminAuth, updateProjectStatus);

module.exports = router;
