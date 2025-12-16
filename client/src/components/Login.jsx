import React, { useState } from 'react';
import { log } from '../utils/logger';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        log('Login Attempt', { username }, 'info');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                log('Login Successful', { username, role: data.user.role }, 'success', username);
                onLogin(data.user);
            } else {
                throw new Error(data.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error('Login error:', err);
            log('Login Failed', { username, error: err.message }, 'error');
            setError(err.message || 'Unable to verify credentials. Please check the server.');
        }
    };

    return (
        <div id="loginPage" className="page active">
            <div className="animated-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="logo-section">
                        <div className="logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#grad1)" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round" />
                                <defs>
                                    <linearGradient id="grad1" x1="2" y1="2" x2="22" y2="22">
                                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="1" />
                                        <stop offset="100%" stopColor="#0284c7" stopOpacity="1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h1>NetworkHub</h1>
                        <p>Advanced network diagnostics at your fingertips</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <div className="login-error">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-container">
                                <input type="checkbox" id="rememberMe" />
                                <span className="checkmark"></span>
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>

                        <button type="submit" className="btn-primary">
                            <span>Sign In</span>
                            <svg className="btn-arrow" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="signup-prompt">
                            Don't have an account? <a href="#">Sign up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
