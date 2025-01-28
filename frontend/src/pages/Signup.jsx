import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
        
        // Clear errors when user types
        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // Add your signup logic here
            console.log('Signup attempt with:', formData);
            // If signup successful, navigate to desired page
            // navigate('/dashboard');
        } catch (error) {
            console.error('Signup error:', error);
            setErrors({ submit: 'Failed to create account. Please try again.' });
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className="signupContainer">
            <form className="signupForm" onSubmit={handleSubmit}>
                <h2 className="signupTitle">Create an Account</h2>
                
                <div className="formGroup">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    {errors.name && <div className="error">{errors.name}</div>}
                </div>

                <div className="formGroup">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>

                <div className="formGroup">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>

                <div className="formGroup">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.confirmPassword && (
                        <div className="error">{errors.confirmPassword}</div>
                    )}
                </div>

                {errors.submit && <div className="error">{errors.submit}</div>}

                <button type="submit" className="signupButton">
                    Sign Up
                </button>

                <p className="loginText">
                    Already have an account?{' '}
                    <a href="#" onClick={handleLogin}>
                        Log in
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Signup;