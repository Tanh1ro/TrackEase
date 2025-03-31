import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import About from "./pages/About";
import Footer from './components/Footer';
import SideBar from './components/SideBar';
import UserPage from './pages/UserPage';
import { UserProvider } from './context/UserContext';
import './App.css';

function App() {
    return (
        <UserProvider>
            <Router>
                <div className="app">
                    <SideBar />
                    <div className="main-content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/user" element={<UserPage />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
