import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Rate, Tag } from 'antd';
import { RocketOutlined, TeamOutlined, WarningOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const LandingPage = () => {
    const navigate = useNavigate();
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [showWarning, setShowWarning] = useState(false);

    // Simple local sentiment check (mirrors backend logic)
    const checkSentiment = (text, stars) => {
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'poor', 'hate', 'disappointed'];
        const hasNegativeWord = negativeWords.some(word =>
            text.toLowerCase().includes(word)
        );

        if (stars === 5 && hasNegativeWord) {
            setShowWarning(true);
        } else {
            setShowWarning(false);
        }
    };

    const handleReviewChange = (e) => {
        const text = e.target.value;
        setReviewText(text);
        checkSentiment(text, rating);
    };

    const handleRatingChange = (stars) => {
        setRating(stars);
        checkSentiment(reviewText, stars);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-3xl">⚓</span>
                        <span className="text-2xl font-bold text-gradient">Zemble</span>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <a onClick={() => navigate('/how-it-works')} className="text-gray-600 hover:text-amber-600 transition cursor-pointer font-medium">How It Works</a>
                    </div>
                    <div className="flex space-x-4">
                        <Button type="text" onClick={() => navigate('/login')}>Sign In</Button>
                        <Button type="primary" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/login')}>
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Copy */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-6xl font-bold leading-tight">
                                    Don't Just Hire.
                                    <br />
                                    <span className="text-gradient">Anchor Them.</span>
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Build elite squads with verified talent. Every review is validated by AI.
                                    Every hire is an investment. Welcome to the future of freelancing.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<RocketOutlined />}
                                    onClick={() => navigate('/browse')}
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-none shadow-premium transition-all duration-300 transform hover:-translate-y-0.5 h-12 px-8 text-base font-semibold text-white"
                                >
                                    Browse Projects
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">10k+</div>
                                    <div className="text-sm text-gray-600">Elite Freelancers</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">98%</div>
                                    <div className="text-sm text-gray-600">Verified Reviews</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">500+</div>
                                    <div className="text-sm text-gray-600">Active Squads</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Illustration Placeholder */}
                        <div className="relative">
                            <div className="glass rounded-3xl p-8 shadow-2xl">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl h-96 flex items-center justify-center">
                                    <div className="text-center text-white space-y-4">
                                        <div className="text-7xl">⚓</div>
                                        <div className="text-2xl font-bold">Premium Platform</div>
                                        <div className="text-sm opacity-80">Where talent meets trust</div>
                                    </div>
                                </div>
                            </div>
                            {/* Floating cards */}
                            <div className="absolute -top-4 -right-4 glass rounded-xl p-4 shadow-lg">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl">✅</span>
                                    <span className="font-semibold">AI Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">
                            See Our AI <span className="text-gradient">In Action</span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            Try typing negative text with 5 stars - our AI instantly detects mismatches
                        </p>
                    </div>

                    <div className="glass rounded-2xl p-8 shadow-xl">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Rate this freelancer:</label>
                                <Rate
                                    value={rating}
                                    onChange={handleRatingChange}
                                    className="text-3xl"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Write your review:</label>
                                <TextArea
                                    value={reviewText}
                                    onChange={handleReviewChange}
                                    placeholder="Try typing 'This was bad service' while keeping 5 stars selected..."
                                    rows={4}
                                    className="text-base"
                                />
                            </div>

                            {/* Real-time Warning */}
                            {showWarning && (
                                <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 animate-pulse">
                                    <div className="flex items-center space-x-3">
                                        <WarningOutlined className="text-2xl text-red-600" />
                                        <div>
                                            <div className="font-bold text-red-900">⚠️ Suspicious Sentiment Detected</div>
                                            <div className="text-sm text-red-700">
                                                Your review text seems negative, but you gave 5 stars. This would be flagged as "Potential Mismatch".
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!showWarning && reviewText.length > 0 && (
                                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">✅</span>
                                        <div>
                                            <div className="font-bold text-green-900">Looks Good!</div>
                                            <div className="text-sm text-green-700">
                                                {reviewText.length < 15
                                                    ? 'Note: Reviews under 15 characters are marked as "Low Effort"'
                                                    : 'This review would be marked as "Verified Authentic"'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            ⚓ <span className="text-gradient">Zemble</span> Marketplace?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass rounded-xl p-8 hover:shadow-2xl transition-all">
                            <div className="text-4xl mb-4">🤖</div>
                            <h3 className="text-xl font-bold mb-3">AI-Powered Trust</h3>
                            <p className="text-gray-600">
                                Every review analyzed by sentiment AI to detect fake reviews and mismatches
                            </p>
                        </div>

                        <div className="glass rounded-xl p-8 hover:shadow-2xl transition-all">
                            <div className="text-4xl mb-4">⚓</div>
                            <h3 className="text-xl font-bold mb-3">Anchor Top Talent</h3>
                            <p className="text-gray-600">
                                Long-term collaborations with verified freelancers who commit to your vision
                            </p>
                        </div>

                        <div className="glass rounded-xl p-8 hover:shadow-2xl transition-all">
                            <div className="text-4xl mb-4">🔥</div>
                            <h3 className="text-xl font-bold mb-3">Squad Compatibility</h3>
                            <p className="text-gray-600">
                                AI-calculated team synergy scores to build the perfect squad
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <span className="text-3xl">⚓</span>
                        <span className="text-2xl font-bold">Zemble</span>
                    </div>
                    <p className="text-gray-400">
                        © 2026 Zemble. Premium Freelancer Marketplace.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
