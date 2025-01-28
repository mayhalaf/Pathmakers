import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../assets/Image20250119205452.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <button
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>
      <nav className={`navbar ${isMenuOpen ? "show" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/personal-area">Personal Area</Link>
        <Link to="/video">Video</Link>
        <Link to="/DownloadApp">Download App</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
    </header>
  );
};

export default Header;
