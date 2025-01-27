import React from "react";
import "./Header.css";  // Import the CSS file for styles
import Image20250119205452 from "../assets/Image20250119205452.png";  // Ensure the image path is correct

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={Image20250119205452} alt="Logo" />
      </div>
      <nav>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
      </nav>
      <button className="btn-primary">Sign Up</button>
    </header>
  );
};

export default Header;
