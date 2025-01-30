import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Image20250119205452.png";
import profilePlaceholder from "../assets/2151100205.jpg"; // Default profile image
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Parse only if it's valid JSON
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      localStorage.removeItem("user"); // Remove invalid data to prevent future errors
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear session storage
    setUser(null); // Reset user state
    navigate("/login"); // Redirect to login page
};


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Navbar for Navigation */}
      <nav className={`navbar ${isMenuOpen ? "show" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/personal-area">Personal Area</Link>
        <Link to="/video">Video</Link>
        <Link to="/DownloadApp">Download App</Link>
      </nav>

      {/* User Profile Section */}
      <div className="profile-section">
        <img
          src={user?.profileImage || profilePlaceholder}
          alt="User"
          className="profile-image"
          onClick={toggleProfile}
        />
        {isProfileOpen && (
          <div className="profile-popup">
            <p>Hi, {user?.username || "Guest"}!</p>
            {user ? (
              <>
                <Link to="/personal-area">Go to Profile</Link>
                <button onClick={handleLogout} className="logoutButton">
                  Log Out
                </button>
              </>
            ) : (
              <Link to="/login">Log in</Link>
            )}
          </div>
        )}
      </div>

      {/* Hamburger Button for Mobile */}
      <button
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </button>
    </header>
  );
};

export default Header;
