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
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  return (
    <UserContext.Provider value={{ userData, setUserData, loading, error, updateProfile }}>
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