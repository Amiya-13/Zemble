# Zemble - Premium Freelancer Marketplace to connect employers with employees

A full-featured freelancer marketplace with AI-powered review verification, built with MERN stack .

## 🚀 Features

### Core Features (Freelancer.com-inspired)

**Authentication & User Management**
- User registration and login (Freelancer/Client types)
- JWT-based authentication
- Secure password hashing with bcrypt
- User profile management

**Project Management**
- Create and browse projects/jobs
- Advanced search and filtering
- Project categories and skills tagging
- Project status tracking (Open, In Progress, Completed)
- Milestone-based project structure

**Bidding System**
- Freelancers submit proposals on projects
- Cover letters and custom bid amounts
- Delivery timeline estimates
- Proposal accept/reject workflow
- Track proposal status

**AI Review Verification** (Unique Feature)
- Sentiment analysis on all reviews
- Three trust labels:
  - ✅ Verified Authentic
  - ⚠️ Low Effort
  - 🚫 Potential Mismatch
- Real-time sentiment detection

**Premium UI/UX**
- Modern, clean design (Brex-style)
- Squad Builder with compatibility scoring
- Interactive landing page
- Glassmorphism effects

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Ant Design (antd)
- React Router v7
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (jsonwebtoken)
- Password Hashing (bcryptjs)
- Sentiment Analysis (sentiment npm)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or connection string)

### Setup

1. **Clone and install backend:**
```bash
cd backend
npm install
```

2. **Configure backend environment:**
Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/zembl
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
```

3. **Install frontend:**
```bash
cd frontend
npm install
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm start
# Or for development with auto-reload:
npm run dev
```

Server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Projects
- `GET /api/projects` - Browse all projects (with filters)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (clients only, protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)
- `GET /api/projects/my/projects` - Get my projects (protected)

### Proposals/Bids
- `POST /api/proposals` - Submit proposal (freelancers only, protected)
- `GET /api/proposals/my/proposals` - Get my proposals (protected)
- `GET /api/proposals/project/:projectId` - Get proposals for project (protected)
- `PUT /api/proposals/:id/accept` - Accept proposal (protected)
- `PUT /api/proposals/:id/reject` - Reject proposal (protected)

### Reviews (AI-Powered)
- `POST /api/reviews/analyze` - Analyze and save review with sentiment
- `GET /api/reviews?freelancerId=X` - Get reviews for freelancer

### Utility
- `GET /api/health` - Health check

## 📁 Project Structure

```
zembl/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── proposalController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Proposal.js
│   │   ├── Message.js
│   │   ├── Transaction.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── proposals.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SquadBuilder.jsx
│   │   │   ├── FreelancerProfile.jsx
│   │   │   └── BackendDemo.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🧪 Testing the API

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "userType": "freelancer",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a Project (Client)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Build a React Website",
    "description": "Need a modern React website",
    "category": "web-development",
    "skills": ["React", "Tailwind CSS"],
    "budget": {
      "min": 500,
      "max": 1000,
      "type": "fixed"
    }
  }'
```

### Submit Proposal (Freelancer)
```bash
curl -X POST http://localhost:5000/api/proposals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "projectId": "PROJECT_ID",
    "coverLetter": "I am experienced in React...",
    "bidAmount": 750,
    "deliveryTime": {
      "value": 7,
      "unit": "days"
    }
  }'
```

## 🎯 Frontend Pages

Navigate to these URLs in your browser:

1. **Landing Page** - `http://localhost:5173/`
   - Hero section with "Don't Just Hire. Anchor Them."
   - Interactive sentiment demo
   - CTA buttons to Squad Builder and Freelancer Profile

2. **Squad Builder** - `http://localhost:5173/squad-builder`
   - Transfer component for team building
   - Compatibility scoring (🔥 95% Match for shared skills)
   - Visual skill tag highlighting

3. **Freelancer Profile** - `http://localhost:5173/freelancer/1`
   - ⚓ Open to Anchoring badge
   - AI-verified reviews with color-coded trust labels
   - Review statistics dashboard

4. **Backend Demo** - `http://localhost:5173/backend-demo`
   - Test the review analysis API
   - See real sentiment analysis results

## 🔐 Authentication Flow

1. User registers with email, password, and user type (freelancer/client)
2. Password is hashed with bcrypt before storing
3. On login, JWT token is generated and returned
4. Frontend stores token and includes it in `Authorization: Bearer TOKEN` header
5. Protected routes verify token via middleware

## 🎨 Key Differentiators

**vs Freelancer.com:**
1. **AI Review Verification** - Automatic sentiment analysis on all reviews
2. **Anchoring Concept** - Focus on long-term talent retention
3. **Squad Compatibility Scoring** - Smart team synergy calculations
4. **Premium Modern UI** - Glassmorphism, gradients, smooth animations
5. **Trust-First Approach** - Verified badges on every review

## 🚀 Next Steps for Production

- [ ] Add email verification
- [ ] Implement messaging system (real-time with Socket.io)
- [ ] Add payment integration (Stripe/PayPal)
- [ ] File upload for portfolios and attachments
- [ ] Advanced search with Elasticsearch
- [ ] Notifications system
- [ ] Admin dashboard
- [ ] Deploy to production (Vercel + Render/Railway)

## 📝 Environment Variables

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/zembl
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## 🤝 Contributing

This is a prototype implementation. Feel free to extend with additional features!

---

Built with ⚓ by the Zembl Team
