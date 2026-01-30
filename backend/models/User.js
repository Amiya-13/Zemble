import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['freelancer', 'client'],
        required: true
    },
    profile: {
        firstName: String,
        lastName: String,
        avatar: String,
        bio: String,
        location: String,
        phone: String,
        // Freelancer-specific
        hourlyRate: Number,
        skills: [String],
        openToAnchoring: {
            type: Boolean,
            default: false
        },
        portfolio: [{
            title: String,
            description: String,
            image: String,
            link: String,
            category: String
        }],
        certifications: [String],
        // Client-specific
        companyName: String,
        companySize: String
    },
    stats: {
        projectsCompleted: { type: Number, default: 0 },
        totalEarned: { type: Number, default: 0 },
        totalSpent: { type: Number, default: 0 },
        successRate: { type: Number, default: 0 },
        responseTime: { type: Number, default: 0 }
    },
    verified: {
        email: { type: Boolean, default: false },
        phone: { type: Boolean, default: false },
        identity: { type: Boolean, default: false }
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);
