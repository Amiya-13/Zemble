import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    text: {
        type: String,
        required: true
    },
    trustLabel: {
        type: String,
        enum: ['Verified Authentic', 'Low Effort', 'Potential Mismatch'],
        required: true
    },
    sentimentScore: {
        type: Number,
        required: true
    },
    freelancerId: String,
    clientName: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Review', reviewSchema);
