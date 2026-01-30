import React, { useState } from 'react';
import { Transfer, Tag, Card, Button } from 'antd';
import { FireOutlined, TeamOutlined, StarOutlined } from '@ant-design/icons';

const SquadBuilder = () => {
    // Mock freelancer data
    const mockData = [
        { key: '1', title: 'Sarah Chen', description: 'Senior React Developer', tags: ['React', 'TypeScript', 'Node'], rating: 4.9 },
        { key: '2', title: 'Marcus Williams', description: 'Full-Stack Engineer', tags: ['React', 'Node', 'MongoDB'], rating: 4.8 },
        { key: '3', title: 'Aisha Patel', description: 'UI/UX Designer', tags: ['Figma', 'Design', 'Branding'], rating: 5.0 },
        { key: '4', title: 'James Rodriguez', description: 'Backend Specialist', tags: ['Node', 'Python', 'Docker'], rating: 4.7 },
        { key: '5', title: 'Emily Zhang', description: 'DevOps Engineer', tags: ['AWS', 'Docker', 'CI/CD'], rating: 4.9 },
        { key: '6', title: 'David Kim', description: 'React Native Developer', tags: ['React', 'Mobile', 'iOS'], rating: 4.6 },
        { key: '7', title: 'Sofia Martinez', description: 'Data Scientist', tags: ['Python', 'ML', 'Analytics'], rating: 4.8 },
        { key: '8', title: 'Alex Turner', description: 'Frontend Architect', tags: ['React', 'Vue', 'Performance'], rating: 5.0 },
    ];

    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

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
    const selectedFreelancers = mockData.filter(item => targetKeys.includes(item.key));
    const compatibility = calculateCompatibilityScore(selectedFreelancers);

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
                </div>

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
                <Card className="shadow-2xl rounded-2xl overflow-hidden">
                    <Transfer
                        dataSource={mockData}
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
                </Card>

                {/* Squad Summary */}
                {targetKeys.length > 0 && (
                    <div className="mt-8 glass rounded-2xl p-8">
                        <h3 className="text-2xl font-bold mb-6">Your Squad Summary</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <div className="text-sm font-semibold text-gray-600 mb-2">Team Size</div>
                                <div className="text-3xl font-bold">{targetKeys.length} Members</div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-600 mb-2">Avg. Rating</div>
                                <div className="text-3xl font-bold">
                                    {(selectedFreelancers.reduce((sum, f) => sum + f.rating, 0) / selectedFreelancers.length).toFixed(1)}
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

                        <div className="mt-8 flex justify-end">
                            <Button
                                type="primary"
                                size="large"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 border-none h-12 px-8 text-base font-semibold"
                            >
                                Anchor This Squad →
                            </Button>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>💡 Tip: Select freelancers with overlapping skills to boost compatibility!</p>
                </div>
            </div>

            <style jsx>{`
        .squad-transfer :global(.ant-transfer-list-header) {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
        }
        
        .squad-transfer :global(.ant-transfer-list-header-title) {
          color: white;
        }
      `}</style>
        </div>
    );
};

export default SquadBuilder;
