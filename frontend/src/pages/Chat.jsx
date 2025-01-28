import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  MapPin,
  Plane,
  Hotel,
  Compass,
} from "lucide-react";
import "../components/chat.css";

const TravelPlannerApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [loadedCities, setLoadedCities] = useState([]);
  const [loadedFlights, setLoadedFlights] = useState([]);
  const [loadedHotels, setLoadedHotels] = useState([]);
  const [loadedAttractions, setLoadedAttractions] = useState([]);

  useEffect(() => {
    // Fetch data from server endpoints
    Promise.all([
      fetch("http://localhost:4000/cities").then((res) => res.json()),
      fetch("http://localhost:4000/flights").then((res) => res.json()),
      fetch("http://localhost:4000/hotels").then((res) => res.json()),
      fetch("http://localhost:4000/attractions").then((res) => res.json()),
    ])
      .then(([citiesData, flightsData, hotelsData, attractionsData]) => {
        setLoadedCities(citiesData);
        setLoadedFlights(flightsData);
        setLoadedHotels(hotelsData);
        setLoadedAttractions(attractionsData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const steps = [
    {
      label: "Destination",
      questions: [
        { prompt: "What is your departure city?", type: "text" },
        {
          prompt: "What is your destination city?",
          options: loadedCities.map((city) => city.name),
        },
      ],
      icon: MapPin,
    },
    {
      label: "Flight",
      questions: [
        { prompt: "Travel dates (departure)?", type: "date" },
        { prompt: "Travel dates (return)?", type: "date" },
        {
          prompt: "Select your flight",
          options: loadedFlights.map(
            (flight) =>
              `${flight.airline} - $${flight.price} (${flight.departureTime})`
          ),
        },
        {
          prompt: "Class preference",
          options: ["Economy", "Business", "First"],
        },
      ],
      icon: Plane,
    },
    {
      label: "Hotel",
      questions: [
        {
          prompt: "Select your hotel",
          options: loadedHotels.map(
            (hotel) =>
              `${hotel.name} - ${hotel.stars}⭐ - $${hotel.price}/night`
          ),
        },
        { prompt: "Budget range per night?", type: "text" },
        {
          prompt: "Accessibility requirements?",
          options: ["None", "Wheelchair Access", "Ground Floor", "Special Assistance"],
        },
        {
          prompt: "Pet-friendly options?",
          options: ["Yes", "No"],
        },
      ],
      icon: Hotel,
    },
    {
      label: "Attractions",
      questions: [
        {
          prompt: "Select attractions to visit",
          options: loadedAttractions.map(
            (attraction) =>
              `${attraction.name} - $${attraction.price} - ${attraction.type}`
          ),
        },
        { prompt: "Budget for daily activities?", type: "text" },
        {
          prompt: "Interest areas?",
          options: ["History", "Food", "Nightlife", "Nature", "Culture"],
        },
        {
          prompt: "Group type?",
          options: ["Solo", "Couple", "Family", "Friends"],
        },
        {
          prompt: "Tour preference?",
          options: ["Guided Tours", "Self-Guided"],
        },
      ],
      icon: Compass,
    },
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
                  onChange={(e) =>
                    setUserResponses({
                      ...userResponses,
                      [q.prompt]: e.target.value,
                    })
                  }
                />
              ) : (
                <select
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
          disabled={currentStep === steps.length - 1}
        >
          Next <ChevronRight />
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <header>
        <h1>Travel Planner</h1>
        {renderProgressBar()}
      </header>
      {renderStepContent()}
    </div>
  );
};

export default TravelPlannerApp;
