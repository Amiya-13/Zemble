import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Statistic, List, Avatar, Tabs, Spin, Empty, Tag, Rate } from 'antd';
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
            {/* ── Navbar ── */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center gap-2">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-1.5 shrink-0">
                        <span className="text-2xl">⚓</span>
                        <span className="text-lg sm:text-xl font-bold text-gradient">Zemble</span>
                    </Link>

                    {/* Back button — always visible */}
                    <BackButton fallback="/" />

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* User info + logout */}
                    <div className="hidden sm:flex flex-col text-right shrink-0">
                        <span className="text-sm font-semibold leading-tight">{user.profile?.companyName || user.username}</span>
                        <span className="text-xs text-gray-500">Client</span>
                    </div>
                    <Avatar
                        size={36}
                        className="bg-gradient-to-r from-green-500 to-blue-600 shrink-0 text-sm font-bold"
                    >
                        {user.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Button
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        size="small"
                        className="shrink-0"
                    >
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
                {/* Welcome */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                        Welcome, {user.profile?.companyName || user.username}! 🏢
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base">Manage your projects and find top talent</p>
                </div>

                {/* ── Stats — 3 cards side by side (compact on mobile) ── */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                    <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Active Projects</div>
                        <div className="flex items-center gap-1.5">
                            <ProjectOutlined className="text-green-600 text-base" />
                            <span className="text-xl sm:text-2xl font-bold text-green-600">4</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Total Spent</div>
                        <div className="flex items-center gap-1.5">
                            <DollarOutlined className="text-blue-600 text-base" />
                            <span className="text-xl sm:text-2xl font-bold text-blue-600">{user.stats?.totalSpent || 0}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Projects Completed</div>
                        <div className="flex items-center gap-1.5">
                            <TeamOutlined className="text-red-500 text-base" />
                            <span className="text-xl sm:text-2xl font-bold text-red-500">{user.stats?.projectsCompleted || 0}</span>
                        </div>
                    </div>
                </div>

                {/* ── Quick Actions + Company Info — stacked on mobile ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Quick Actions */}
                    <Card title="🚀 Quick Actions" className="rounded-xl shadow-sm">
                        <div className="flex flex-col gap-3">
                            <Button
                                type="primary"
                                size="large"
                                block
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-none"
                                onClick={() => navigate('/post-project')}
                            >
                                Post New Project
                            </Button>
                            <Button
                                size="large"
                                block
                                className="w-full"
                                onClick={() => { setActiveTab('projects'); setTimeout(() => window.scrollTo({ top: 600, behavior: 'smooth' }), 100); }}
                            >
                                View My Projects
                            </Button>
                            <Button
                                size="large"
                                block
                                className="w-full"
                                onClick={() => { setActiveTab('freelancers'); setTimeout(() => window.scrollTo({ top: 600, behavior: 'smooth' }), 100); }}
                            >
                                Browse Freelancers
                            </Button>
                        </div>
                    </Card>

                    {/* Company Info */}
                    <Card title="📊 Company Info" className="rounded-xl shadow-sm">
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Company', value: user.profile?.companyName || 'N/A' },
                                { label: 'Company Size', value: user.profile?.companySize || 'N/A' },
                                { label: 'Projects Posted', value: user.stats?.projectsCompleted || 0 },
                                { label: 'Success Rate', value: `${user.stats?.successRate || 0}%` }
                            ].map((item) => (
                                <div key={item.label} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                    <span className="text-sm text-gray-500">{item.label}</span>
                                    <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* ── Tabs ── */}
                <Card className="rounded-xl shadow-sm border border-white/60 bg-white/80 backdrop-blur-md">
                    {loadingData ? (
                        <div className="text-center py-12"><Spin size="large" /></div>
                    ) : (
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            tabBarStyle={{ overflowX: 'auto' }}
                            items={[
                                {
                                    key: 'projects',
                                    label: (
                                        <span className="text-sm">
                                            <ProjectOutlined className="mr-1" />
                                            My Posted Projects ({myProjects.length})
                                        </span>
                                    ),
                                    children: (
                                        <div>
                                            {myProjects.length === 0 ? (
                                                <Empty description="You haven't posted any projects yet." />
                                            ) : (
                                                /* Single column on mobile, 2 cols on tablet+ */
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {myProjects.map(project => (
                                                        <div
                                                            key={project._id}
                                                            onClick={() => navigate(`/project/${project._id}`)}
                                                            className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                                                        >
                                                            {/* Tags row — contained, no overflow */}
                                                            <div className="flex flex-wrap gap-1 mb-3">
                                                                <Tag color="blue" className="text-xs m-0">{project.category}</Tag>
                                                                <Tag
                                                                    color={project.status === 'open' ? 'green' : 'gold'}
                                                                    className="text-xs m-0"
                                                                >
                                                                    {project.status?.toUpperCase()}
                                                                </Tag>
                                                            </div>
                                                            <h3 className="font-bold text-base mb-1 line-clamp-1">{project.title}</h3>
                                                            <p className="text-gray-500 text-xs mb-3 line-clamp-2">{project.description}</p>
                                                            <div className="flex justify-between items-end pt-2 border-t border-gray-100">
                                                                <div>
                                                                    <div className="text-xs text-gray-400">Budget</div>
                                                                    <div className="font-semibold text-green-600 text-sm">${project.budget?.min}–${project.budget?.max}</div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-xs text-gray-400">Proposals</div>
                                                                    <div className="font-semibold text-sm">{project.proposalCount || 0}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                },
                                {
                                    key: 'freelancers',
                                    label: (
                                        <span className="text-sm">
                                            <TeamOutlined className="mr-1" />
                                            Browse Freelancers ({freelancers.length})
                                        </span>
                                    ),
                                    children: (
                                        <div>
                                            {freelancers.length === 0 ? (
                                                <Empty description="No freelancers available right now." />
                                            ) : (
                                                <div className="flex flex-col gap-3">
                                                    {freelancers.map(freelancer => (
                                                        <div
                                                            key={freelancer._id}
                                                            onClick={() => navigate(`/freelancer/${freelancer._id}`)}
                                                            className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <Avatar
                                                                    size={48}
                                                                    src={freelancer.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${freelancer.username}`}
                                                                    className="shrink-0"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                                        <h3 className="font-bold text-base leading-tight line-clamp-1">
                                                                            {freelancer.profile?.firstName} {freelancer.profile?.lastName}
                                                                        </h3>
                                                                        <span className="text-amber-600 font-bold text-sm shrink-0">
                                                                            ${freelancer.profile?.hourlyRate || 0}/hr
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-gray-500 text-xs mb-2 line-clamp-1">
                                                                        {freelancer.profile?.bio || 'Freelancer'}
                                                                    </p>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {freelancer.profile?.skills?.slice(0, 2).map(skill => (
                                                                                <Tag key={skill} color="orange" className="text-xs m-0">{skill}</Tag>
                                                                            ))}
                                                                            {(freelancer.profile?.skills?.length || 0) > 2 && (
                                                                                <Tag className="text-xs m-0">+{freelancer.profile.skills.length - 2}</Tag>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-1 shrink-0">
                                                                            <span className="text-amber-500 text-xs">★</span>
                                                                            <span className="text-xs font-semibold">{freelancer.rating?.average || 0}</span>
                                                                            <span className="text-xs text-gray-400">· 📍 {freelancer.profile?.location || 'Remote'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
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

export default ClientDashboard;
