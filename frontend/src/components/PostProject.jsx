import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Button, Card, message } from 'antd';
import { PlusOutlined, RocketOutlined, DollarOutlined, ClockCircleOutlined, TagsOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import api from '../services/api';

const PostProject = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.warning('Please login to post a project');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const projectData = {
                ...values,
                budget: {
                    min: values.budgetMin,
                    max: values.budgetMax,
                    type: values.budgetType
                },
                duration: {
                    value: values.durationValue,
                    unit: values.durationUnit
                },
                skills: values.skills?.split(',').map(s => s.trim()) || []
            };

            await api.createProject(values);

            message.success('Project posted successfully!');
            navigate('/browse');
        } catch (error) {
            message.error(error.response?.data?.error || 'Failed to post project');
        } finally {
            setLoading(false);
        }
    };

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

            <div className="max-w-4xl mx-auto px-6 py-12">
                <Card className="rounded-2xl shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">📝</div>
                        <h1 className="text-3xl font-bold mb-2">Post a New Project</h1>
                        <p className="text-gray-600">Find the perfect freelancer for your project</p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        size="large"
                    >
                        <Form.Item
                            name="title"
                            label="Project Title"
                            rules={[{ required: true, message: 'Please enter project title' }]}
                        >
                            <Input placeholder="e.g., Build a React E-commerce Website" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Project Description"
                            rules={[{ required: true, message: 'Please enter project description' }]}
                        >
                            <Input.TextArea
                                rows={6}
                                placeholder="Describe your project in detail..."
                            />
                        </Form.Item>

                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[{ required: true, message: 'Please select a category' }]}
                        >
                            <Select placeholder="Select a category">
                                <Select.Option value="web-development">Web Development</Select.Option>
                                <Select.Option value="mobile-development">Mobile Development</Select.Option>
                                <Select.Option value="design">Design</Select.Option>
                                <Select.Option value="writing">Writing</Select.Option>
                                <Select.Option value="marketing">Marketing</Select.Option>
                                <Select.Option value="data-science">Data Science</Select.Option>
                                <Select.Option value="other">Other</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="skills"
                            label="Required Skills (comma-separated)"
                            rules={[{ required: true, message: 'Please enter required skills' }]}
                        >
                            <Input placeholder="e.g., React, Node.js, MongoDB, Tailwind CSS" />
                        </Form.Item>

                        <div className="grid md:grid-cols-2 gap-4">
                            <Form.Item
                                name="budgetMin"
                                label="Minimum Budget ($)"
                                rules={[{ required: true, message: 'Please enter minimum budget' }]}
                            >
                                <InputNumber min={1} className="w-full" />
                            </Form.Item>

                            <Form.Item
                                name="budgetMax"
                                label="Maximum Budget ($)"
                                rules={[{ required: true, message: 'Please enter maximum budget' }]}
                            >
                                <InputNumber min={1} className="w-full" />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="budgetType"
                            label="Budget Type"
                            rules={[{ required: true, message: 'Please select budget type' }]}
                        >
                            <Select>
                                <Select.Option value="fixed">Fixed Price</Select.Option>
                                <Select.Option value="hourly">Hourly Rate</Select.Option>
                            </Select>
                        </Form.Item>

                        <div className="grid md:grid-cols-2 gap-4">
                            <Form.Item
                                name="durationValue"
                                label="Project Duration"
                                rules={[{ required: true, message: 'Please enter duration' }]}
                            >
                                <InputNumber min={1} className="w-full" />
                            </Form.Item>

                            <Form.Item
                                name="durationUnit"
                                label="Duration Unit"
                                rules={[{ required: true, message: 'Please select unit' }]}
                            >
                                <Select>
                                    <Select.Option value="days">Days</Select.Option>
                                    <Select.Option value="weeks">Weeks</Select.Option>
                                    <Select.Option value="months">Months</Select.Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<PlusOutlined />}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-none"
                            >
                                Post Project
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default PostProject;
