/**
 * @file UserContext.js
 * @description Context provider for user authentication and state management
 * @author Nandeesh Kantli
 * @date April 4, 2024
 * @version 1.0.0
 * 
 * This context provides:
 * 1. User authentication state management
 * 2. User profile data access
 * 3. Authentication methods (login, logout, etc.)
 * 4. Protected route functionality
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8000/api/profile/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        setUserData(response.data);
      } catch (err) {
        setError(err.message);
        // Clear invalid token
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const login = (user) => {
    setUserData(user);
    setError(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserData(null);
    setError(null);
  };

  const updateProfile = async (updateData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put('http://localhost:8000/api/profile/update/', updateData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': updateData instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
      });

      setUserData(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    userData,
    loading,
    error,
    login,
    logout,
    updateProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};