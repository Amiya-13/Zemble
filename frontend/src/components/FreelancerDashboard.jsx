import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Statistic, Row, Col, List, Tag, Avatar, Tabs, Spin, Empty, message } from 'antd';
import { LogoutOutlined, UserOutlined, DollarOutlined, ProjectOutlined, TrophyOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';

const FreelancerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [myProposals, setMyProposals] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [myInvites, setMyInvites] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [activeTab, setActiveTab] = useState('proposals');

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
            const [proposalsRes, projectsRes, invitesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/proposals/my/proposals', { headers }),
                axios.get('http://localhost:5000/api/projects/my/projects', { headers }),
                axios.get('http://localhost:5000/api/squads/invites', { headers })
            ]);
            setMyProposals(proposalsRes.data.proposals || []);
            setMyProjects(projectsRes.data.projects || []);
            setMyInvites(invitesRes.data.squads || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleAcceptInvite = async (squadId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/squads/${squadId}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success('Squad invitation accepted! You are now successfully anchored to the team.');
            fetchDashboardData(token);
        } catch (error) {
            message.error(error.response?.data?.error || 'Failed to accept squad invite');
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
                                <Button size="large" block onClick={() => { setActiveTab('proposals'); window.scrollTo({ top: 800, behavior: 'smooth' }); }}>
                                    My Proposals
                                </Button>
                                <Button size="large" block onClick={() => { setActiveTab('projects'); window.scrollTo({ top: 800, behavior: 'smooth' }); }}>
                                    My Projects
                                </Button>
                                <Button size="large" block onClick={() => navigate('/squad-builder')}>
                                    Build a Squad
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

                {/* Pending Squad Invites */}
                {myInvites.length > 0 && (
                    <Card 
                        title={<span className="text-xl text-orange-600"><TeamOutlined className="mr-2"/> Pending Squad Invitations</span>} 
                        className="mt-6 rounded-xl shadow-lg border-2 border-orange-300 bg-orange-50/30 backdrop-blur"
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={myInvites}
                            renderItem={squad => (
                                <List.Item
                                    className="bg-white p-4 rounded-lg mb-2 shadow-sm border border-orange-100"
                                    actions={[
                                        <Button 
                                            type="primary" 
                                            onClick={() => handleAcceptInvite(squad._id)}
                                            className="bg-gradient-to-r from-orange-500 to-amber-500 border-none font-bold shadow-md"
                                        >
                                            Accept Invite
                                        </Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar size="large" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${squad.leader?.username}`} className="bg-orange-200" />}
                                        title={<span className="font-bold text-lg">{squad.leader?.profile?.firstName || squad.leader?.username} invited you to join their Squad!</span>}
                                        description={`Current Team Members: ${squad.members.map(m => m.profile?.firstName || m.username).join(', ')}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                )}

                {/* Skills Tags */}
                {user.profile?.skills && (
                    <Card title="💡 Your Skills" className="mt-6 rounded-xl shadow-lg mb-8">
                        <div className="flex flex-wrap gap-2">
                            {user.profile.skills.map((skill, idx) => (
                                <Tag key={idx} color="blue" className="text-base px-4 py-2">
                                    {skill}
                                </Tag>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Proposals and Projects Tabs */}
                <Card className="rounded-xl shadow-lg mt-8">
                    {loadingData ? (
                        <div className="text-center py-12"><Spin size="large" /></div>
                    ) : (
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            size="large"
                            items={[
                                {
                                    key: 'proposals',
                                    label: <span className="text-lg"><FileTextOutlined /> My Submitted Proposals ({myProposals.length})</span>,
                                    children: (
                                        <div className="pt-4">
                                            {myProposals.length === 0 ? (
                                                <Empty description="You haven't submitted any proposals yet." />
                                            ) : (
                                                <List
                                                    itemLayout="vertical"
                                                    dataSource={myProposals}
                                                    renderItem={proposal => (
                                                        <List.Item className="bg-gray-50 rounded-lg mb-4 p-6 border border-gray-200">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div>
                                                                    <h3 className="text-xl font-bold text-blue-600">
                                                                        <Link to={`/project/${proposal.project?._id}`}>{proposal.project?.title}</Link>
                                                                    </h3>
                                                                    <div className="text-gray-500 mt-1">
                                                                        Client: {proposal.project?.client?.username}
                                                                    </div>
                                                                </div>
                                                                <Tag color={proposal.status === 'pending' ? 'gold' : proposal.status === 'accepted' ? 'green' : 'red'} className="text-sm px-3 py-1">
                                                                    {proposal.status.toUpperCase()}
                                                                </Tag>
                                                            </div>
                                                            <Row gutter={24} className="mb-4">
                                                                <Col span={8}>
                                                                    <div className="text-gray-500">Your Bid Amount</div>
                                                                    <div className="font-semibold text-lg">${proposal.bidAmount}</div>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <div className="text-gray-500">Proposed Time</div>
                                                                    <div className="font-semibold text-lg">{proposal.deliveryTime?.value} {proposal.deliveryTime?.unit}</div>
                                                                </Col>
                                                                <Col span={8}>
                                                                    <div className="text-gray-500">Project Budget</div>
                                                                    <div className="font-semibold text-lg">${proposal.project?.budget?.min} - ${proposal.project?.budget?.max}</div>
                                                                </Col>
                                                            </Row>
                                                            <div>
                                                                <div className="font-semibold mb-1">Cover Letter:</div>
                                                                <p className="text-gray-600 line-clamp-3">{proposal.coverLetter}</p>
                                                            </div>
                                                        </List.Item>
                                                    )}
                                                />
                                            )}
                                        </div>
                                    )
                                },
                                {
                                    key: 'projects',
                                    label: <span className="text-lg"><ProjectOutlined /> My Active Projects ({myProjects.length})</span>,
                                    children: (
                                        <div className="pt-4">
                                            {myProjects.length === 0 ? (
                                                <Empty description="No projects assigned to you yet." />
                                            ) : (
                                                <List
                                                    grid={{ gutter: 16, column: 2 }}
                                                    dataSource={myProjects}
                                                    renderItem={project => (
                                                        <List.Item>
                                                            <Card hoverable className="h-full border border-gray-200" onClick={() => navigate(`/project/${project._id}`)}>
                                                                <Tag color="cyan" className="mb-2">{project.category}</Tag>
                                                                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                                                <div className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</div>
                                                                <div className="flex justify-between items-center border-t pt-4 mt-auto">
                                                                    <span className="font-semibold text-green-600">Budget: ${project.budget?.min} - ${project.budget?.max}</span>
                                                                    <Tag color="blue">{project.status}</Tag>
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

export default FreelancerDashboard;
