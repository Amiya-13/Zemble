import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Tag, Input, Select, Button, Spin, Empty } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const BrowseProjects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchProjects();
    }, [category]);

    const fetchProjects = async () => {
        try {
            let url = `${API_URL}/projects?`;
            if (category) url += `category=${category}&`;
            if (search) url += `search=${search}`;

            const response = await axios.get(url);
            setProjects(response.data.projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchProjects();
    };

    const getCategoryColor = (cat) => {
        const colors = {
            'web-development': 'blue',
            'mobile-development': 'green',
            'design': 'purple',
            'writing': 'orange',
            'marketing': 'red',
            'data-science': 'cyan'
        };
        return colors[cat] || 'default';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-3xl">⚓</span>
                        <span className="text-2xl font-bold text-gradient">Zemble</span>
                    </Link>
                    <div className="flex space-x-4">
                        <Button onClick={() => navigate('/login')}>Sign In</Button>
                        <Button type="primary" onClick={() => navigate('/post-project')}>
                            Post a Project
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Search Section */}
            <div className="bg-white border-b border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-6">Browse Projects</h1>

                    <div className="flex gap-4">
                        <Input
                            size="large"
                            placeholder="Search projects..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onPressEnter={handleSearch}
                            className="flex-1"
                        />

                        <Select
                            size="large"
                            placeholder="Category"
                            value={category}
                            onChange={setCategory}
                            className="w-64"
                            allowClear
                        >
                            <Select.Option value="web-development">Web Development</Select.Option>
                            <Select.Option value="mobile-development">Mobile Development</Select.Option>
                            <Select.Option value="design">Design</Select.Option>
                            <Select.Option value="writing">Writing</Select.Option>
                            <Select.Option value="marketing">Marketing</Select.Option>
                            <Select.Option value="data-science">Data Science</Select.Option>
                        </Select>

                        <Button size="large" type="primary" onClick={handleSearch} icon={<FilterOutlined />}>
                            Search
                        </Button>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <Spin size="large" />
                    </div>
                ) : projects.length === 0 ? (
                    <Empty description="No projects found" />
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Card
                                key={project._id}
                                hoverable
                                onClick={() => navigate(`/project/${project._id}`)}
                                className="rounded-xl shadow-lg hover:shadow-2xl transition-all"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <Tag color={getCategoryColor(project.category)} className="mb-2">
                                            {project.category}
                                        </Tag>
                                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                        <p className="text-gray-600 line-clamp-3">{project.description}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {project.skills?.slice(0, 3).map((skill, idx) => (
                                            <Tag key={idx} className="text-xs">{skill}</Tag>
                                        ))}
                                        {project.skills?.length > 3 && (
                                            <Tag className="text-xs">+{project.skills.length - 3} more</Tag>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <div>
                                            <div className="text-sm text-gray-500">Budget</div>
                                            <div className="text-lg font-bold text-green-600">
                                                ${project.budget?.min} - ${project.budget?.max}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">Proposals</div>
                                            <div className="text-lg font-semibold">{project.proposalCount || 0}</div>
                                        </div>
                                    </div>

                                    <Tag color={project.status === 'open' ? 'green' : 'gray'}>
                                        {project.status}
                                    </Tag>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseProjects;
