import React, { createContext, useState, } from 'react';

// Create the context
export const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  // Retrieve token and user from local storage during initialization
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  const [auth, setAuth] = useState({
    token: storedToken || null,
    user: storedUser ? JSON.parse(storedUser) : null, // Parse stored user data
  });

  // Set authentication data and persist it in local storage
  const setAuthData = (token, user) => {
    setAuth({ token, user });
    localStorage.setItem('token', token); // Store token in local storage
    localStorage.setItem('user', JSON.stringify(user)); // Store user data in local storage
  };

  // Clear authentication data and remove from local storage
  const clearAuthData = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ auth, setAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
