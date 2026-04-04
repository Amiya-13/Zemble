import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Statistic, Row, Col, List, Avatar, Tabs, Spin, Empty, Tag, Rate } from 'antd';
import { LogoutOutlined, DollarOutlined, ProjectOutlined, TeamOutlined } from '@ant-design/icons';
import BackButton from './BackButton';
import axios from 'axios';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [myProjects, setMyProjects] = useState([]);
    const [freelancers, setFreelancers] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [activeTab, setActiveTab] = useState('projects');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!userData || !token) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(userData));
        fetchDashboardData(token);
    }, [navigate]);

    const fetchDashboardData = async (token) => {
        setLoadingData(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const [projectsRes, freelancersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/projects/my/projects', { headers }),
                axios.get('http://localhost:5000/api/users/freelancers')
            ]);
            setMyProjects(projectsRes.data.projects || []);
            setFreelancers(freelancersRes.data.freelancers || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoadingData(false);
        }
    };

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-3">
                    <Link to="/" className="flex items-center space-x-2 shrink-0">
                        <span className="text-2xl sm:text-3xl">⚓</span>
                        <span className="text-xl sm:text-2xl font-bold text-gradient">Zemble</span>
                    </Link>
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <BackButton fallback="/" label="Home" />
                        <div className="hidden sm:block text-right">
                            <div className="font-semibold truncate">{user.profile?.companyName || user.username}</div>
                            <div className="text-xs text-gray-500">Client</div>
                        </div>
                        <Avatar size="large" className="bg-gradient-to-r from-green-500 to-blue-600 shrink-0">
                            {user.username?.[0]?.toUpperCase()}
                        </Avatar>
                        <Button icon={<LogoutOutlined />} onClick={handleLogout} size="small">
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-4xl font-bold mb-2">
                        Welcome, {user.profile?.companyName || user.username}! 🏢
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg">Manage your projects and find top talent</p>
                </div>

                {/* Stats — stacks on mobile */}
                <Row gutter={[12, 12]} className="mb-8">
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Active Projects"
                                value={4}
                                prefix={<ProjectOutlined />}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
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
                    <Col xs={24} sm={8}>
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
                <Row gutter={[12, 12]}>
                    <Col xs={24} md={12}>
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
                                <Button size="large" block onClick={() => { setActiveTab('projects'); window.scrollTo({ top: 800, behavior: 'smooth' }); }}>
                                    View My Projects
                                </Button>
                                <Button size="large" block onClick={() => { setActiveTab('freelancers'); window.scrollTo({ top: 800, behavior: 'smooth' }); }}>
                                    Browse Freelancers
                                </Button>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
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

                {/* Tabs */}
                <Card className="rounded-xl shadow-lg mt-8 mb-8 border border-white/60 bg-white/80 backdrop-blur-md">
                    {loadingData ? (
                        <div className="text-center py-12"><Spin size="large" /></div>
                    ) : (
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            size="large"
                            tabBarStyle={{ marginBottom: 24 }}
                            items={[
                                {
                                    key: 'projects',
                                    label: <span><ProjectOutlined /> Projects ({myProjects.length})</span>,
                                    children: (
                                        <div className="pt-2">
                                            {myProjects.length === 0 ? (
                                                <Empty description="You haven't posted any projects yet." />
                                            ) : (
                                                <List
                                                    grid={{ gutter: 16, xs: 1, sm: 1, md: 2 }}
                                                    dataSource={myProjects}
                                                    renderItem={project => (
                                                        <List.Item>
                                                            <Card hoverable className="h-full border border-gray-200" onClick={() => navigate(`/project/${project._id}`)}>
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <Tag color="blue" className="mb-2">{project.category}</Tag>
                                                                    <Tag color={project.status === 'open' ? 'green' : 'gold'}>{project.status.toUpperCase()}</Tag>
                                                                </div>
                                                                <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                                                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>
                                                                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-xs text-gray-400">Budget</span>
                                                                        <span className="font-semibold text-green-600 text-sm">${project.budget?.min} - ${project.budget?.max}</span>
                                                                    </div>
                                                                    <div className="flex flex-col text-right">
                                                                        <span className="text-xs text-gray-400">Proposals</span>
                                                                        <span className="font-semibold">{project.proposalCount || 0}</span>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        </List.Item>
                                                    )}
                                                />
                                            )}
                                        </div>
                                    )
                                },
                                {
                                    key: 'freelancers',
                                    label: <span><TeamOutlined /> Freelancers ({freelancers.length})</span>,
                                    children: (
                                        <div className="pt-2">
                                            {freelancers.length === 0 ? (
                                                <Empty description="No freelancers available right now." />
                                            ) : (
                                                <List
                                                    grid={{ gutter: 24, xs: 1, sm: 1, md: 1 }}
                                                    dataSource={freelancers}
                                                    renderItem={freelancer => (
                                                        <List.Item>
                                                            <Card hoverable className="border border-gray-200" onClick={() => navigate(`/freelancer/${freelancer._id}`)}>
                                                                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                                                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                                                        <Avatar size={48} src={freelancer.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${freelancer.username}`} className="shrink-0" />
                                                                        <div className="min-w-0">
                                                                            <h3 className="text-base sm:text-xl font-bold truncate">{freelancer.profile?.firstName} {freelancer.profile?.lastName}</h3>
                                                                            <div className="text-gray-500 text-sm mb-1 truncate">{freelancer.profile?.bio || 'Freelancer'}</div>
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {freelancer.profile?.skills?.slice(0, 3).map(skill => (
                                                                                    <Tag key={skill} color="orange" className="text-xs border-orange-200">{skill}</Tag>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right shrink-0">
                                                                        <div className="text-xl font-bold text-amber-600 mb-1">${freelancer.profile?.hourlyRate || 0}/hr</div>
                                                                        <div className="flex items-center justify-end mb-1">
                                                                            <Rate disabled defaultValue={freelancer.rating?.average || 0} allowHalf className="text-xs text-amber-500" />
                                                                            <span className="ml-1 text-sm font-semibold text-amber-600">{freelancer.rating?.average || 0}</span>
                                                                        </div>
                                                                        <span className="text-gray-500 text-xs">📍 {freelancer.profile?.location || 'Remote'}</span>
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        </List.Item>
                                                    )}
                                                />
                                            )}
                                        </div>
                                    )
                                }
                            ]}
                        />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ClientDashboard;
