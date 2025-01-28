import React from 'react';
import '../components/PersonalArea.css';

const PersonalArea = () => {
    const handleEditProfile = () => {
        // Add edit profile logic here
        console.log('Edit profile clicked');
    };

    const handleLogout = () => {
        // Add logout logic here
        console.log('Logout clicked');
    };

    return (
        <div>
            <header className="header">
                Welcome to Your Personal Area
            </header>

            <div className="container">
                <h2 className="heading">User Details</h2>
                <div className="profileInfo">
                    <p><strong>Name:</strong> Mai Khalaf</p>
                    <p><strong>Email:</strong> mai@email.com</p>
                    <p><strong>Status:</strong> Logged in</p>
                </div>

                <h3>What would you like to do today?</h3>
                <button onClick={handleEditProfile} className="button">Edit Profile</button>
                <button onClick={handleLogout} className="button">Logout</button>
            </div>
         
        </div>
    );
};

export default PersonalArea;