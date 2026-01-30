import React, { useState } from 'react';
import { Card, Button, Input, Rate, Tag, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { analyzeReview } from '../services/api';

const { TextArea } = Input;

const BackendDemo = () => {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        if (!text.trim()) {
            message.warning('Please enter review text');
            return;
        }

        setLoading(true);
        try {
            const response = await analyzeReview({
                rating,
                text,
                freelancerId: 'demo-user',
                clientName: 'Demo Client'
            });

            setResult(response.review);
            message.success('Review analyzed successfully!');
        } catch (error) {
            message.error('Failed to analyze review. Make sure backend is running on port 5000.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getTrustColor = (label) => {
        switch (label) {
            case 'Verified Authentic': return 'green';
            case 'Low Effort': return 'orange';
            case 'Potential Mismatch': return 'red';
            default: return 'default';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Backend API <span className="text-gradient">Demo</span>
                    </h1>
                    <p className="text-gray-600">Test the review analysis endpoint</p>
                </div>

                <Card className="shadow-2xl rounded-2xl">
                    <div className="space-y-6">
                        <div>
                            <label className="block font-semibold mb-2">Rating</label>
                            <Rate value={rating} onChange={setRating} className="text-3xl" />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">Review Text</label>
                            <TextArea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter your review text..."
                                rows={4}
                                className="text-base"
                            />
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            icon={<SendOutlined />}
                            onClick={handleSubmit}
                            loading={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-none h-12 text-base font-semibold"
                        >
                            Analyze with Backend API
                        </Button>

                        {result && (
                            <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                                <h3 className="font-bold text-lg mb-4">Analysis Result:</h3>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-sm text-gray-600">Trust Label</div>
                                        <Tag color={getTrustColor(result.trustLabel)} className="text-base px-3 py-1 mt-1">
                                            {result.trustLabel}
                                        </Tag>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Sentiment Score</div>
                                        <div className="text-2xl font-bold">{result.sentimentScore}</div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="text-sm text-gray-600 mb-2">Analysis Details:</div>
                                    <div className="text-sm space-y-1">
                                        <div>Positive words: {result.analysis.positive.join(', ') || 'None'}</div>
                                        <div>Negative words: {result.analysis.negative.join(', ') || 'None'}</div>
                                        <div>Comparative score: {result.analysis.comparative.toFixed(3)}</div>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                                    <strong>Logic Applied:</strong> {
                                        result.text.length < 15
                                            ? 'Text length < 15 characters → Low Effort'
                                            : result.rating === 5 && result.sentimentScore < 0
                                                ? 'Rating = 5 but Sentiment < 0 → Potential Mismatch'
                                                : 'Valid review → Verified Authentic'
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>💡 Test Cases:</p>
                    <p>1. "Good job" (5 stars) → Low Effort</p>
                    <p>2. "This was terrible service" (5 stars) → Potential Mismatch</p>
                    <p>3. "Excellent work, very professional!" (5 stars) → Verified Authentic</p>
                </div>
            </div>
        </div>
    );
};

export default BackendDemo;
