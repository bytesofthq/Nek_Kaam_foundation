
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createProject,
  getAllProjects,
  getProjectCounts,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

router.post('/', protect, adminOnly, createProject);
router.get('/', getAllProjects);
router.get('/stats/counts', getProjectCounts);
router.get('/:id', getProjectById);
router.put('/:id', protect, adminOnly, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;