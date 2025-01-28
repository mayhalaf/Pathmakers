import React from 'react';
import '../components/DownloadApp.css';

const DownloadApp = () => {
    const handleDownload = (platform) => {
        // Add your download logic here
        console.log(`Downloading for ${platform}`);
        // You could redirect to app store or play store
        // window.location.href = platform === 'ios' ? 'app_store_link' : 'play_store_link';
    };

    return (
        <div className="container">
         
            <h1 className="title">Download Our App</h1>
            
            <p className="description">
                Get the best experience by downloading our app on your iPhone or Android device. 
                Stay connected and enjoy exclusive features on the go!
            </p>
            
            <div className="buttons">
                <a 
                    href="#" 
                    className="button ios"
                    onClick={(e) => {
                        e.preventDefault();
                        handleDownload('ios');
                    }}
                >
                    <img 
                        src="/api/placeholder/20/20"
                        alt="iOS Logo" 
                        className="buttonIcon"
                    />
                    Download for iPhone
                </a>
                
                <a 
                    href="#" 
                    className="button android"
                    onClick={(e) => {
                        e.preventDefault();
                        handleDownload('android');
                    }}
                >
                    <img 
                        src="/api/placeholder/20/20"
                        alt="Android Logo" 
                        className="buttonIcon"
                    />
                    Download for Android
                </a>
            </div>
        </div>
    );
};

export default DownloadApp;
