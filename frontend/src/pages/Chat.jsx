import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
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
    Promise.all([/* the fetch calls as you have them */])
      .then(([citiesData, flightsData, hotelsData, attractionsData, transportationData, paymentOptionsData]) => {
        setLoadedCities(citiesData);
        setLoadedFlights(flightsData);
        setLoadedHotels(hotelsData);
        setLoadedAttractions(attractionsData);
        setLoadedTransportation(transportationData);
        setLoadedPaymentOptions(paymentOptionsData);
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
          options: Array.isArray(loadedCities) && loadedCities.length > 0
            ? loadedCities
            : ["Loading..."],
        },
      ],
      icon: MapPin,
    },
    {
      label: "Flight",
      questions: [
        { prompt: "Travel dates (departure)?", type: "date" },
        {
          prompt: "Travel dates (return)?",
          type: "date",
          validateDate: (departureDate, returnDate) => {
            return new Date(returnDate) >= new Date(departureDate); // Ensures return date is after departure date
          },
        },
        {
          prompt: "Select your flight",
          options: Array.isArray(loadedFlights) && loadedFlights.length > 0
            ? loadedFlights.find(flight => flight.city === userResponses["What is your destination city?"])?.airlines.map(
              airline => `${airline.name} - $${airline.price} (${airline.duration})`
            ) || []
            : ["Loading..."],
        },
        {
          prompt: "Class preference",
          options: ["Economy", "Business", "First"],
        },
      ],
      icon: Plane,
    },
    // More steps here...
  ];

  const handleDateChange = (stepIndex, questionIndex, dateValue) => {
    const newUserResponses = { ...userResponses };
    newUserResponses[steps[stepIndex].questions[questionIndex].prompt] = dateValue;

    // If it's the return date, validate it
    if (steps[stepIndex].questions[questionIndex].prompt === "Travel dates (return)?" && userResponses["Travel dates (departure)?"]) {
      const isValid = steps[stepIndex].questions[questionIndex].validateDate(
        userResponses["Travel dates (departure)?"], 
        dateValue
      );
      if (!isValid) {
        alert("Return date must be after departure date!");
        return;
      }
    }

    setUserResponses(newUserResponses);
  };

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
                    handleDateChange(currentStep, index, e.target.value)
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
        <div className="navigation-buttons">
          <button
            onClick={() => setCurrentStep((prev) => prev - 1)} // Go to previous step
            disabled={currentStep === 0}
          >
            <ChevronLeft /> Back
          </button>
          <button
            onClick={() => setCurrentStep((prev) => prev + 1)} // Go to next step
            disabled={currentStep === steps.length - 1 || !userResponses[steps[currentStep].questions[0].prompt]}
          >
            Next <ChevronRight />
          </button>
        </div>
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
