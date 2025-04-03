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
import Groups from './pages/Groups';
import ShareExpenses from './pages/ShareExpenses';
import { UserProvider, useUser } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppContent() {
    const { userData } = useUser();

    return (
        <div className="app">
            <div className={`main-content ${userData ? 'with-sidebar' : 'without-sidebar'}`}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<About />} />

                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <>
                                {userData && <SideBar />}
                                <Dashboard />
                            </>
                        </ProtectedRoute>
                    } />
                    <Route path="/user" element={
                        <ProtectedRoute>
                            <>
                                {userData && <SideBar />}
                                <UserPage />
                            </>
                        </ProtectedRoute>
                    } />
                    <Route path="/groups" element={
                        <ProtectedRoute>
                            <>
                                {userData && <SideBar />}
                                <Groups />
                            </>
                        </ProtectedRoute>
                    } />
                    <Route path="/share-expenses" element={
                        <ProtectedRoute>
                            <>
                                {userData && <SideBar />}
                                <ShareExpenses />
                            </>
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <UserProvider>
            <Router>
                <AppContent />
            </Router>
        </UserProvider>
    );
}

export default App;
