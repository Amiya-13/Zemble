import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Sentiment from 'sentiment';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import proposalRoutes from './routes/proposals.js';
import userRoutes from './routes/users.js';
import squadRoutes from './routes/squads.js';

// Import models for review functionality
import Review from './models/Review.js';

dotenv.config();

const app = express();
const sentiment = new Sentiment();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://squad-hub-12.preview.emergentagent.com',
        'https://zemble.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
console.log('🔄 Connecting to MongoDB Atlas...');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Atlas Connected Successfully!');
        console.log('📊 Database: zemble');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.error('💡 Check your .env file and MongoDB Atlas settings');
        process.exit(1);
    });

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/squads', squadRoutes);

// ========== REVIEW ROUTES ==========

// Analyze review
app.post('/api/reviews/analyze', async (req, res) => {
    try {
        const { rating, text, freelancerId, clientName } = req.body;

        if (!rating || !text) {
            return res.status(400).json({ error: 'Rating and text are required' });
        }

        const analysis = sentiment.analyze(text);
        const sentimentScore = analysis.score;

        let trustLabel;
        if (text.trim().length < 15) {
            trustLabel = 'Low Effort';
        } else if (rating === 5 && sentimentScore < 0) {
            trustLabel = 'Potential Mismatch';
        } else {
            trustLabel = 'Verified Authentic';
        }

        const review = new Review({
            rating,
            text,
            trustLabel,
            sentimentScore,
            freelancerId,
            clientName
        });

        await review.save();

        res.json({
            success: true,
            review: {
                id: review._id,
                rating,
                text,
                trustLabel,
                sentimentScore,
                analysis: {
                    positive: analysis.positive,
                    negative: analysis.negative,
                    comparative: analysis.comparative
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const { freelancerId } = req.query;
        const query = freelancerId ? { freelancerId } : {};
        const reviews = await Review.find(query).sort({ createdAt: -1 });
        res.json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.json({
        status: 'ok',
        message: 'Zembl API is running (MongoDB Atlas MODE)',
        timestamp: new Date().toISOString(),
        database: {
            status: dbStatus,
            name: 'zemble'
        },
        features: [
            'Authentication',
            'Project Management',
            'Bidding System',
            'AI Review Verification',
            'Persistent Data Storage'
        ]
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Zembl Backend Server running on port ${PORT}`);
    console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
    console.log(`\n💾 MongoDB Atlas Mode - Data persistence enabled!`);
    console.log(`\n📍 Available Endpoints:`);
    console.log(`   Auth:      /api/auth/*`);
    console.log(`   Projects:  /api/projects/*`);
    console.log(`   Proposals: /api/proposals/*`);
    console.log(`   Reviews:   /api/reviews/*`);
    console.log(`\n🎯 Create accounts via /api/auth/register`);
    console.log(`   Or use the frontend at http://localhost:5173/login`);
});

export default app;
