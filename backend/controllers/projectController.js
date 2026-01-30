import Project from '../models/Project.js';
import User from '../models/User.js';

// Create project (clients only)
export const createProject = async (req, res) => {
    try {
        const client = await User.findById(req.userId);
        if (client.userType !== 'client') {
            return res.status(403).json({ error: 'Only clients can create projects' });
        }

        const projectData = {
            ...req.body,
            client: req.userId
        };

        const project = new Project(projectData);
        await project.save();

        res.status(201).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all projects (with filters)
export const getProjects = async (req, res) => {
    try {
        const { category, skills, minBudget, maxBudget, status, search, sort } = req.query;

        let query = {};

        if (category) query.category = category;
        if (status) query.status = status;
        if (minBudget || maxBudget) {
            query['budget.min'] = {};
            if (minBudget) query['budget.min']['$gte'] = Number(minBudget);
            if (maxBudget) query['budget.max'] = { '$lte': Number(maxBudget) };
        }
        if (skills) query.skills = { $in: skills.split(',') };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'budget-high') sortOption = { 'budget.max': -1 };
        if (sort === 'budget-low') sortOption = { 'budget.max': 1 };
        if (sort === 'proposals') sortOption = { proposalCount: -1 };

        const projects = await Project.find(query)
            .populate('client', 'username profile.companyName rating')
            .sort(sortOption)
            .limit(50);

        res.json({ success: true, projects, count: projects.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single project
export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('client', 'username profile rating')
            .populate('assignedTo', 'username profile rating')
            .populate({
                path: 'proposals',
                populate: { path: 'freelancer', select: 'username profile rating' }
            });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Increment view count
        project.viewCount += 1;
        await project.save();

        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update project
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.client.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        Object.assign(project, req.body);
        await project.save();

        res.json({ success: true, project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete project
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.client.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await project.deleteOne();
        res.json({ success: true, message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get my projects
export const getMyProjects = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        let query = {};

        if (user.userType === 'client') {
            query.client = req.userId;
        } else {
            query.assignedTo = req.userId;
        }

        const projects = await Project.find(query)
            .populate('client', 'username profile')
            .populate('assignedTo', 'username profile')
            .sort({ createdAt: -1 });

        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { createProject, getProjects, getProject, updateProject, deleteProject, getMyProjects };
