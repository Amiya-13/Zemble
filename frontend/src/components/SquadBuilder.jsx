import React, { useState, useEffect } from 'react';
import { Transfer, Tag, Card, Button, message, Spin, Form, Input, InputNumber, Divider } from 'antd';
import { FireOutlined, TeamOutlined, StarOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const SquadBuilder = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [availableTalent, setAvailableTalent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Project context
                if (projectId) {
                    const projRes = await api.getProject(projectId);
                    setProject(projRes.data.project);
                }

                // Fetch all projects if no projectId is provided
                if (!projectId) {
                    const projectsRes = await api.getProjects();
                    setAllProjects(projectsRes.data.projects.filter(p => p.status === 'open'));
                }

                // Fetch Available Talent
                const response = await api.getFreelancers();
                const formatted = response.data.freelancers.map(f => ({
                    key: f._id,
                    title: `${f.profile?.firstName || f.username} ${f.profile?.lastName || ''}`.trim() || f.username,
                    description: f.profile?.bio || 'Freelancer Specialization',
                    tags: f.profile?.skills || [],
                    rating: f.rating?.average || 0
                }));
                // Filter out the current user
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

    // Calculate compatibility score based on shared tags
    const calculateCompatibilityScore = (selectedFreelancers) => {
        if (selectedFreelancers.length < 2) return 0;

        // Get all tags from selected freelancers
        const tagCounts = {};
        selectedFreelancers.forEach(freelancer => {
            freelancer.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        // Find shared tags (tags that appear in multiple freelancers)
        const sharedTags = Object.entries(tagCounts)
            .filter(([tag, count]) => count >= 2)
            .map(([tag]) => tag);

        // Calculate score: base 60 + (10 points per shared tag, max 40)
        const baseScore = 60;
        const sharedTagBonus = Math.min(sharedTags.length * 10, 40);
        const score = baseScore + sharedTagBonus;

        return { score, sharedTags };
    };

    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };

    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    // Get selected freelancers
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
            await api.submitSquadProposal({
                projectId,
                squadName: values.squadName,
                targetIds: targetKeys,
                coverLetter: values.coverLetter,
                bidAmount: values.bidAmount,
                deliveryTime: { value: values.deliveryDays, unit: 'days' }
            });
            message.success('Squad Proposal Dispatched! Invitations sent to all members.');
            setTargetKeys([]); // Clear selection on success
            form.resetFields();
            setTimeout(() => navigate('/dashboard/freelancer'), 2000);
        } catch (error) {
            message.error(error.response?.data?.error || 'Failed to dispatch squad proposal');
        } finally {
            setSubmitting(false);
        }
    };

    // Custom render for each item
    const renderItem = (item) => {
        const customLabel = (
            <div className="py-2">
                <div className="font-semibold text-base">{item.title}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map(tag => (
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

        return {
            label: customLabel,
            value: item.title,
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    {project && (
                        <div className="mb-6 inline-block bg-white px-6 py-2 rounded-full shadow-sm border border-gray-200">
                            Building a Squad for: <span className="font-bold text-blue-600">{project.title}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            Budget: <span className="text-green-600 font-semibold">${project.budget?.min} - ${project.budget?.max}</span>
                        </div>
                    )}
                    <Tag color="purple" className="px-4 py-1 text-sm mb-4">
                        <TeamOutlined className="mr-2" />
                        Squad Builder
                    </Tag>
                    <h1 className="text-5xl font-bold mb-4">
                        Build Your <span className="text-gradient">Dream Squad</span>
                    </h1>
                    <p className="text-xl text-gray-600">
                        Assemble elite teams with AI-calculated compatibility scores
                    </p>

                    {!projectId && (
                        <Card className="mt-8 max-w-2xl mx-auto border-2 border-dashed border-blue-300 bg-blue-50/30">
                            <h3 className="text-lg font-semibold mb-4 text-blue-800">Choose a Project to Anchor Your Squad</h3>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {allProjects.map(p => (
                                    <Button
                                        key={p._id}
                                        onClick={() => navigate(`/squad-builder/${p._id}`)}
                                        className="hover:scale-105 transition-transform"
                                    >
                                        {p.title}
                                    </Button>
                                ))}
                                {allProjects.length === 0 && <p className="text-gray-500 italic">No open projects available to bid on right now.</p>}
                            </div>
                        </Card>
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Compatibility Score Banner */}
                        {targetKeys.length >= 2 && (
                            <div className={`glass rounded-2xl p-6 mb-8 border-2 ${compatibility.score >= 90 ? 'border-orange-500 bg-orange-50/50' : 'border-blue-500 bg-blue-50/50'
                                } animate-pulse`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {compatibility.score >= 90 && (
                                            <FireOutlined className="text-5xl text-orange-500" />
                                        )}
                                        <div>
                                            <div className="text-3xl font-bold text-gray-900">
                                                {compatibility.score >= 90 ? '🔥 ' : ''}
                                                {compatibility.score}% Match
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {compatibility.score >= 90
                                                    ? 'Exceptional Team Synergy!'
                                                    : 'Good compatibility - consider adding more matching skills'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-gray-700 mb-2">Shared Skills:</div>
                                        <div className="flex flex-wrap gap-1 justify-end">
                                            {compatibility.sharedTags.map(tag => (
                                                <Tag key={tag} color="blue" className="text-sm font-semibold">
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transfer Component */}
                        <Card className="shadow-2xl rounded-2xl overflow-hidden min-h-[550px]">
                            {loading ? (
                                <div className="flex justify-center items-center h-[500px]">
                                    <Spin size="large" tip="Loading Top Talent...">
                                        <div className="w-10 h-10" />
                                    </Spin>
                                </div>
                            ) : (
                                <Transfer
                                    dataSource={availableTalent}
                                    titles={['Available Talent', 'Your Squad']}
                                    targetKeys={targetKeys}
                                    selectedKeys={selectedKeys}
                                    onChange={onChange}
                                    onSelectChange={onSelectChange}
                                    render={renderItem}
                                    listStyle={{
                                        width: 350,
                                        height: 500,
                                    }}
                                    className="squad-transfer"
                                />
                            )}
                        </Card>

                        {/* Squad Summary */}
                        {targetKeys.length > 0 && (
                            <div className="glass rounded-2xl p-8">
                                <h3 className="text-2xl font-bold mb-6">Your Squad Summary</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-2">Team Size</div>
                                        <div className="text-3xl font-bold">{targetKeys.length + 1} Members <span className="text-sm text-gray-400 font-normal">(including you)</span></div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-600 mb-2">Avg. Rating</div>
                                        <div className="text-3xl font-bold">
                                            {(selectedFreelancers.reduce((sum, f) => sum + f.rating, 0) / Math.max(1, selectedFreelancers.length)).toFixed(1)}
                                            <StarOutlined className="text-yellow-500 ml-2" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="text-sm font-semibold text-gray-600 mb-3">All Skills Covered</div>
                                    <div className="flex flex-wrap gap-2">
                                        {[...new Set(selectedFreelancers.flatMap(f => f.tags))].map(tag => (
                                            <Tag key={tag} color="blue" className="text-sm px-3 py-1">
                                                {tag}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="text-center text-gray-500 text-sm">
                            <p>💡 Tip: Select freelancers with overlapping skills to boost compatibility!</p>
                        </div>
                    </div>

                    {/* Proposal Submission Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="rounded-2xl shadow-xl sticky top-6 border-t-4 border-orange-500">
                            <h2 className="text-2xl font-bold mb-2">Dispatch Squad Proposal</h2>
                            <p className="text-gray-500 mb-6 text-sm">Lock in your team and submit your collective bid.</p>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleAnchorSquad}
                            >
                                <Form.Item
                                    name="squadName"
                                    label="Squad Name (Optional)"
                                >
                                    <Input placeholder="e.g. The Dream Team" size="large" />
                                </Form.Item>

                                <Form.Item
                                    name="coverLetter"
                                    label="Squad Pitch / Cover Letter"
                                    rules={[{ required: true, message: 'Please write a pitch detailing why your squad is perfect!' }]}
                                >
                                    <Input.TextArea
                                        rows={8}
                                        placeholder="Explain how your newly formed squad will successfully deliver this project..."
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="bidAmount"
                                    label="Total Squad Bid ($)"
                                    rules={[{ required: true, message: 'Please enter your combined total bid' }]}
                                >
                                    <InputNumber
                                        min={1}
                                        className="w-full"
                                        prefix={<DollarOutlined />}
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="deliveryDays"
                                    label="Estimated Delivery (Days)"
                                    rules={[{ required: true, message: 'Please enter the delivery estimate' }]}
                                >
                                    <InputNumber
                                        min={1}
                                        className="w-full"
                                        prefix={<ClockCircleOutlined />}
                                        size="large"
                                    />
                                </Form.Item>

                                <Divider />

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={submitting}
                                        size="large"
                                        disabled={targetKeys.length === 0 || !projectId}
                                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 border-none h-14 text-lg font-bold shadow-md hover:shadow-lg transition-all"
                                    >
                                        <FireOutlined /> Anchor Squad & Submit Proposal
                                    </Button>
                                    {targetKeys.length === 0 && (
                                        <div className="text-center text-red-500 text-xs mt-2">
                                            *You must add at least 1 member to your squad to submit a Squad Proposal.
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
      `}</style>
        </div>
    );
};

export default SquadBuilder;
