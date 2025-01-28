import React from 'react';
import '../components/HomePage.css';
import bgVideo from "../assets/215421_small.mp4";

export default function HomePage() {
  return (
    <div className="home-container">
      {/* Left Panel */}
      <div className="split-panel left-panel">
        <div className="content-overlay">
          <h1>Welcome Back</h1>
          <p>Experience the future of our platform</p>
        </div>
      </div>

      {/* Right Panel with Video Background */}
      <div className="split-panel right-panel">
        <video className="bg-video" playsInline autoPlay muted loop>
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="content-wrapper">
          <h2>Get started</h2>
          <div className="button-group">
            <button className="btn login-btn">Log in</button>
            <button className="btn signup-btn">Sign up</button>
          </div>
         
        </div>
      </div>
    </div>
  );
};
