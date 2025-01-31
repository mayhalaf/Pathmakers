import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Image20250119205452.png";
import profilePlaceholder from "../assets/2151100205.jpg"; 
import "./Header.css";

const Header = () => {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:4000/user");
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    navigate("/main"); // Redirect to main page after login
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:4000/logout", { method: "POST" });
            setUser(null);
            navigate("/"); // Redirect to homepage after logout
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <header className="header">
            {/* ✅ Wrap logo in <Link> to navigate to main page */}
            <div className="logo">
                <Link to="/main">
                    <img src={logo} alt="Logo" />
                </Link>
            </div>

            {/* ✅ Show menu only if NOT on homepage, login, or signup */}
            {!["/", "/login", "/signup"].includes(location.pathname) && user && (
                <nav className={`navbar ${isMenuOpen ? "show" : ""}`}>
                    <Link to="/main">Main</Link>
                    <Link to="/about">About</Link>
                    <Link to="/video">Video</Link>
                    <Link to="/DownloadApp">Download App</Link>
                </nav>
            )}

            {/* ✅ User Profile Section (Always Visible) */}
            <div className="profile-section">
                <img
                    src={user?.profileImage || profilePlaceholder}
                    alt="User"
                    className="profile-image"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                />
                {isProfileOpen && (
                    <div className="profile-popup">
                        <p>Hello, Friend!</p>
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

            {/* ✅ Hamburger Button for Mobile (Only Visible If Navbar is Visible) */}
            {!["/", "/login", "/signup"].includes(location.pathname) && user && (
                <button
                    className={`hamburger ${isMenuOpen ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </button>
            )}
        </header>
    );
};

export default Header;
