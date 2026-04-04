import React from 'react';
import { Card, Tag, Rate, Avatar, Button, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircleOutlined,
    WarningOutlined,
    CloseCircleOutlined,
    MailOutlined,
    LinkedinOutlined,
    GithubOutlined,
    TrophyOutlined,
    TeamOutlined
} from '@ant-design/icons';
import BackButton from './BackButton';

const FreelancerProfile = () => {
    const navigate = useNavigate();

    // Mock freelancer data
    const freelancer = {
        name: 'Sarah Chen',
        role: 'Senior React Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        openToAnchoring: true,
        rating: 4.9,
        hourlyRate: '$120/hr',
        location: 'San Francisco, CA',
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
        experience: '8+ years',
        projects: 47,
        bio: 'Full-stack engineer specializing in React and modern web technologies. Passionate about building scalable, user-centric applications with clean architecture.',
    };

    const reviews = [
        {
            id: 1,
            clientName: 'John Smith',
            rating: 5,
            text: 'Sarah exceeded all expectations! Her React expertise brought our dashboard to life. Communication was excellent throughout the project.',
            trustLabel: 'Verified Authentic',
            date: '2 weeks ago',
        },
        {
            id: 2,
            clientName: 'Emily Rodriguez',
            rating: 4,
            text: 'Great work on the frontend. Minor communication delays but overall satisfied with the deliverables.',
            trustLabel: 'Verified Authentic',
            date: '1 month ago',
        },
        {
            id: 3,
            clientName: 'Mike Johnson',
            rating: 5,
            text: 'Good job',
            trustLabel: 'Low Effort',
            date: '2 months ago',
        },
        {
            id: 4,
            clientName: 'Lisa Wang',
            rating: 5,
            text: 'This was terrible experience, very bad communication and missed deadlines',
            trustLabel: 'Potential Mismatch',
            date: '3 months ago',
        },
        {
            id: 5,
            clientName: 'David Park',
            rating: 5,
            text: 'Absolutely fantastic developer! Sarah delivered a complex e-commerce platform ahead of schedule. Her attention to detail and problem-solving skills are top-notch.',
            trustLabel: 'Verified Authentic',
            date: '4 months ago',
        },
    ];

    const getTrustBadge = (trustLabel) => {
        switch (trustLabel) {
            case 'Verified Authentic':
                return <Tag icon={<CheckCircleOutlined />} color="success" className="font-semibold px-2 py-0.5">✅ Verified Authentic</Tag>;
            case 'Low Effort':
                return <Tag icon={<WarningOutlined />} color="warning" className="font-semibold px-2 py-0.5">⚠️ Low Effort</Tag>;
            case 'Potential Mismatch':
                return <Tag icon={<CloseCircleOutlined />} color="error" className="font-semibold px-2 py-0.5">🚫 Potential Mismatch</Tag>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
            {/* Top Nav */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-2xl sm:text-3xl">⚓</span>
                        <span className="text-xl sm:text-2xl font-bold text-gradient">Zemble</span>
                    </div>
                    <BackButton fallback="/browse" label="Browse" />
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Profile Header Card */}
                <Card className="shadow-premium rounded-2xl mb-8 overflow-hidden border-white/60 bg-white/80 backdrop-blur-md">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-24 sm:h-32"></div>
                    <div className="px-4 sm:px-8 pb-6 sm:pb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 sm:-mt-16 mb-6 gap-4">
                            <Avatar
                                size={96}
                                src={freelancer.avatar}
                                className="border-4 border-white shadow-xl shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                    <h1 className="text-2xl sm:text-3xl font-bold">{freelancer.name}</h1>
                                    {freelancer.openToAnchoring && (
                                        <Tag
                                            color="orange"
                                            className="px-3 py-0.5 text-sm font-bold border-2 border-orange-500 bg-orange-50"
                                        >
                                            ⚓ Open to Anchoring
                                        </Tag>
                                    )}
                                </div>
                                <div className="text-lg text-gray-600 mb-2">{freelancer.role}</div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                    <span>📍 {freelancer.location}</span>
                                    <span>💼 {freelancer.projects} projects</span>
                                    <span>⏱️ {freelancer.experience}</span>
                                </div>
                            </div>
                            {/* Rate + Actions */}
                            <div className="w-full sm:w-auto text-left sm:text-right flex sm:flex-col flex-row-reverse sm:items-end items-center justify-between gap-3">
                                <div>
                                    <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">
                                        {freelancer.hourlyRate}
                                    </div>
                                    <div className="flex items-center justify-start sm:justify-end mb-2">
                                        <Rate disabled defaultValue={freelancer.rating} allowHalf className="text-sm text-amber-500" />
                                        <span className="ml-2 font-semibold text-sm">{freelancer.rating}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <Button
                                        size="default"
                                        icon={<TeamOutlined />}
                                        className="font-semibold hover:border-amber-500 hover:text-amber-600 transition-all"
                                    >
                                        Squad
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="default"
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 border-none font-semibold text-white"
                                    >
                                        Anchor →
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <Divider />

                        {/* Bio */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-2">About</h3>
                            <p className="text-gray-700">{freelancer.bio}</p>
                        </div>

                        {/* Skills */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-3">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {freelancer.skills.map(skill => (
                                    <Tag key={skill} color="orange" className="px-3 py-1 text-sm border-orange-200">
                                        {skill}
                                    </Tag>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-wrap gap-2">
                            <Button icon={<MailOutlined />} type="text">Contact</Button>
                            <Button icon={<LinkedinOutlined />} type="text">LinkedIn</Button>
                            <Button icon={<GithubOutlined />} type="text">GitHub</Button>
                        </div>
                    </div>
                </Card>

                {/* Reviews Section */}
                <Card className="shadow-premium rounded-2xl border-white/60 bg-white/80 backdrop-blur-md">
                    <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
                        <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>
                        <Tag color="orange" className="px-3 py-1">
                            <TrophyOutlined className="mr-1" />
                            AI-Verified Reviews
                        </Tag>
                    </div>

                    {/* Review Stats */}
                    <div className="bg-orange-50/50 rounded-xl p-4 mb-6 border border-orange-100">
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-green-600">
                                    {reviews.filter(r => r.trustLabel === 'Verified Authentic').length}
                                </div>
                                <div className="text-xs text-gray-600">Verified</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                                    {reviews.filter(r => r.trustLabel === 'Low Effort').length}
                                </div>
                                <div className="text-xs text-gray-600">Low Effort</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-red-600">
                                    {reviews.filter(r => r.trustLabel === 'Potential Mismatch').length}
                                </div>
                                <div className="text-xs text-gray-600">Mismatch</div>
                            </div>
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div
                                key={review.id}
                                className="border-l-4 pl-4 py-3"
                                style={{
                                    borderLeftColor:
                                        review.trustLabel === 'Verified Authentic' ? '#52c41a' :
                                            review.trustLabel === 'Low Effort' ? '#faad14' :
                                                '#ff4d4f'
                                }}
                            >
                                <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                                    <div>
                                        <div className="font-semibold text-base">{review.clientName}</div>
                                        <div className="text-xs text-gray-500">{review.date}</div>
                                    </div>
                                    {getTrustBadge(review.trustLabel)}
                                </div>

                                <Rate disabled defaultValue={review.rating} className="text-sm mb-2" />

                                <p className="text-gray-700 mt-2 text-sm sm:text-base">{review.text}</p>

                                {review.trustLabel === 'Low Effort' && (
                                    <div className="mt-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                                        ℹ️ Flagged as low effort: Review is too short (less than 15 characters)
                                    </div>
                                )}
                                {review.trustLabel === 'Potential Mismatch' && (
                                    <div className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded">
                                        ⚠️ Flagged as potential mismatch: 5-star rating with negative sentiment detected by AI
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FreelancerProfile;
