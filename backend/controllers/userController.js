import User from '../models/User.js';

export const getFreelancers = async (req, res) => {
    try {
        const freelancers = await User.find({ userType: 'freelancer' })
            .select('-password')
            .sort({ 'rating.average': -1 }); // Sort by highest rated
        res.json({ success: true, freelancers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { getFreelancers };
