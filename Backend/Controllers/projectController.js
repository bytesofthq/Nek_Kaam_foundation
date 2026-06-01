
const Project = require('../models/Project');


const createProject = async (req, res) => {
  try {
    const { title, objective, description, budget, location, status, startDate, endDate, images, completionReport } = req.body;
    
    if (!title || !objective || !description || !budget || !location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, objective, description, budget and location are required' 
      });
    }
    
    const project = await Project.create({
      title,
      objective,
      description,
      budget,
      location,
      status: status || 'Planned',
      startDate,
      endDate,
      images,
      completionReport,
      addedBy: req.admin._id
    });
    
    res.status(201).json({ 
      success: true, 
      project 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getAllProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 9, search } = req.query;
    let filter = {};
    
    if (status && ['Planned', 'Ongoing', 'Completed'].includes(status)) {
      filter.status = status;
    }
    
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Project.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getProjectCounts = async (req, res) => {
  try {
    const counts = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const result = { Planned: 0, Ongoing: 0, Completed: 0 };
    counts.forEach(item => {
      result[item._id] = item.count;
    });
    
    res.status(200).json({ 
      success: true, 
      counts: result 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      project 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      project 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectCounts,
  getProjectById,
  updateProject,
  deleteProject
};