import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../assets/Image20250119205452.png";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/login">Login</Link>
      </nav>
      <button className="btn-primary">Sign Up</button>
    </header>
  );
};

export default Header;
