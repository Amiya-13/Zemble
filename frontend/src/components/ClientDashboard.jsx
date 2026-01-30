import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Statistic, Row, Col, List, Avatar } from 'antd';
import { LogoutOutlined, DollarOutlined, ProjectOutlined, TeamOutlined } from '@ant-design/icons';

const ClientDashboard = () => {
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
                            <div className="font-semibold">{user.profile?.companyName || user.username}</div>
                            <div className="text-sm text-gray-500">Client</div>
                        </div>
                        <Avatar size="large" className="bg-gradient-to-r from-green-500 to-blue-600">
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
                        Welcome, {user.profile?.companyName || user.username}! 🏢
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your projects and find top talent</p>
                </div>

                {/* Stats */}
                <Row gutter={16} className="mb-8">
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Active Projects"
                                value={4}
                                prefix={<ProjectOutlined />}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Total Spent"
                                value={user.stats?.totalSpent || 0}
                                prefix={<DollarOutlined />}
                                precision={0}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Projects Completed"
                                value={user.stats?.projectsCompleted || 0}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: '#cf1322' }}
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
                                    onClick={() => navigate('/post-project')}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-none"
                                >
                                    Post New Project
                                </Button>
                                <Button size="large" block onClick={() => navigate('/browse')}>
                                    View My Projects
                                </Button>
                                <Button size="large" block onClick={() => navigate('/browse')}>
                                    Browse Freelancers
                                </Button>
                            </div>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card title="📊 Company Info" className="rounded-xl shadow-lg">
                            <List
                                itemLayout="horizontal"
                                dataSource={[
                                    { label: 'Company', value: user.profile?.companyName || 'N/A' },
                                    { label: 'Company Size', value: user.profile?.companySize || 'N/A' },
                                    { label: 'Projects Posted', value: user.stats?.projectsCompleted || 0 },
                                    { label: 'Success Rate', value: `${user.stats?.successRate || 0}%` }
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

                {/* Recent Activity */}
                <Card title="📝 Recent Projects" className="mt-6 rounded-xl shadow-lg">
                    <p className="text-gray-500">Your posted projects will appear here</p>
                </Card>
            </div>
        </div>
    );
};

export default ClientDashboard;
