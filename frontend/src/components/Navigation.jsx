import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
      <header style={styles.header}>
        <h1>PathMakers</h1>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/about" style={styles.link}>About</Link>
          <Link to="/login" style={styles.link}>Login</Link>
          <Link to="/register" style={styles.link}>Register</Link>
          <Link to="/personal-area" style={styles.link}>Personal Area</Link>
          <Link to="/chat-ai" style={styles.link}>Chat AI</Link>
          <Link to="/download" style={styles.link}>Download</Link>
        </nav>
      </header>

      <div style={styles.container}>
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
    </Router>
  );
}

// Simple inline styles for the navigation bar
const styles = {
  header: {
    backgroundColor: "#333",
    color: "white",
    padding: "10px",
    textAlign: "center"
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "10px"
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
  },
  container: {
    padding: "20px"
  }
};

export default App;
