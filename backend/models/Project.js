import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['web-development', 'mobile-development', 'design', 'writing', 'marketing', 'data-science', 'other']
    },
    skills: [{
        type: String
    }],
    budget: {
        min: Number,
        max: Number,
        type: {
            type: String,
            enum: ['fixed', 'hourly'],
            default: 'fixed'
        }
    },
    duration: {
        value: Number,
        unit: {
            type: String,
            enum: ['days', 'weeks', 'months'],
            default: 'days'
        }
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed', 'cancelled', 'disputed'],
        default: 'open'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    proposals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal'
    }],
    milestones: [{
        title: String,
        description: String,
        amount: Number,
        dueDate: Date,
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed', 'paid'],
            default: 'pending'
        }
    }],
    attachments: [{
        name: String,
        url: String,
        type: String
    }],
    tags: [String],
    viewCount: {
        type: Number,
        default: 0
    },
    proposalCount: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    deadline: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

projectSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Project', projectSchema);
