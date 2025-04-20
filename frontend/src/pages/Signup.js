/**
 * @file Signup.js
 * @description Component for user registration and account creation
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 * 
 * This component provides:
 * 1. User registration form with validation
 * 2. Password strength checking
 * 3. Email verification process
 * 4. Error handling and user feedback
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash, FaExclamationCircle, FaPhone, FaGoogle, FaApple } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import api, { endpoints } from '../config/api';
import '../css/Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        identifier: '',
        identifierType: 'email',
        password: '',
        confirmPassword: '',
        countryCode: '+91'
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useUser();
    const navigate = useNavigate();

    const phonePatterns = {
        '+91': {
            pattern: /^[6-9]\d{9}$/,
            errorMessage: 'Please enter a valid 10-digit Indian phone number',
            flag: '🇮🇳',
            country: 'India'
        },
        '+1': {
            pattern: /^\d{10}$/,
            errorMessage: 'Please enter a valid 10-digit US phone number',
            flag: '🇺🇸',
            country: 'United States'
        },
        '+44': {
            pattern: /^[7-9]\d{9}$/,
            errorMessage: 'Please enter a valid UK phone number',
            flag: '🇬🇧',
            country: 'United Kingdom'
        },
        '+61': {
            pattern: /^4\d{8}$/,
            errorMessage: 'Please enter a valid Australian phone number',
            flag: '🇦🇺',
            country: 'Australia'
        },
        '+81': {
            pattern: /^[789]0\d{8}$/,
            errorMessage: 'Please enter a valid Japanese phone number',
            flag: '🇯🇵',
            country: 'Japan'
        },
        '+86': {
            pattern: /^1[3-9]\d{9}$/,
            errorMessage: 'Please enter a valid Chinese phone number',
            flag: '🇨🇳',
            country: 'China'
        },
        '+49': {
            pattern: /^1[567]\d{8}$/,
            errorMessage: 'Please enter a valid German phone number',
            flag: '🇩🇪',
            country: 'Germany'
        },
        '+33': {
            pattern: /^[67]\d{8}$/,
            errorMessage: 'Please enter a valid French phone number',
            flag: '🇫🇷',
            country: 'France'
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            setIsLoading(true);
            const response = await api.post(endpoints.auth.socialLogin, { provider });
            
            if (response.data.authUrl) {
                window.location.href = response.data.authUrl;
            } else {
                setErrors({
                    submit: 'Unable to initialize social login. Please try again.'
                });
            }
        } catch (error) {
            setErrors({
                submit: error.response?.data?.error || `${provider} login failed. Please try again.`
            });
        } finally {
            setIsLoading(false);
        }
    };

    const validateIdentifier = async (identifier, type) => {
        if (!identifier) return 'This field is required';

        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(identifier)) return 'Please enter a valid email address';
            
            try {
                const response = await api.post(endpoints.auth.checkEmail, { email: identifier });
                if (response.data.exists) {
                    return 'This email is already registered. Please login instead.';
                }
            } catch (error) {
                console.error('Error checking email:', error);
            }
        } else {
            const countryPattern = phonePatterns[formData.countryCode];
            if (!countryPattern) return 'Selected country is not supported';
            if (!countryPattern.pattern.test(identifier)) {
                return countryPattern.errorMessage;
            }
            
            try {
                const response = await api.post(endpoints.auth.checkPhone, { phone: identifier });
                if (response.data.exists) {
                    return 'This phone number is already registered. Please login instead.';
                }
            } catch (error) {
                console.error('Error checking phone:', error);
            }
        }
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character';
        return '';
    };

    const validateConfirmPassword = (confirmPassword) => {
        if (!confirmPassword) return 'Please confirm your password';
        if (confirmPassword !== formData.password) return 'Passwords do not match';
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBlur = async (e) => {
        const { name, value } = e.target;
        let error = '';

        if (name === 'identifier') {
            error = await validateIdentifier(value, formData.identifierType);
        } else if (name === 'password') {
            error = validatePassword(value);
        } else if (name === 'confirmPassword') {
            error = validateConfirmPassword(value);
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const identifierError = await validateIdentifier(formData.identifier, formData.identifierType);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword);

        if (identifierError || passwordError || confirmPasswordError) {
            setErrors({
                identifier: identifierError,
                password: passwordError,
                confirmPassword: confirmPasswordError
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post(endpoints.auth.signup, {
                [formData.identifierType]: formData.identifier,
                password: formData.password,
                country_code: formData.identifierType === 'phone' ? formData.countryCode : undefined
            });
            
            if (response.data.success) {
                alert('Account created successfully! Please verify your ' + 
                      (formData.identifierType === 'email' ? 'email' : 'phone number') + 
                      ' to continue.');
                navigate('/login');
            }
        } catch (error) {
            setErrors({
                submit: error.response?.data?.error || 'Error creating account. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Create an account</h2>

                <div className="social-buttons">
                    <button 
                        className="social-button"
                        onClick={() => handleSocialLogin('google')}
                        type="button"
                        disabled={isLoading}
                    >
                        <FaGoogle /> Google
                    </button>
                    <button 
                        className="social-button"
                        onClick={() => handleSocialLogin('apple')}
                        type="button"
                        disabled={isLoading}
                    >
                        <FaApple /> Apple
                    </button>
                </div>

                <div className="divider">
                    <span>or</span>
                </div>

                <div className="identifier-toggle">
                    <button
                        type="button"
                        className={`toggle-btn ${formData.identifierType === 'email' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, identifierType: 'email', identifier: '' }))}
                    >
                        <FaEnvelope /> Email
                    </button>
                    <button
                        type="button"
                        className={`toggle-btn ${formData.identifierType === 'phone' ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, identifierType: 'phone', identifier: '' }))}
                    >
                        <FaPhone /> Phone
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        {formData.identifierType === 'email' ? (
                            <FaEnvelope className="icon" />
                        ) : (
                            <FaPhone className="icon" />
                        )}
                        
                        {formData.identifierType === 'phone' && (
                            <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleChange}
                                className="country-code-select"
                            >
                                {Object.entries(phonePatterns).map(([code, { flag, country }]) => (
                                    <option key={code} value={code}>
                                        {flag} {code}
                                    </option>
                                ))}
                            </select>
                        )}
                        
                        <input
                            type={formData.identifierType === 'email' ? 'email' : 'tel'}
                            name="identifier"
                            placeholder={formData.identifierType === 'email' ? 'Email address' : 'Phone number'}
                            value={formData.identifier}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${errors.identifier ? 'error' : ''} ${formData.identifierType === 'phone' ? 'with-country-code' : ''}`}
                            disabled={isLoading}
                        />
                        {errors.identifier && (
                            <div className="error-message">
                                <FaExclamationCircle />
                                {errors.identifier}
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

                    <div className="form-group">
                        <FaLock className="icon" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.confirmPassword ? 'error' : ''}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex="-1"
                        >
                            {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                        {errors.confirmPassword && (
                            <div className="error-message">
                                <FaExclamationCircle />
                                {errors.confirmPassword}
                            </div>
                        )}
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
                        {isLoading ? 'Creating account...' : 'Sign up'}
                    </button>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
