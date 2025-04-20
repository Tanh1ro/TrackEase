/**
 * @file Login.js
 * @description Component for user authentication and login
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 * 
 * This component provides:
 * 1. User login form with validation
 * 2. Remember me functionality
 * 3. Password reset option
 * 4. Error handling and user feedback
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaApple, FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import api, { endpoints } from '../config/api';
import '../css/Auth.css';

const Login = () => {
    const { login } = useUser();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        return '';
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let error = '';
        
        switch (name) {
            case 'email':
                error = validateEmail(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        return error;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const emailError = validateField('email', formData.email);
        const passwordError = validateField('password', formData.password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post(endpoints.auth.login, {
                username: formData.email,
                password: formData.password
            });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (formData.rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                login(response.data.user);
                navigate('/dashboard');
            } else {
                setErrors({
                    submit: response.data.error || 'Invalid credentials'
                });
            }
        } catch (error) {
            let errorMessage;
            
            if (error.response?.status === 404) {
                errorMessage = 'User not found. Please check your email or sign up.';
            } else if (error.response?.status === 401) {
                errorMessage = 'Invalid email or password. Please try again.';
            } else {
                errorMessage = error.response?.data?.error || 
                             error.response?.data?.non_field_errors?.[0] ||
                             'Login failed. Please try again.';
            }
            
            setErrors({
                submit: errorMessage
            });

            // Clear password field on error
            setFormData(prev => ({
                ...prev,
                password: ''
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        // Implement social login logic here
        console.log(`${provider} login clicked`);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Login to your account</h2>
                
                <div className="social-buttons">
                    <button 
                        className="social-button"
                        onClick={() => handleSocialLogin('google')}
                        type="button"
                    >
                        <FaGoogle /> Google
                    </button>
                    <button 
                        className="social-button"
                        onClick={() => handleSocialLogin('apple')}
                        type="button"
                    >
                        <FaApple /> Apple
                    </button>
                </div>

                <div className="divider">
                    <span>or</span>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <FaEnvelope className="icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.email ? 'error' : ''}
                            disabled={isLoading}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <div className="error-message">
                                <FaExclamationCircle />
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <FaLock className="icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.password ? 'error' : ''}
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex="-1"
                        >
                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                        {errors.password && (
                            <div className="error-message">
                                <FaExclamationCircle />
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="forgot-password">
                            Forgot password?
                        </Link>
                    </div>

                    {errors.submit && (
                        <div className="error-message submit-error">
                            <FaExclamationCircle />
                            {errors.submit}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
