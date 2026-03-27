import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Radio, Card, App as AntdApp } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AuthPage = () => {
    const navigate = useNavigate();
    const { message } = AntdApp.useApp();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await axios.post(`${API_URL}${endpoint}`, values);

            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            message.success(isLogin ? 'Login successful!' : 'Registration successful!');

            // Redirect based on user type
            if (response.data.user.userType === 'client') {
                navigate('/dashboard/client');
            } else {
                navigate('/dashboard/freelancer');
            }
        } catch (error) {
            message.error(error.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
            <Card className="max-w-md w-full shadow-2xl rounded-2xl">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">⚓</div>
                    <h1 className="text-3xl font-bold mb-2">
                        {isLogin ? 'Welcome Back' : 'Join Zembl'}
                    </h1>
                    <p className="text-gray-600">
                        {isLogin ? 'Sign in to your account' : 'Create your account'}
                    </p>
                </div>

                <Form
                    name="auth"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    {!isLogin && (
                        <>
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please enter username' }]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Username"
                                />
                            </Form.Item>

                            <Form.Item
                                name="firstName"
                                rules={[{ required: true, message: 'Please enter first name' }]}
                            >
                                <Input placeholder="First Name" />
                            </Form.Item>

                            <Form.Item
                                name="lastName"
                                rules={[{ required: true, message: 'Please enter last name' }]}
                            >
                                <Input placeholder="Last Name" />
                            </Form.Item>

                            <Form.Item
                                name="userType"
                                rules={[{ required: true, message: 'Please select user type' }]}
                            >
                                <Radio.Group>
                                    <Radio.Button value="freelancer">Freelancer</Radio.Button>
                                    <Radio.Button value="client">Client</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter valid email' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter password' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 border-none"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </Button>
                    </Form.Item>

                    <div className="text-center">
                        <Button type="link" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Need an account? Sign up' : 'Have an account? Sign in'}
                        </Button>
                    </div>

                    <div className="text-center mt-4">
                        <Link to="/">
                            <Button type="text">← Back to Home</Button>
                        </Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default AuthPage;
