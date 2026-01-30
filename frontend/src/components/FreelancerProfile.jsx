import React from 'react';
import { Card, Tag, Rate, Avatar, Button, Divider } from 'antd';
import {
    CheckCircleOutlined,
    WarningOutlined,
    CloseCircleOutlined,
    MailOutlined,
    LinkedinOutlined,
    GithubOutlined,
    TrophyOutlined
} from '@ant-design/icons';

const FreelancerProfile = () => {
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

    // Mock reviews with trust labels
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
            text: 'Absolutely fantastic developer! Sarah delivered a complex e-commerce platform ahead of schedule. Her attention to detail and problem-solving skills are top-notch. Would hire again without hesitation!',
            trustLabel: 'Verified Authentic',
            date: '4 months ago',
        },
    ];

    // Get trust badge component
    const getTrustBadge = (trustLabel) => {
        switch (trustLabel) {
            case 'Verified Authentic':
                return (
                    <Tag
                        icon={<CheckCircleOutlined />}
                        color="success"
                        className="font-semibold px-3 py-1"
                    >
                        ✅ Verified Authentic
                    </Tag>
                );
            case 'Low Effort':
                return (
                    <Tag
                        icon={<WarningOutlined />}
                        color="warning"
                        className="font-semibold px-3 py-1"
                    >
                        ⚠️ Low Effort
                    </Tag>
                );
            case 'Potential Mismatch':
                return (
                    <Tag
                        icon={<CloseCircleOutlined />}
                        color="error"
                        className="font-semibold px-3 py-1"
                    >
                        🚫 Potential Mismatch
                    </Tag>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Profile Header Card */}
                <Card className="shadow-2xl rounded-2xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
                            <Avatar
                                size={120}
                                src={freelancer.avatar}
                                className="border-4 border-white shadow-xl"
                            />
                            <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold">{freelancer.name}</h1>
                                    {freelancer.openToAnchoring && (
                                        <Tag
                                            color="blue"
                                            className="px-4 py-1 text-base font-bold border-2 border-blue-500"
                                        >
                                            ⚓ Open to Anchoring
                                        </Tag>
                                    )}
                                </div>
                                <div className="text-xl text-gray-600 mb-3">{freelancer.role}</div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>📍 {freelancer.location}</span>
                                    <span>💼 {freelancer.projects} projects</span>
                                    <span>⏱️ {freelancer.experience}</span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 text-right">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {freelancer.hourlyRate}
                                </div>
                                <div className="flex items-center justify-end mb-3">
                                    <Rate disabled defaultValue={freelancer.rating} allowHalf className="text-lg" />
                                    <span className="ml-2 font-semibold">{freelancer.rating}</span>
                                </div>
                                <Button
                                    type="primary"
                                    size="large"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-none font-semibold"
                                >
                                    Anchor Sarah →
                                </Button>
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
                                    <Tag key={skill} color="blue" className="px-4 py-1 text-base">
                                        {skill}
                                    </Tag>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            <Button icon={<MailOutlined />} type="text">Contact</Button>
                            <Button icon={<LinkedinOutlined />} type="text">LinkedIn</Button>
                            <Button icon={<GithubOutlined />} type="text">GitHub</Button>
                        </div>
                    </div>
                </Card>

                {/* Reviews Section */}
                <Card className="shadow-2xl rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">
                            Reviews ({reviews.length})
                        </h2>
                        <Tag color="blue" className="px-3 py-1">
                            <TrophyOutlined className="mr-1" />
                            AI-Verified Reviews
                        </Tag>
                    </div>

                    {/* Review Stats */}
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-green-600">
                                    {reviews.filter(r => r.trustLabel === 'Verified Authentic').length}
                                </div>
                                <div className="text-xs text-gray-600">Verified Authentic</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {reviews.filter(r => r.trustLabel === 'Low Effort').length}
                                </div>
                                <div className="text-xs text-gray-600">Low Effort</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-red-600">
                                    {reviews.filter(r => r.trustLabel === 'Potential Mismatch').length}
                                </div>
                                <div className="text-xs text-gray-600">Potential Mismatch</div>
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
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-semibold text-base">{review.clientName}</div>
                                        <div className="text-xs text-gray-500">{review.date}</div>
                                    </div>
                                    {getTrustBadge(review.trustLabel)}
                                </div>

                                <Rate disabled defaultValue={review.rating} className="text-sm mb-2" />

                                <p className="text-gray-700 mt-2">{review.text}</p>

                                {/* Explanation for flagged reviews */}
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
