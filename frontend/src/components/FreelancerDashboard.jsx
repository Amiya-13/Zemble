import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, List, Tag, Avatar, Tabs, Spin, Empty, message } from 'antd';
import {
    LogoutOutlined, DollarOutlined, ProjectOutlined,
    TrophyOutlined, FileTextOutlined, TeamOutlined
} from '@ant-design/icons';
import BackButton from './BackButton';
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
            message.success('Squad invitation accepted!');
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
            {/* ── Navbar ── */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center gap-2">
                    <Link to="/" className="flex items-center space-x-1.5 shrink-0">
                        <span className="text-2xl">⚓</span>
                        <span className="text-lg sm:text-xl font-bold text-gradient">Zemble</span>
                    </Link>

                    <BackButton fallback="/" />

                    <div className="flex-1" />

                    <div className="hidden sm:flex flex-col text-right shrink-0">
                        <span className="text-sm font-semibold leading-tight">{user.username}</span>
                        <span className="text-xs text-gray-500">Freelancer</span>
                    </div>
                    <Avatar size={36} className="bg-gradient-to-r from-blue-500 to-purple-600 shrink-0 text-sm font-bold">
                        {user.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Button icon={<LogoutOutlined />} onClick={handleLogout} size="small" className="shrink-0">
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
                {/* Welcome */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                        Welcome back, {user.profile?.firstName || user.username}! 👋
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base">Here's what's happening with your freelance work</p>
                </div>

                {/* ── Stats — 2×2 on mobile, 4-in-a-row on desktop ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6">
                    <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Projects Completed</div>
                        <div className="flex items-center gap-1.5">
                            <ProjectOutlined className="text-green-600" />
                            <span className="text-xl font-bold text-green-600">{user.stats?.projectsCompleted || 0}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Total Earned</div>
                        <div className="flex items-center gap-1.5">
                            <DollarOutlined className="text-blue-600" />
                            <span className="text-xl font-bold text-blue-600">${user.stats?.totalEarned || 0}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Success Rate</div>
                        <div className="flex items-center gap-1.5">
                            <TrophyOutlined className="text-red-500" />
                            <span className="text-xl font-bold text-red-500">{user.stats?.successRate || 0}%</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Rating</div>
                        <div className="text-xl font-bold text-amber-500">
                            {user.rating?.average || 0} <span className="text-sm font-normal text-gray-400">/ 5</span>
                        </div>
                    </div>
                </div>

                {/* ── Quick Actions + Profile Stats — stacked on mobile ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <Card title="🚀 Quick Actions" className="rounded-xl shadow-sm">
                        <div className="flex flex-col gap-3">
                            <Button
                                type="primary"
                                size="large"
                                block
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-none"
                                onClick={() => navigate('/browse')}
                            >
                                Browse New Projects
                            </Button>
                            <Button
                                size="large"
                                block
                                className="w-full"
                                onClick={() => { setActiveTab('proposals'); setTimeout(() => window.scrollTo({ top: 600, behavior: 'smooth' }), 100); }}
                            >
                                My Proposals
                            </Button>
                            <Button
                                size="large"
                                block
                                className="w-full"
                                onClick={() => { setActiveTab('projects'); setTimeout(() => window.scrollTo({ top: 600, behavior: 'smooth' }), 100); }}
                            >
                                My Projects
                            </Button>
                            <Button
                                size="large"
                                block
                                className="w-full"
                                onClick={() => navigate('/squad-builder')}
                            >
                                Build a Squad
                            </Button>
                        </div>
                    </Card>

                    <Card title="📊 Profile Stats" className="rounded-xl shadow-sm">
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Profile Type', value: 'Freelancer' },
                                { label: 'Member Since', value: 'January 2026' },
                                { label: 'Skills', value: user.profile?.skills?.length || 0 },
                                { label: 'Hourly Rate', value: `$${user.profile?.hourlyRate || 0}/hr` }
                            ].map((item) => (
                                <div key={item.label} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                    <span className="text-sm text-gray-500">{item.label}</span>
                                    <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* ── Squad Invites ── */}
                {myInvites.length > 0 && (
                    <Card
                        title={<span className="text-orange-600"><TeamOutlined className="mr-2" />Pending Squad Invitations</span>}
                        className="mb-6 rounded-xl shadow-sm border-2 border-orange-200 bg-orange-50/30"
                    >
                        <div className="flex flex-col gap-3">
                            {myInvites.map(squad => (
                                <div key={squad._id} className="bg-white p-3 rounded-lg border border-orange-100 flex items-center gap-3">
                                    <Avatar size={40} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${squad.leader?.username}`} className="shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm line-clamp-1">
                                            {squad.leader?.profile?.firstName || squad.leader?.username} invited you to '{squad.name}'!
                                        </div>
                                        <div className="text-xs text-gray-500 line-clamp-1">
                                            {squad.members.map(m => m.profile?.firstName || m.username).join(', ')}
                                        </div>
                                    </div>
                                    <Button
                                        type="primary"
                                        size="small"
                                        className="bg-gradient-to-r from-orange-500 to-amber-500 border-none shrink-0"
                                        onClick={() => handleAcceptInvite(squad._id)}
                                    >
                                        Accept
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* ── Skills Tags ── */}
                {user.profile?.skills && (
                    <Card title="💡 Your Skills" className="mb-6 rounded-xl shadow-sm">
                        <div className="flex flex-wrap gap-2">
                            {user.profile.skills.map((skill, idx) => (
                                <Tag key={idx} color="blue" className="text-sm px-3 py-1">{skill}</Tag>
                            ))}
                        </div>
                    </Card>
                )}

                {/* ── Proposals & Projects Tabs ── */}
                <Card className="rounded-xl shadow-sm">
                    {loadingData ? (
                        <div className="text-center py-12"><Spin size="large" /></div>
                    ) : (
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            tabBarStyle={{ overflowX: 'auto' }}
                            items={[
                                {
                                    key: 'proposals',
                                    label: (
                                        <span className="text-sm">
                                            <FileTextOutlined className="mr-1" />
                                            My Proposals ({myProposals.length})
                                        </span>
                                    ),
                                    children: (
                                        <div>
                                            {myProposals.length === 0 ? (
                                                <Empty description="You haven't submitted any proposals yet." />
                                            ) : (
                                                <div className="flex flex-col gap-3">
                                                    {myProposals.map((proposal, idx) => (
                                                        <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                                <div className="min-w-0">
                                                                    <div
                                                                        className="font-bold text-blue-600 text-sm cursor-pointer line-clamp-1"
                                                                        onClick={() => navigate(`/project/${proposal.project?._id}`)}
                                                                    >
                                                                        {proposal.project?.title}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                                        Client: {proposal.project?.client?.username}
                                                                    </div>
                                                                </div>
                                                                <Tag
                                                                    color={proposal.status === 'pending' ? 'gold' : proposal.status === 'accepted' ? 'green' : 'red'}
                                                                    className="shrink-0 text-xs"
                                                                >
                                                                    {proposal.status?.toUpperCase()}
                                                                </Tag>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                                <div className="bg-white rounded-lg p-2 border border-gray-100">
                                                                    <div className="text-xs text-gray-400">Your Bid</div>
                                                                    <div className="font-bold text-sm">${proposal.bidAmount}</div>
                                                                </div>
                                                                <div className="bg-white rounded-lg p-2 border border-gray-100">
                                                                    <div className="text-xs text-gray-400">Time</div>
                                                                    <div className="font-bold text-sm">{proposal.deliveryTime?.value}d</div>
                                                                </div>
                                                                <div className="bg-white rounded-lg p-2 border border-gray-100">
                                                                    <div className="text-xs text-gray-400">Budget</div>
                                                                    <div className="font-bold text-xs text-green-600">${proposal.project?.budget?.min}–${proposal.project?.budget?.max}</div>
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-600 text-xs mt-3 line-clamp-2">{proposal.coverLetter}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                },
                                {
                                    key: 'projects',
                                    label: (
                                        <span className="text-sm">
                                            <ProjectOutlined className="mr-1" />
                                            My Projects ({myProjects.length})
                                        </span>
                                    ),
                                    children: (
                                        <div>
                                            {myProjects.length === 0 ? (
                                                <Empty description="No projects assigned to you yet." />
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {myProjects.map(project => (
                                                        <div
                                                            key={project._id}
                                                            onClick={() => navigate(`/project/${project._id}`)}
                                                            className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                                                        >
                                                            <div className="flex flex-wrap gap-1 mb-2">
                                                                <Tag color="cyan" className="text-xs m-0">{project.category}</Tag>
                                                                <Tag color="blue" className="text-xs m-0">{project.status}</Tag>
                                                            </div>
                                                            <h3 className="font-bold text-base mb-1 line-clamp-1">{project.title}</h3>
                                                            <p className="text-gray-500 text-xs mb-3 line-clamp-2">{project.description}</p>
                                                            <div className="flex justify-between items-end pt-2 border-t border-gray-100">
                                                                <span className="font-semibold text-green-600 text-sm">${project.budget?.min}–${project.budget?.max}</span>
                                                                <Tag color="blue" className="text-xs m-0">{project.status}</Tag>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
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
