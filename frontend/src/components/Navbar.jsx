import { Link } from "react-router-dom";
import "./Navbar.css";  // Optional CSS styling

export default function Navbar() {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/login">login</Link></li>
                <li><Link to="/register">register</Link></li>
                <li><Link to="/chat-ai">register</Link></li>
                <li><Link to="/personal-area">Personal Area</Link></li>
                <li><Link to="/Video"> Video</Link></li>
                <li><Link to="/download">Download</Link></li>
            </ul>
        </nav>
    );
}
