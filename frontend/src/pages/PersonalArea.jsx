import React, { useState } from 'react';
import '../components/PersonalArea.css';

const PersonalArea = () => {
    const [activeTab, setActiveTab] = useState('userInfo'); // Default tab

    const handleEditProfile = () => {
        console.log('Edit profile clicked');
    };

    const handleLogout = () => {
        console.log('Logout clicked');
    };

    return (
        <div>
            {/* Main Title */}
            <h1 className="page-title">Welcome to Your Personal Area</h1>

            {/* Tab Navigation */}
            <div className="tab-buttons">
                <button onClick={() => setActiveTab('userInfo')} className={activeTab === 'userInfo' ? 'active' : ''}>
                    User Info
                </button>
                <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>
                    Previous Orders
                </button>
                <button onClick={() => setActiveTab('newsletter')} className={activeTab === 'newsletter' ? 'active' : ''}>
                    Sign Up for Newsletter
                </button>
            </div>

            <div className="containerPersonal">
                {/* Content Based on Selected Tab */}
                {activeTab === 'userInfo' && (
                    <>
                        <h2 className="heading">User Details</h2>
                        <div className="profileInfo">
                            <p><strong>Name:</strong> Mai Khalaf</p>
                            <p><strong>Email:</strong> mai@email.com</p>
                            <p><strong>Status:</strong> Logged in</p>
                        </div>
                        <button onClick={handleEditProfile} className="button">Edit Profile</button>
                        <button onClick={handleLogout} className="button">Logout</button>
                    </>
                )}

                {activeTab === 'orders' && (
                    <>
                        <h2 className="heading">Previous Orders</h2>
                        <div className="profileInfo">
                            <p>Order #12345 - Paris Flight - Completed</p>
                            <p>Order #67890 - Hotel Reservation - Pending</p>
                        </div>
                        <a href="#" className="button">Download Receipt</a>
                    </>
                )}

                {activeTab === 'newsletter' && (
                    <>
                        <h2 className="heading">Sign Up for Newsletter</h2>
                        <div className="profileInfo">
                            <p>Get the latest updates and travel deals straight to your inbox!</p>
                        </div>
                        <input type="email" placeholder="Enter your email" className="newsletter-input" />
                        <button className="button">Subscribe</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PersonalArea;
