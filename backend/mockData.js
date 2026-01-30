// Mock database with hardcoded data
export const mockUsers = [
    {
        _id: '1',
        username: 'sarahdev',
        email: 'freelancer@demo.com',
        password: 'demo123', // Plain text for demo mode
        userType: 'freelancer',
        profile: {
            firstName: 'Sarah',
            lastName: 'Chen',
            bio: 'Full-stack developer with 8+ years of experience',
            skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
            hourlyRate: 75,
            openToAnchoring: true,
            avatar: '👩‍💻'
        },
        stats: {
            projectsCompleted: 45,
            totalEarned: 125000,
            successRate: 98
        },
        rating: {
            average: 4.9,
            count: 42
        }
    },
    {
        _id: '2',
        username: 'techcorp',
        email: 'client@demo.com',
        password: 'demo123', // Plain text for demo mode
        userType: 'client',
        profile: {
            firstName: 'Tech',
            lastName: 'Corp',
            companyName: 'TechCorp Inc.',
            companySize: '50-100',
            bio: 'Leading technology company',
            avatar: '🏢'
        },
        stats: {
            projectsCompleted: 12,
            totalSpent: 85000,
            successRate: 95
        },
        rating: {
            average: 4.8,
            count: 15
        }
    },
    {
        _id: '3',
        username: 'marcusw',
        email: 'marcus@demo.com',
        password: 'demo123', // Plain text for demo mode
        userType: 'freelancer',
        profile: {
            firstName: 'Marcus',
            lastName: 'Williams',
            bio: 'UI/UX Designer & Frontend Specialist',
            skills: ['Figma', 'React', 'Tailwind CSS', 'Design Systems'],
            hourlyRate: 65,
            openToAnchoring: true,
            avatar: '🎨'
        },
        stats: {
            projectsCompleted: 32,
            totalEarned: 78000,
            successRate: 96
        },
        rating: {
            average: 4.7,
            count: 28
        }
    }
];

export const mockProjects = [
    {
        _id: 'p1',
        title: 'Build E-commerce Website',
        description: 'Need a modern React-based e-commerce platform with payment integration, product catalog, and admin dashboard.',
        category: 'web-development',
        skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        budget: { min: 2000, max: 5000, type: 'fixed' },
        duration: { value: 30, unit: 'days' },
        client: '2',
        status: 'open',
        proposalCount: 5,
        viewCount: 23,
        createdAt: new Date('2026-01-20'),
        proposals: []
    },
    {
        _id: 'p2',
        title: 'Mobile App Development',
        description: 'Looking for React Native developer to build cross-platform fitness tracking app.',
        category: 'mobile-development',
        skills: ['React Native', 'Firebase', 'TypeScript'],
        budget: { min: 3000, max: 7000, type: 'fixed' },
        duration: { value: 45, unit: 'days' },
        client: '2',
        status: 'open',
        proposalCount: 3,
        viewCount: 18,
        createdAt: new Date('2026-01-22'),
        proposals: []
    },
    {
        _id: 'p3',
        title: 'Logo Design & Branding',
        description: 'Need complete branding package including logo, color scheme, and brand guidelines.',
        category: 'design',
        skills: ['Figma', 'Illustrator', 'Branding'],
        budget: { min: 500, max: 1500, type: 'fixed' },
        duration: { value: 14, unit: 'days' },
        client: '2',
        status: 'in-progress',
        assignedTo: '3',
        proposalCount: 8,
        viewCount: 45,
        createdAt: new Date('2026-01-15'),
        proposals: []
    },
    {
        _id: 'p4',
        title: 'API Development for SaaS Platform',
        description: 'Build RESTful API with authentication, rate limiting, and comprehensive documentation.',
        category: 'web-development',
        skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
        budget: { min: 4000, max: 8000, type: 'fixed' },
        duration: { value: 60, unit: 'days' },
        client: '2',
        status: 'open',
        proposalCount: 2,
        viewCount: 12,
        createdAt: new Date('2026-01-25'),
        proposals: []
    }
];

export const mockProposals = [
    {
        _id: 'pr1',
        project: 'p1',
        freelancer: '1',
        coverLetter: 'I have extensive experience building e-commerce platforms with React and have delivered 15+ similar projects.',
        bidAmount: 3500,
        deliveryTime: { value: 25, unit: 'days' },
        status: 'pending',
        createdAt: new Date('2026-01-21')
    },
    {
        _id: 'pr2',
        project: 'p2',
        freelancer: '1',
        coverLetter: 'React Native expert with 5 years of mobile development experience.',
        bidAmount: 5000,
        deliveryTime: { value: 40, unit: 'days' },
        status: 'pending',
        createdAt: new Date('2026-01-23')
    }
];

export const mockReviews = [
    {
        _id: 'r1',
        rating: 5,
        text: 'Excellent work! Very professional and delivered ahead of schedule.',
        trustLabel: 'Verified Authentic',
        sentimentScore: 5,
        freelancerId: '1',
        clientName: 'TechCorp',
        createdAt: new Date('2026-01-10')
    },
    {
        _id: 'r2',
        rating: 5,
        text: 'Great!',
        trustLabel: 'Low Effort',
        sentimentScore: 2,
        freelancerId: '1',
        clientName: 'StartupXYZ',
        createdAt: new Date('2026-01-05')
    },
    {
        _id: 'r3',
        rating: 4,
        text: 'Good developer, met all requirements. Minor communication delays but overall satisfied.',
        trustLabel: 'Verified Authentic',
        sentimentScore: 3,
        freelancerId: '3',
        clientName: 'DesignCo',
        createdAt: new Date('2026-01-12')
    }
];

// Helper functions
export const findUserByEmail = (email) => {
    return mockUsers.find(u => u.email === email);
};

export const findUserById = (id) => {
    return mockUsers.find(u => u._id === id);
};

export const findProjectById = (id) => {
    return mockProjects.find(p => p._id === id);
};

export const getAllProjects = (filters = {}) => {
    let filtered = [...mockProjects];

    if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
    }

    if (filters.status) {
        filtered = filtered.filter(p => p.status === filters.status);
    }

    return filtered;
};

export const addProject = (projectData) => {
    const newProject = {
        _id: 'p' + (mockProjects.length + 1),
        ...projectData,
        proposalCount: 0,
        viewCount: 0,
        createdAt: new Date(),
        proposals: []
    };
    mockProjects.push(newProject);
    return newProject;
};

export const addProposal = (proposalData) => {
    const newProposal = {
        _id: 'pr' + (mockProposals.length + 1),
        ...proposalData,
        status: 'pending',
        createdAt: new Date()
    };
    mockProposals.push(newProposal);

    // Update project proposal count
    const project = findProjectById(proposalData.project);
    if (project) {
        project.proposalCount += 1;
    }

    return newProposal;
};

export const getProposalsForProject = (projectId) => {
    return mockProposals.filter(p => p.project === projectId);
};

export const getMyProposals = (freelancerId) => {
    return mockProposals.filter(p => p.freelancer === freelancerId);
};
