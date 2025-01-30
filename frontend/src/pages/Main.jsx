import React from 'react';
import '../components/main.css';
const Main = () => {
  return (
    <div className="main-container">
      {/* Placeholder for video */}
      <img 
        className="main-video"
        src="https://www.passportcard.co.il/wp-content/uploads/2023/08/Depositphotos_10800421_XL-scaled-1.jpg" 
        alt="Background"
      />
      
      <div className="main-overlay">
        <div className="main-content">
          <h1 className="main-heading">Welcome to Pathmakers</h1>
          <p className="main-description">Travel agency which you'll love. -Let us turn your dream into the perfect trip – everything you need in one place!</p>
          
          <div className="main-buttons">         
            <button className="main-Chat">
            Chat with the chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;