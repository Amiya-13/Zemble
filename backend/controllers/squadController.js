import Squad from '../models/Squad.js';
import User from '../models/User.js';

export const createSquad = async (req, res) => {
    try {
        const { targetIds } = req.body; // Array of invited user IDs
        
        // Ensure the leader is not inviting themselves
        const invites = targetIds.filter(id => id !== req.userId);

        const squad = new Squad({
            leader: req.userId,
            members: [req.userId], // leader is naturally a member
            pendingInvites: invites
        });
        await squad.save();
        res.status(201).json({ success: true, squad });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyInvites = async (req, res) => {
    try {
        // Find squads where the current user is in the pendingInvites array
        const squads = await Squad.find({ pendingInvites: req.userId })
            .populate('leader', 'username profile')
            .populate('members', 'username profile');
        res.json({ success: true, squads });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const acceptInvite = async (req, res) => {
    try {
        const squad = await Squad.findById(req.params.id);
        
        if (!squad) {
            return res.status(404).json({ error: 'Squad not found' });
        }

        if (!squad.pendingInvites.includes(req.userId)) {
            return res.status(400).json({ error: 'You do not have a pending invite for this squad' });
        }
        
        // Remove from pending
        squad.pendingInvites = squad.pendingInvites.filter(id => id.toString() !== req.userId);
        
        // Add to members
        if (!squad.members.includes(req.userId)) {
            squad.members.push(req.userId);
        }
        
        await squad.save();
        res.json({ success: true, squad, message: 'Invite accepted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { createSquad, getMyInvites, acceptInvite };
