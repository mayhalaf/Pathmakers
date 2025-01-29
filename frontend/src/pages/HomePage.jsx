import React from 'react';
import '../components/HomePage.css';
import bgVideo from "../assets/215421_small.mp4"; // Ensure correct path

export default function HomePage() {
    return (
        <div className="page-container">
            {/* Left Panel */}
            <div className="info-section">
                <div className="content-box">
                    <h1 className="main-title">Welcome to Pathmakers,</h1>
                    <p className="description-text">
                        Travel agency which you'll love.
                    </p>
                </div>
            </div>

            {/* Right Panel with Video Background */}
            <div className="video-section">
                {/* Background Video */}
                <video className="fullscreen-video" playsInline autoPlay muted loop>
                    <source src={bgVideo} type="video/mp4" />
                </video>

                {/* Transparent Overlay */}
                <div className="video-overlay-dark"></div>

                {/* Content Above Video */}
                <div className="content-box">
                    <h2 className="main-title">Get started</h2>
                    <div className="action-buttons">
                        <button className="action-btn login-button">Log in</button>
                        <button className="action-btn signup-button">Sign up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
