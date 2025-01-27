import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PersonalArea from "./pages/PersonalArea";
import Chat from "./pages/Chat";
import DownloadApp from "./pages/DownloadApp";

function App() {
  return (
    <Router>
      <Header />  {/* Header component */}
<<<<<<< HEAD
      { <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes> }
=======
      
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/personal-area" element={<PersonalArea />} />
          <Route path="/chat-ai" element={<Chat />} />
          <Route path="/download" element={<DownloadApp />} />
        </Routes>
      </div>

>>>>>>> 6808e7af74fde3c43883f6fc49788d65cdf36a35
      <Footer />  {/* Footer component */}
    </Router>
  );
}

// Global styles to ensure layout fits
const styles = {
  content: {
    padding: "20px",
    textAlign: "center",
  },
};

export default App;
