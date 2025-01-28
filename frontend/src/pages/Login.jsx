import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Add your login logic here
            console.log('Login attempt with:', formData);
            // If login successful, navigate to desired page
            // navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            // Handle login error (show message, etc.)
        }
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="loginContainer">
            <form className="loginForm" onSubmit={handleSubmit}>
                <h2 className="loginTitle">Welcome Back</h2>
                
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
                </div>

                <div className="formGroup">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="loginButton">
                    Login
                </button>

                <p className="signupText">
                    Dont have an account?{' '}
                    <a href="#" onClick={handleSignUp}>
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;