import express from 'express';
import cors from 'cors';
import Sentiment from 'sentiment';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import mock data
import {
    mockUsers,
    mockProjects,
    mockProposals,
    mockReviews,
    findUserByEmail,
    findUserById,
    findProjectById,
    getAllProjects,
    addProject,
    addProposal,
    getProposalsForProject,
    getMyProposals
} from './mockData.js';

dotenv.config();

const app = express();
const sentiment = new Sentiment();
const JWT_SECRET = process.env.JWT_SECRET || 'zembl-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('✅ Using MOCK DATA (MongoDB not required)');
console.log('📊 Demo Accounts Available:');
console.log('   Freelancer: freelancer@demo.com / demo123');
console.log('   Client: client@demo.com / demo123');

// Auth middleware
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// ========== AUTH ROUTES ==========

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, userType, firstName, lastName } = req.body;

        if (!username || !email || !password || !userType) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            _id: String(mockUsers.length + 1),
            username,
            email,
            password: hashedPassword,
            userType,
            profile: { firstName, lastName },
            stats: { projectsCompleted: 0, totalEarned: 0, totalSpent: 0, successRate: 0 },
            rating: { average: 0, count: 0 }
        };

        mockUsers.push(newUser);

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                userType: newUser.userType,
                profile: newUser.profile
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('🔍 Login attempt:', email);
        console.log('👤 User found:', user ? 'Yes' : 'No');

        // For MOCK DATA mode, use plain text comparison for demo accounts
        const isDemoAccount = email.includes('@demo.com');
        let isPasswordValid;

        if (isDemoAccount) {
            // Plain text comparison for demo accounts
            isPasswordValid = password === user.password;
            console.log('🎭 Demo account - using plain text comparison');
        } else {
            // Bcrypt for newly registered users
            isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('🔒 New user - using bcrypt');
        }

        console.log('✅ Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

        const response = {
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                userType: user.userType,
                profile: user.profile,
                stats: user.stats,
                rating: user.rating
            }
        };
        
        console.log('📤 Sending response:', JSON.stringify(response, null, 2));
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get profile
app.get('/api/auth/profile', authMiddleware, (req, res) => {
    const user = findUserById(req.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
});

// ========== PROJECT ROUTES ==========

// Get all projects
app.get('/api/projects', (req, res) => {
    const { category, search, status } = req.query;
    const projects = getAllProjects({ category, search, status });

    // Populate client info
    const projectsWithClient = projects.map(p => ({
        ...p,
        client: findUserById(p.client)
    }));

    res.json({ success: true, projects: projectsWithClient, count: projectsWithClient.length });
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
    const project = findProjectById(req.params.id);
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    const projectWithDetails = {
        ...project,
        client: findUserById(project.client),
        assignedTo: project.assignedTo ? findUserById(project.assignedTo) : null
    };

    res.json({ success: true, project: projectWithDetails });
});

// Create project
app.post('/api/projects', authMiddleware, (req, res) => {
    const user = findUserById(req.userId);
    if (user.userType !== 'client') {
        return res.status(403).json({ error: 'Only clients can create projects' });
    }

    const projectData = {
        ...req.body,
        client: req.userId,
        status: 'open'
    };

    const newProject = addProject(projectData);
    res.status(201).json({ success: true, project: newProject });
});

// ========== PROPOSAL ROUTES ==========

// Submit proposal
app.post('/api/proposals', authMiddleware, (req, res) => {
    const user = findUserById(req.userId);
    if (user.userType !== 'freelancer') {
        return res.status(403).json({ error: 'Only freelancers can submit proposals' });
    }

    const { projectId } = req.body;
    const project = findProjectById(projectId);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    if (project.status !== 'open') {
        return res.status(400).json({ error: 'Project is not accepting proposals' });
    }

    const proposalData = {
        project: projectId,
        freelancer: req.userId,
        coverLetter: req.body.coverLetter,
        bidAmount: req.body.bidAmount,
        deliveryTime: req.body.deliveryTime
    };

    const newProposal = addProposal(proposalData);
    res.status(201).json({ success: true, proposal: newProposal });
});

// Get my proposals
app.get('/api/proposals/my/proposals', authMiddleware, (req, res) => {
    const proposals = getMyProposals(req.userId);

    const proposalsWithDetails = proposals.map(p => ({
        ...p,
        project: findProjectById(p.project),
        freelancer: findUserById(p.freelancer)
    }));

    res.json({ success: true, proposals: proposalsWithDetails });
});

// Get proposals for project
app.get('/api/proposals/project/:projectId', authMiddleware, (req, res) => {
    const project = findProjectById(req.params.projectId);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    if (project.client !== req.userId) {
        return res.status(403).json({ error: 'Not authorized' });
    }

    const proposals = getProposalsForProject(req.params.projectId);

    const proposalsWithDetails = proposals.map(p => ({
        ...p,
        freelancer: findUserById(p.freelancer)
    }));

    res.json({ success: true, proposals: proposalsWithDetails });
});

// ========== REVIEW ROUTES ==========

// Analyze review
app.post('/api/reviews/analyze', (req, res) => {
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

        const review = {
            _id: 'r' + (mockReviews.length + 1),
            rating,
            text,
            trustLabel,
            sentimentScore,
            freelancerId,
            clientName,
            createdAt: new Date()
        };

        mockReviews.push(review);

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
app.get('/api/reviews', (req, res) => {
    const { freelancerId } = req.query;
    let reviews = freelancerId
        ? mockReviews.filter(r => r.freelancerId === freelancerId)
        : mockReviews;

    res.json({ success: true, reviews });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Zembl API is running (MOCK DATA MODE)',
        timestamp: new Date().toISOString(),
        mockData: {
            users: mockUsers.length,
            projects: mockProjects.length,
            proposals: mockProposals.length
        },
        features: [
            'Authentication',
            'Project Management',
            'Bidding System',
            'AI Review Verification'
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
    console.log(`\n🎭 MOCK DATA MODE - No MongoDB required!`);
    console.log(`\n📍 Available Endpoints:`);
    console.log(`   Auth:      /api/auth/*`);
    console.log(`   Projects:  /api/projects/*`);
    console.log(`   Proposals: /api/proposals/*`);
    console.log(`   Reviews:   /api/reviews/*`);
    console.log(`\n👤 Demo Accounts:`);
    console.log(`   Freelancer: freelancer@demo.com (password: demo123)`);
    console.log(`   Client: client@demo.com (password: demo123)`);
});

export default app;
