import React from 'react';
import '../components/main.css';
const Main = () => {
  return (
    <div className="main-container">
      {/* Placeholder for video */}
      <img 
        className="main-video"
        src="https://www.masa.co.il/wp-content/uploads/2017/11/london-tips.jpg" 
        alt="Background"
      />
      
      <div className="main-overlay">
        <div className="main-content">
          <h1 className="main-heading">Welcome to Pathmakers</h1>
          <p className="main-description">Travel agency which you'll love.</p>
          
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