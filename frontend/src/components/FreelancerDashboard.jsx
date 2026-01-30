import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Statistic, Row, Col, List, Tag, Avatar } from 'antd';
import { LogoutOutlined, UserOutlined, DollarOutlined, ProjectOutlined, TrophyOutlined } from '@ant-design/icons';

const FreelancerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(userData));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-3xl">⚓</span>
                        <span className="text-2xl font-bold text-gradient">Zembl</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="font-semibold">{user.username}</div>
                            <div className="text-sm text-gray-500">Freelancer</div>
                        </div>
                        <Avatar size="large" className="bg-gradient-to-r from-blue-500 to-purple-600">
                            {user.username?.[0]?.toUpperCase()}
                        </Avatar>
                        <Button icon={<LogoutOutlined />} onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, {user.profile?.firstName || user.username}! 👋
                    </h1>
                    <p className="text-gray-600 text-lg">Here's what's happening with your freelance work</p>
                </div>

                {/* Stats */}
                <Row gutter={16} className="mb-8">
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Projects Completed"
                                value={user.stats?.projectsCompleted || 0}
                                prefix={<ProjectOutlined />}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Total Earned"
                                value={user.stats?.totalEarned || 0}
                                prefix={<DollarOutlined />}
                                precision={0}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Success Rate"
                                value={user.stats?.successRate || 0}
                                suffix="%"
                                prefix={<TrophyOutlined />}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Rating"
                                value={user.rating?.average || 0}
                                precision={1}
                                suffix={`/ 5.0 (${user.rating?.count || 0})`}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Quick Actions */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="🚀 Quick Actions" className="rounded-xl shadow-lg">
                            <div className="space-y-3">
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    onClick={() => navigate('/browse')}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-none"
                                >
                                    Browse New Projects
                                </Button>
                                <Button size="large" block onClick={() => navigate('/browse')}>
                                    My Proposals
                                </Button>
                                <Button size="large" block onClick={() => navigate('/browse')}>
                                    My Projects
                                </Button>
                            </div>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card title="📊 Profile Stats" className="rounded-xl shadow-lg">
                            <List
                                itemLayout="horizontal"
                                dataSource={[
                                    { label: 'Profile Type', value: 'Freelancer' },
                                    { label: 'Member Since', value: 'January 2026' },
                                    { label: 'Skills', value: user.profile?.skills?.length || 0 },
                                    { label: 'Hourly Rate', value: `$${user.profile?.hourlyRate || 0}/hr` }
                                ]}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={item.label}
                                            description={<strong>{item.value}</strong>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Skills Tags */}
                {user.profile?.skills && (
                    <Card title="💡 Your Skills" className="mt-6 rounded-xl shadow-lg">
                        <div className="flex flex-wrap gap-2">
                            {user.profile.skills.map((skill, idx) => (
                                <Tag key={idx} color="blue" className="text-base px-4 py-2">
                                    {skill}
                                </Tag>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default FreelancerDashboard;
