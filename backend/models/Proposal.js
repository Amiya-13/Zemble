import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    squad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Squad'
    },
    coverLetter: {
        type: String,
        required: true
    },
    bidAmount: {
        type: Number,
        required: true
    },
    deliveryTime: {
        value: Number,
        unit: {
            type: String,
            enum: ['days', 'weeks', 'months'],
            default: 'days'
        }
    },
    milestones: [{
        title: String,
        description: String,
        amount: Number,
        duration: Number
    }],
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending'
    },
    attachments: [{
        name: String,
        url: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Proposal', proposalSchema);
