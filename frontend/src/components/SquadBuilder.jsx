import React, { useState, useEffect } from 'react';
import { Transfer, Tag, Card, Button, message, Spin, Form, Input, InputNumber, Divider } from 'antd';
import { FireOutlined, TeamOutlined, StarOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from './BackButton';
import axios from 'axios';

const SquadBuilder = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [availableTalent, setAvailableTalent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (projectId) {
                    const projRes = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
                    setProject(projRes.data.project);
                }

                const response = await axios.get('http://localhost:5000/api/users/freelancers');
                const formatted = response.data.freelancers.map(f => ({
                    key: f._id,
                    title: `${f.profile?.firstName || f.username} ${f.profile?.lastName || ''}`.trim() || f.username,
                    description: f.profile?.bio || 'Freelancer Specialization',
                    tags: f.profile?.skills || [],
                    rating: f.rating?.average || 0
                }));
                const currentUser = JSON.parse(localStorage.getItem('user'));
                setAvailableTalent(formatted.filter(f => f.key !== currentUser?.id && f.key !== currentUser?._id));
            } catch (error) {
                console.error('Failed to fetch data', error);
                message.error('Failed to load builder data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId]);

    const calculateCompatibilityScore = (selectedFreelancers) => {
        if (selectedFreelancers.length < 2) return 0;
        const tagCounts = {};
        selectedFreelancers.forEach(freelancer => {
            freelancer.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        const sharedTags = Object.entries(tagCounts)
            .filter(([tag, count]) => count >= 2)
            .map(([tag]) => tag);
        const baseScore = 60;
        const sharedTagBonus = Math.min(sharedTags.length * 10, 40);
        return { score: baseScore + sharedTagBonus, sharedTags };
    };

    const onChange = (nextTargetKeys) => setTargetKeys(nextTargetKeys);
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const selectedFreelancers = availableTalent.filter(item => targetKeys.includes(item.key));
    const compatibility = calculateCompatibilityScore(selectedFreelancers);

    const handleAnchorSquad = async (values) => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning('You must be logged in to build a squad');
            navigate('/login');
            return;
        }
        if (targetKeys.length === 0) {
            message.warning('Please add at least one freelancer to your squad');
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(
                'http://localhost:5000/api/proposals/squad',
                {
                    projectId,
                    squadName: values.squadName,
                    targetIds: targetKeys,
                    coverLetter: values.coverLetter,
                    bidAmount: values.bidAmount,
                    deliveryTime: { value: values.deliveryDays, unit: 'days' }
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success('Squad Proposal Dispatched! Invitations sent to all members.');
            setTargetKeys([]);
            form.resetFields();
            setTimeout(() => navigate('/dashboard/freelancer'), 2000);
        } catch (error) {
            message.error(error.response?.data?.error || 'Failed to dispatch squad proposal');
        } finally {
            setSubmitting(false);
        }
    };

    const renderItem = (item) => {
        const customLabel = (
            <div className="py-2">
                <div className="font-semibold text-sm sm:text-base">{item.title}</div>
                <div className="text-xs sm:text-sm text-gray-500 line-clamp-1">{item.description}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map(tag => (
                        <Tag
                            key={tag}
                            color={compatibility.sharedTags?.includes(tag) ? 'blue' : 'default'}
                            className="text-xs"
                        >
                            {tag}
                        </Tag>
                    ))}
                </div>
                <div className="mt-1 flex items-center text-xs text-gray-600">
                    <StarOutlined className="text-yellow-500 mr-1" />
                    {item.rating}
                </div>
            </div>
        );
        return { label: customLabel, value: item.title };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Top nav */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-2xl sm:text-3xl">⚓</span>
                        <span className="text-xl sm:text-2xl font-bold text-gradient">Zemble</span>
                    </div>
                    <BackButton fallback="/dashboard/freelancer" label="Dashboard" />
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    {project && (
                        <div className="mb-6 inline-block bg-white px-4 sm:px-6 py-2 rounded-full shadow-sm border border-gray-200 text-sm sm:text-base">
                            Building for: <span className="font-bold text-blue-600">{project.title}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            Budget: <span className="text-green-600 font-semibold">${project.budget?.min} - ${project.budget?.max}</span>
                        </div>
                    )}
                    <Tag color="purple" className="px-4 py-1 text-sm mb-4">
                        <TeamOutlined className="mr-2" />
                        Squad Builder
                    </Tag>
                    <h1 className="text-3xl sm:text-5xl font-bold mb-4">
                        Build Your <span className="text-gradient">Dream Squad</span>
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600">
                        Assemble elite teams with AI-calculated compatibility scores
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {/* Compatibility Score Banner */}
                        {targetKeys.length >= 2 && (
                            <div className={`glass rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 ${compatibility.score >= 90 ? 'border-orange-500 bg-orange-50/50' : 'border-blue-500 bg-blue-50/50'} animate-pulse`}>
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center space-x-4">
                                        {compatibility.score >= 90 && (
                                            <FireOutlined className="text-4xl sm:text-5xl text-orange-500" />
                                        )}
                                        <div>
                                            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                                                {compatibility.score >= 90 ? '🔥 ' : ''}{compatibility.score}% Match
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {compatibility.score >= 90 ? 'Exceptional Team Synergy!' : 'Good compatibility'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-gray-700 mb-2">Shared Skills:</div>
                                        <div className="flex flex-wrap gap-1 justify-end">
                                            {compatibility.sharedTags.map(tag => (
                                                <Tag key={tag} color="blue" className="text-sm font-semibold">{tag}</Tag>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transfer Component */}
                        <Card className="shadow-2xl rounded-2xl overflow-hidden min-h-[400px]">
                            {loading ? (
                                <div className="flex justify-center items-center h-96">
                                    <Spin size="large" tip="Loading Top Talent...">
                                        <div className="w-10 h-10" />
                                    </Spin>
                                </div>
                            ) : (
                                <div className="squad-transfer overflow-x-auto">
                                    <Transfer
                                        dataSource={availableTalent}
                                        titles={['Available Talent', 'Your Squad']}
                                        targetKeys={targetKeys}
                                        selectedKeys={selectedKeys}
                                        onChange={onChange}
                                        onSelectChange={onSelectChange}
                                        render={renderItem}
                                        listStyle={{
                                            width: '100%',
                                            minWidth: 220,
                                            height: 400,
                                        }}
                                        className="squad-transfer"
                                    />
                                </div>
                            )}
                        </Card>

                        {/* Squad Summary */}
                        {targetKeys.length > 0 && (
                            <div className="glass rounded-2xl p-6 sm:p-8">
                                <h3 className="text-xl sm:text-2xl font-bold mb-6">Your Squad Summary</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-2">Team Size</div>
                                        <div className="text-2xl sm:text-3xl font-bold">
                                            {targetKeys.length + 1} Members <span className="text-sm text-gray-400 font-normal">(including you)</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-2">Avg. Rating</div>
                                        <div className="text-2xl sm:text-3xl font-bold">
                                            {(selectedFreelancers.reduce((sum, f) => sum + f.rating, 0) / Math.max(1, selectedFreelancers.length)).toFixed(1)}
                                            <StarOutlined className="text-yellow-500 ml-2" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="text-sm font-semibold text-gray-600 mb-3">All Skills Covered</div>
                                    <div className="flex flex-wrap gap-2">
                                        {[...new Set(selectedFreelancers.flatMap(f => f.tags))].map(tag => (
                                            <Tag key={tag} color="blue" className="text-sm px-3 py-1">{tag}</Tag>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="text-center text-gray-500 text-sm">
                            <p>💡 Tip: Select freelancers with overlapping skills to boost compatibility!</p>
                        </div>
                    </div>

                    {/* Proposal Submission Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="rounded-2xl shadow-xl border-t-4 border-orange-500 lg:sticky lg:top-20">
                            <h2 className="text-xl sm:text-2xl font-bold mb-2">Dispatch Squad Proposal</h2>
                            <p className="text-gray-500 mb-6 text-sm">Lock in your team and submit your collective bid.</p>

                            <Form form={form} layout="vertical" onFinish={handleAnchorSquad}>
                                <Form.Item name="squadName" label="Squad Name (Optional)">
                                    <Input placeholder="e.g. The Dream Team" size="large" />
                                </Form.Item>

                                <Form.Item
                                    name="coverLetter"
                                    label="Squad Pitch / Cover Letter"
                                    rules={[{ required: true, message: 'Please write a pitch!' }]}
                                >
                                    <Input.TextArea
                                        rows={6}
                                        placeholder="Explain how your squad will deliver this project..."
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="bidAmount"
                                    label="Total Squad Bid ($)"
                                    rules={[{ required: true, message: 'Please enter your combined bid' }]}
                                >
                                    <InputNumber min={1} className="w-full" prefix={<DollarOutlined />} size="large" />
                                </Form.Item>

                                <Form.Item
                                    name="deliveryDays"
                                    label="Estimated Delivery (Days)"
                                    rules={[{ required: true, message: 'Please enter the delivery estimate' }]}
                                >
                                    <InputNumber min={1} className="w-full" prefix={<ClockCircleOutlined />} size="large" />
                                </Form.Item>

                                <Divider />

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={submitting}
                                        size="large"
                                        disabled={targetKeys.length === 0}
                                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 border-none h-12 sm:h-14 text-base sm:text-lg font-bold shadow-md hover:shadow-lg transition-all"
                                    >
                                        <FireOutlined /> Anchor Squad & Submit Proposal
                                    </Button>
                                    {targetKeys.length === 0 && (
                                        <div className="text-center text-red-500 text-xs mt-2">
                                            *Add at least 1 member to your squad to submit.
                                        </div>
                                    )}
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div>

            <style>{`
        .squad-transfer .ant-transfer-list-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
        }
        .squad-transfer .ant-transfer-list-header-title {
          color: white;
        }
        @media (max-width: 640px) {
          .squad-transfer .ant-transfer {
            flex-direction: column;
          }
          .squad-transfer .ant-transfer-list {
            width: 100% !important;
            height: 280px !important;
          }
          .squad-transfer .ant-transfer-operation {
            transform: rotate(90deg);
            margin: 8px 0;
          }
        }
      `}</style>
        </div>
    );
};

export default SquadBuilder;
