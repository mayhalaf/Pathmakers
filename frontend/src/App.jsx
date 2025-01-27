import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Header />  {/* Header component */}
      { <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes> }
      <Footer />  {/* Footer component */}
    </Router>
  );
}

export default App;
