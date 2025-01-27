import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PersonalArea from "../pages/PersonalArea";
import Chat from "../pages/Chat";
import DownloadApp from "../pages/DownloadApp";

let isAuth = true;  // Simulate authentication

export const Router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/personal-area", element: isAuth ? <PersonalArea /> : <Navigate to="/login" /> },
    { path: "/chat-ai", element: <Chat /> },
    { path: "/download", element: <DownloadApp /> },
]);
