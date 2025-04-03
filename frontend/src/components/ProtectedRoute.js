import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { userData } = useUser();

    if (!userData) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute; 