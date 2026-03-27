import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Tag, Button, Form, Input, InputNumber, message, Spin, Divider, List, Avatar } from 'antd';
import { ClockCircleOutlined, DollarOutlined, UserOutlined, CheckCircleOutlined, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form] = Form.useForm();
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isOwner = (currentUser?.id || currentUser?._id) === project?.client?._id;

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await axios.get(`${API_URL}/projects/${id}`);
            const projectData = response.data.project;
            setProject(projectData);

            // If the current user is the owner, fetch the proposals
            if ((currentUser?.id || currentUser?._id) === projectData.client?._id) {
                const token = localStorage.getItem('token');
                const propsRes = await axios.get(`${API_URL}/proposals/project/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProposals(propsRes.data.proposals);
            }
        } catch (error) {
            message.error('Failed to load project details');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitProposal = async (values) => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning('Please login to submit a proposal');
            navigate('/login');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(
                `${API_URL}/proposals`,
                {
                    projectId: id,
                    ...values,
                    deliveryTime: { value: values.deliveryDays, unit: 'days' }
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success('Proposal submitted successfully!');
            form.resetFields();
            fetchProject(); // Refresh to show updated proposal count
        } catch (error) {
            message.error(error.response?.data?.error || 'Failed to submit proposal');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAcceptProposal = async (proposalId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${API_URL}/proposals/${proposalId}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success('Proposal accepted successfully! The project is now in-progress.');
            fetchProject(); // Refresh to update project status and proposals list
        } catch (error) {
            message.error(error.response?.data?.error || 'Failed to accept proposal');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!project) {
        return <div className="min-h-screen flex items-center justify-center">Project not found</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-3xl">⚓</span>
                        <span className="text-2xl font-bold text-gradient">Zembl</span>
                    </Link>
                    <Button onClick={() => navigate('/browse')}>← Back to Browse</Button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Project Info */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="rounded-2xl shadow-xl">
                            <Tag color="blue" className="mb-4">{project.category}</Tag>
                            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

                            <div className="flex gap-6 mb-6 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <ClockCircleOutlined />
                                    <span>Posted: {new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <UserOutlined />
                                    <span>{project.proposalCount || 0} Proposals</span>
                                </div>
                            </div>

                            <Divider />

                            <h3 className="text-lg font-semibold mb-3">Description</h3>
                            <p className="text-gray-700 whitespace-pre-wrap mb-6">{project.description}</p>

                            <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.skills?.map((skill, idx) => (
                                    <Tag key={idx} color="blue" className="px-3 py-1">{skill}</Tag>
                                ))}
                            </div>

                            <h3 className="text-lg font-semibold mb-3">Client Information</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                    {project.client?.username?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-semibold">{project.client?.username}</div>
                                    <div className="text-sm text-gray-500">
                                        {project.client?.profile?.companyName || 'Individual Client'}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Conditional Section: Owner sees proposals, Freelancers see submission form */}
                        {isOwner ? (
                            <Card className="rounded-2xl shadow-xl">
                                <h2 className="text-2xl font-bold mb-6">Proposals Received ({proposals.length})</h2>
                                {proposals.length === 0 ? (
                                    <p className="text-gray-500">No proposals have been submitted for this project yet.</p>
                                ) : (
                                    <List
                                        itemLayout="vertical"
                                        dataSource={proposals}
                                        renderItem={proposal => (
                                            <List.Item className="border border-gray-200 rounded-lg mb-4 p-6 bg-white shadow-sm">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex gap-4">
                                                        <Avatar size={48} className="bg-gradient-to-r from-amber-400 to-orange-500">
                                                            {proposal.freelancer?.username?.[0]?.toUpperCase()}
                                                        </Avatar>
                                                        <div>
                                                            <div className="text-lg font-bold">{proposal.freelancer?.username}</div>
                                                            <div className="text-gray-500 text-sm">Feedback Rating: ★ {proposal.freelancer?.rating?.average || 0}</div>
                                                        </div>
                                                    </div>
                                                    <Tag color={proposal.status === 'pending' ? 'gold' : proposal.status === 'accepted' ? 'green' : 'red'}>
                                                        {proposal.status.toUpperCase()}
                                                    </Tag>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Bid Amount</div>
                                                        <div className="text-xl font-bold text-green-600">${proposal.bidAmount}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Delivery Time</div>
                                                        <div className="text-xl font-semibold">{proposal.deliveryTime?.value} {proposal.deliveryTime?.unit}</div>
                                                    </div>
                                                </div>

                                                <div className="mb-6">
                                                    <div className="font-semibold mb-2">Cover Letter:</div>
                                                    <p className="text-gray-700 whitespace-pre-wrap">{proposal.coverLetter}</p>
                                                </div>

                                                {project.status === 'open' && proposal.status === 'pending' && (
                                                    <Button 
                                                        type="primary" 
                                                        size="large" 
                                                        icon={<CheckCircleOutlined />} 
                                                        className="bg-gradient-to-r from-green-500 to-emerald-600 border-none w-full"
                                                        onClick={() => handleAcceptProposal(proposal._id)}
                                                    >
                                                        Accept this Proposal & Allocate Project
                                                    </Button>
                                                )}
                                                {project.assignedTo === proposal.freelancer?._id && (
                                                    <div className="text-center font-bold text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                                                        <CheckCircleOutlined className="mr-2" /> This freelancer has been allocated to the project.
                                                    </div>
                                                )}
                                            </List.Item>
                                        )}
                                    />
                                )}
                            </Card>
                        ) : (
                            <Card className="rounded-2xl shadow-xl">
                                <h2 className="text-2xl font-bold mb-6">Submit Your Proposal</h2>
                                {project.status === 'open' ? (
                                    <>
                                        <Form
                                            form={form}
                                            layout="vertical"
                                            onFinish={handleSubmitProposal}
                                        >
                                            <Form.Item
                                                name="coverLetter"
                                                label="Cover Letter"
                                                rules={[{ required: true, message: 'Please write a cover letter' }]}
                                            >
                                                <Input.TextArea
                                                    rows={6}
                                                    placeholder="Explain why you're the best fit for this project..."
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name="bidAmount"
                                                label="Your Bid Amount ($)"
                                                rules={[{ required: true, message: 'Please enter your bid' }]}
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
                                                label="Delivery Time (Days)"
                                                rules={[{ required: true, message: 'Please enter delivery time' }]}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    className="w-full"
                                                    size="large"
                                                />
                                            </Form.Item>

                                            <Form.Item>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    loading={submitting}
                                                    size="large"
                                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-none"
                                                >
                                                    Submit Individual Proposal
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                        
                                        <Divider className="my-6">OR</Divider>

                                        <Button
                                            type="default"
                                            size="large"
                                            onClick={() => navigate(`/squad-builder/${id}`)}
                                            className="w-full h-14 border-2 border-orange-400 text-orange-600 bg-orange-50 hover:bg-orange-100 font-bold text-lg shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <TeamOutlined /> Form a Squad to Tackle This Project
                                        </Button>
                                    </>
                                ) : (
                                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                                        <p className="text-lg text-gray-600">This project is no longer accepting new proposals.</p>
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="rounded-2xl shadow-xl">
                            <h3 className="text-lg font-semibold mb-4">Project Budget</h3>
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                ${project.budget?.min} - ${project.budget?.max}
                            </div>
                            <div className="text-sm text-gray-500 mb-4">
                                {project.budget?.type === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
                            </div>

                            <Divider />

                            <h3 className="text-lg font-semibold mb-4">Project Duration</h3>
                            <div className="text-xl font-semibold">
                                {project.duration?.value} {project.duration?.unit}
                            </div>

                            <Divider />

                            <h3 className="text-lg font-semibold mb-4">Status</h3>
                            <Tag
                                color={project.status === 'open' ? 'green' : 'gray'}
                                className="text-base px-4 py-1"
                            >
                                {project.status.toUpperCase()}
                            </Tag>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
