import Proposal from '../models/Proposal.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Squad from '../models/Squad.js';

// Submit proposal (freelancers only)
export const submitProposal = async (req, res) => {
    try {
        const freelancer = await User.findById(req.userId);
        if (freelancer.userType !== 'freelancer') {
            return res.status(403).json({ error: 'Only freelancers can submit proposals' });
        }

        const { projectId, coverLetter, bidAmount, deliveryTime, milestones } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.status !== 'open') {
            return res.status(400).json({ error: 'Project is not accepting proposals' });
        }

        // Check if already submitted
        const existing = await Proposal.findOne({ project: projectId, freelancer: req.userId });
        if (existing) {
            return res.status(400).json({ error: 'You have already submitted a proposal for this project' });
        }

        const proposal = new Proposal({
            project: projectId,
            freelancer: req.userId,
            coverLetter,
            bidAmount,
            deliveryTime,
            milestones
        });

        await proposal.save();

        // Update project
        project.proposals.push(proposal._id);
        project.proposalCount += 1;
        await project.save();

        res.status(201).json({ success: true, proposal });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Submit squad proposal
export const submitSquadProposal = async (req, res) => {
    try {
        const freelancer = await User.findById(req.userId);
        if (freelancer.userType !== 'freelancer') {
            return res.status(403).json({ error: 'Only freelancers can submit proposals' });
        }

        const { projectId, coverLetter, bidAmount, deliveryTime, targetIds } = req.body;

        const project = await Project.findById(projectId);
        if (!project || project.status !== 'open') {
            return res.status(400).json({ error: 'Project is not accepting proposals' });
        }

        // Check if leader already submitted
        const existing = await Proposal.findOne({ project: projectId, freelancer: req.userId });
        if (existing) {
            return res.status(400).json({ error: 'You have already submitted a proposal for this project' });
        }

        // Create the Squad
        const invites = targetIds.filter(id => id !== req.userId);
        const squad = new Squad({
            project: projectId,
            leader: req.userId,
            members: [req.userId],
            pendingInvites: invites
        });
        await squad.save();

        // Create the Proposal
        const proposal = new Proposal({
            project: projectId,
            freelancer: req.userId, // Stored as the leader
            squad: squad._id,
            coverLetter,
            bidAmount,
            deliveryTime
        });
        await proposal.save();

        // Update project
        project.proposals.push(proposal._id);
        project.proposalCount += 1;
        await project.save();

        res.status(201).json({ success: true, proposal, squad });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get proposals for a project (client only)
export const getProjectProposals = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.client.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const proposals = await Proposal.find({ project: req.params.projectId })
            .populate('freelancer', 'username profile rating stats')
            .sort({ createdAt: -1 });

        res.json({ success: true, proposals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Accept proposal
export const acceptProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id).populate('project');

        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        if (proposal.project.client.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        proposal.status = 'accepted';
        await proposal.save();

        // Update project
        const project = await Project.findById(proposal.project._id);
        project.status = 'in-progress';
        project.assignedTo = proposal.freelancer;
        await project.save();

        res.json({ success: true, proposal, message: 'Proposal accepted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reject proposal
export const rejectProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id).populate('project');

        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        if (proposal.project.client.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        proposal.status = 'rejected';
        await proposal.save();

        res.json({ success: true, message: 'Proposal rejected' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get my proposals (freelancer)
export const getMyProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find({ freelancer: req.userId })
            .populate('project', 'title status budget client')
            .populate({
                path: 'project',
                populate: { path: 'client', select: 'username profile' }
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, proposals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { submitProposal, submitSquadProposal, getProjectProposals, acceptProposal, rejectProposal, getMyProposals };
