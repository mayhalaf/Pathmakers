import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  MapPin,
  Plane,
  Hotel,
  Compass,
  Car,
  CreditCard,
  CheckCircle,
} from "lucide-react";
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

  useEffect(() => {
    // Fetch data from server endpoints
    Promise.all([
      fetch("http://localhost:4000/cities").then((res) => res.json()),
      fetch("http://localhost:4000/flights").then((res) => res.json()),
      fetch("http://localhost:4000/hotels").then((res) => res.json()),
      fetch("http://localhost:4000/attractions").then((res) => res.json()),
      fetch("http://localhost:4000/transportation").then((res) => res.json()),
      fetch("http://localhost:4000/payment-options").then((res) => res.json()),
    ])
      .then(
        ([
          citiesData,
          flightsData,
          hotelsData,
          attractionsData,
          transportationData,
          paymentOptionsData,
        ]) => {
          setLoadedCities(citiesData);
          setLoadedFlights(flightsData);
          setLoadedHotels(hotelsData);
          setLoadedAttractions(attractionsData);
          setLoadedTransportation(transportationData);
          setLoadedPaymentOptions(paymentOptionsData);
        }
      )
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
          options: Array.isArray(loadedCities) && loadedCities.length > 0
          ? loadedCities // ✅ Just use the array directly
          : ["Loading..."],
        
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
          options: Array.isArray(loadedFlights) && loadedFlights.length > 0
          ? (loadedFlights.find(flight => flight.city === userResponses["What is your destination city?"])?.airlines.map(
              airline => `${airline.name} - $${airline.price} (${airline.duration})`
            ) || [])
          : ["Loading..."],
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
          options: Array.isArray(loadedHotels) && loadedHotels.length > 0
          ? (loadedHotels.find(hotel => hotel.city === userResponses["What is your destination city?"])?.hotels.map(
              hotel => `${hotel.name} - $${hotel.price}/night`
            ) || [])
          : ["Loading..."],
        
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
          options: Array.isArray(loadedAttractions) && loadedAttractions.length > 0
          ? (loadedAttractions.find(attraction => attraction.city === userResponses["What is your destination city?"])?.attractions || [])
          : ["Loading..."],
        
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
    {
      label: "Transportation",
      questions: [
        {
          prompt: "Select your mode of transportation",
          options: Array.isArray(loadedTransportation) && loadedTransportation.length > 0
          ? loadedTransportation.map((transport) => 
              transport.type && transport.price !== undefined
                ? `${transport.type} - $${transport.price}`
                : "Invalid transportation data"
            )
          : ["Loading..."],
        
        },
        { prompt: "Do you need airport transfer?", options: ["Yes", "No"] },
      ],
      icon: Car,
    },
    {
      label: "Payment",
      questions: [
        {
          prompt: "Select payment method",
          options: Array.isArray(loadedPaymentOptions) && loadedPaymentOptions.length > 0
          ? loadedPaymentOptions.map((paymentOption) => 
              paymentOption.method ? paymentOption.method : "Invalid payment option"
            )
          : ["Loading..."],
        
        },
        { prompt: "Do you have a promo code?", type: "text" },
      ],
      icon: CreditCard,
    },
    {
      label: "Trip Summary",
      questions: [
        { prompt: "Departure city", type: "text", value: userResponses["What is your departure city?"] },
        { prompt: "Destination city", type: "text", value: userResponses["What is your destination city?"] },
        { prompt: "Flight", type: "text", value: userResponses["Select your flight"] },
        { prompt: "Hotel", type: "text", value: userResponses["Select your hotel"] },
        { prompt: "Attractions", type: "text", value: userResponses["Select attractions to visit"] },
        { prompt: "Transportation", type: "text", value: userResponses["Select your mode of transportation"] },
        { prompt: "Payment method", type: "text", value: userResponses["Select payment method"] },
      ],
      icon: CheckCircle,
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
          <button
            onClick={() => setCurrentStep(0)} // Reset to start over
            disabled={currentStep === steps.length - 1}
          >
            Start Over
          </button>
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
          disabled={currentStep === steps.length - 1 || !userResponses[steps[currentStep].questions[0].prompt]}
        >
          Next <ChevronRight />
        </button>
      </div>
    );
  };

  return (
    <div className="containerCh">
      <header>
        <h1>Travel Planner</h1>
        {renderProgressBar()}
      </header>
      {renderStepContent()}
    </div>
  );
};

export default TravelPlannerApp;
