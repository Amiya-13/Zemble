import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['escrow', 'release', 'refund', 'fee'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'held', 'released', 'refunded', 'completed'],
        default: 'pending'
    },
    milestone: {
        type: mongoose.Schema.Types.ObjectId
    },
    description: String,
    platformFee: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date
});

export default mongoose.model('Transaction', transactionSchema);
