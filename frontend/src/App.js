import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import SideBar from './components/SideBar';
import ProfilePage from './pages/ProfilePage';
import Groups from './pages/Groups';
import ShareExpenses from './pages/ShareExpenses';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import ThemeSwitch from './components/ThemeSwitch';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import './css/global.css';
import Navbar from './components/Navbar';

function AppContent() {
    const { userData } = useUser();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="app">
            {isHomePage && <Navbar />}
            <div className={`main-content ${userData ? 'with-sidebar' : 'without-sidebar'}`}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <>
                                {userData && <SideBar />}
                                <Dashboard />
                            </>
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <>
                                {userData && <SideBar />}
                                <ProfilePage />
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
                    <Route path="/transactions" element={
                        <ProtectedRoute>
                            <>
                                {userData && <SideBar />}
                                <Transactions />
                            </>
                        </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <>
                                {userData && <SideBar />}
                                <Settings />
                            </>
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
            <ThemeSwitch />
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <Router>
                    <AppContent />
                </Router>
            </UserProvider>
        </ThemeProvider>
    );
}

export default App;
