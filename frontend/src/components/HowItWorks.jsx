import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const HowItWorks = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 selection:bg-amber-200 p-6 flex flex-col items-center">
            {/* Simple Top Nav */}
            <nav className="w-full max-w-7xl mx-auto flex justify-between items-center py-4 mb-12">
                <div 
                    className="flex items-center space-x-2 cursor-pointer" 
                    onClick={() => navigate('/')}
                >
                    <span className="text-3xl">⚓</span>
                    <span className="text-2xl font-bold text-gradient">Zembl</span>
                </div>
                <div>
                    <Button type="text" onClick={() => navigate('/login')} className="hover:text-amber-600 font-medium">Sign In</Button>
                    <Button type="primary" className="ml-4 bg-amber-500 hover:bg-amber-600 border-none shadow-premium font-medium text-white" onClick={() => navigate('/login')}>
                        Get Started
                    </Button>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-4xl w-full">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4">How <span className="text-gradient">Zembl</span> Works</h1>
                    <p className="text-xl text-gray-600">The premier platform for connecting top-tier talent with ambitious clients.</p>
                </div>

                <div className="space-y-12 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-8 top-10 bottom-10 w-1 bg-amber-200/50 hidden md:block"></div>

                    {/* Step 1 */}
                    <div className="glass rounded-3xl p-8 shadow-premium border border-white/60 bg-white/40 flex flex-col md:flex-row items-center gap-8 z-10 relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">1</div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Connect & Discover</h2>
                            <p className="text-gray-600 text-lg">Set up your profile to showcase your skills or post your project requirements. Find the perfect match to bring your vision to life.</p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="glass rounded-3xl p-8 shadow-premium border border-white/60 bg-white/40 flex flex-col md:flex-row items-center gap-8 z-10 relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">2</div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Collaborate on a Single Project</h2>
                            <p className="text-gray-600 text-lg">Zembl is designed for deep collaboration. Freelancers and clients can effortlessly work together in a dedicated workspace, keeping all focus on delivering your core project.</p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="glass rounded-3xl p-8 shadow-premium border border-white/60 bg-white/40 flex flex-col md:flex-row items-center gap-8 z-10 relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">3</div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Deliver & Thrive</h2>
                            <p className="text-gray-600 text-lg">Streamline your workflow, communicate seamlessly, and deliver exceptional results together. Build a trusted reputation as you successfully complete meaningful work.</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-16 text-center pb-12">
                    <Button 
                        type="primary" 
                        size="large" 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-none shadow-premium h-14 px-10 text-lg font-bold text-white transition-transform transform hover:-translate-y-1"
                        onClick={() => navigate('/login')}
                    >
                        Join Zembl Now
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
