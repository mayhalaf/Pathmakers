import React from 'react';
import '../components/HomePage.css';

export default function HomePage() {
  return (
    <div className="home-container">
      {/* Left Panel */}
      <div className="split-panel left-panel">
        {/* Video Background */}
        {/* Uncomment the video section if needed */}
        {/* 
        <video className="bg-video" playsInline autoPlay muted loop>
          <source src="/2.mp4" type="video/mp4" />
        </video> 
        */}
        
        {/* Content Overlay */}
        <div className="content-overlay">
          <h1>Welcome Back</h1>
          <p>Experience the future of our platform</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="split-panel right-panel">
        <div className="content-wrapper">
          <h2>Get started</h2>
          <div className="button-group">
            <button className="btn login-btn">Log in</button>
            <button className="btn signup-btn">Sign up</button>
          </div>
          <div className="footer-links">
            <a href="/" onClick={(e) => e.preventDefault()}>Terms of use</a>
            <span className="separator">|</span>
            <a href="/" onClick={(e) => e.preventDefault()}>Privacy policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};
