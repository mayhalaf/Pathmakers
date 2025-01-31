import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  // ChevronRight,
  // MapPin,
  // Plane,
  // Hotel,
  // Compass,
  // Car,
  // CreditCard,
  // CheckCircle,
} from "lucide-react";
import logo from "../assets/Image20250119205452.png";
import profilePlaceholder from "../assets/2151100205.jpg";
import "../components/chat.css";

const TravelPlannerApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [loadedCities, setLoadedCities] = useState([]);
  const [loadedFlights, setLoadedFlights] = useState([]);
  const [loadedHotels, setLoadedHotels] = useState([]);
  const [loadedAttractions, setLoadedAttractions] = useState([]);
  const [loadedTransportation, setLoadedTransportation] = useState([]);
  const [loadedPaymentOptions, setLoadedPaymentOptions] = useState([]);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:4000/user");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    // Fetch travel data
    const fetchTravelData = async () => {
      try {
        const [citiesData, flightsData, hotelsData, attractionsData, transportationData, paymentOptionsData] =
          await Promise.all([
            fetch("http://localhost:4000/cities").then((res) => res.json()),
            fetch("http://localhost:4000/flights").then((res) => res.json()),
            fetch("http://localhost:4000/hotels").then((res) => res.json()),
            fetch("http://localhost:4000/attractions").then((res) => res.json()),
            fetch("http://localhost:4000/transportation").then((res) => res.json()),
            fetch("http://localhost:4000/payment-options").then((res) => res.json()),
          ]);

        setLoadedCities(citiesData);
        setLoadedFlights(flightsData);
        setLoadedHotels(hotelsData);
        setLoadedAttractions(attractionsData);
        setLoadedTransportation(transportationData);
        setLoadedPaymentOptions(paymentOptionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUser();
    fetchTravelData();
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

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  const steps = [
    // ... (same as your original steps array)
  ];

  const renderProgressBar = () => (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
      ></div>
    </div>
  );

  const renderStepContent = () => {
    const step = steps[currentStep];
    if (step.label === "Trip Summary") {
      return (
        <div className="step">
          <div className="step-header">
            <step.icon />
            <h2>{step.label}</h2>
          </div>
          <div className="step-content">
            {step.questions.map((q, index) => (
              <div key={index}>
                <label>{q.prompt}</label>
                <p>{q.value || userResponses[q.prompt]}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setCurrentStep(0)}>Start Over</button>
        </div>
      );
    }
    return (
      <div className="step">
        <div className="step-header">
          <step.icon />
          <h2>{step.label}</h2>
        </div>
        <div className="step-content">
          {step.questions.map((q, index) => (
            <div key={index}>
              <label>{q.prompt}</label>
              {q.type === "text" || q.type === "date" ? (
                <input
                  type={q.type}
                  value={userResponses[q.prompt] || ""}
                  onChange={(e) =>
                    setUserResponses({
                      ...userResponses,
                      [q.prompt]: e.target.value,
                    })
                  }
                />
              ) : (
                <select
                  value={userResponses[q.prompt] || ""}
                  onChange={(e) =>
                    setUserResponses({
                      ...userResponses,
                      [q.prompt]: e.target.value,
                    })
                  }
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {q.options.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={
            currentStep === steps.length - 1 ||
            !userResponses[steps[currentStep].questions[0].prompt]
          }
        >
          Next <ChevronRight />
        </button>
      </div>
    );
  };

  return (
    <div className="containerCh">
      <header className="header">
        <div className="logo">
          <Link to="/main">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        {location.pathname !== "/" &&
          location.pathname !== "/login" &&
          location.pathname !== "/signup" &&
          user && (
            <nav className={`navbar ${isMenuOpen ? "show" : ""}`}>
              <Link to="/main" className={isActive("/main")}>
                Main
              </Link>
              <Link to="/about" className={isActive("/about")}>
                About
              </Link>
              <Link to="/chat" className={isActive("/chat")}>
                Chat
              </Link>
              <Link to="/personal-area" className={isActive("/personal-area")}>
                Personal Area
              </Link>
              <Link to="/video" className={isActive("/video")}>
                Video
              </Link>
              <Link to="/DownloadApp" className={isActive("/DownloadApp")}>
                Download App
              </Link>
            </nav>
          )}
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
        {location.pathname !== "/" && user && (
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
      <h1>Travel Planner</h1>
      {renderProgressBar()}
      {renderStepContent()}
    </div>
  );
};

export default TravelPlannerApp;