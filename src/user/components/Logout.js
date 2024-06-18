import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Card, CardContent, Typography, Box } from '@mui/material';

const Logout = () => {
  const { clearAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication token from local storage
    localStorage.removeItem('authToken');

    // Clear authentication context data
    clearAuthData();

    // Redirect to the login page after a short delay
    setTimeout(() => {
      navigate('/login');
    }, 1000); // 1-second delay to allow the message to be visible
  }, [clearAuthData, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        height: '100vh', // Full viewport height
      }}
    >
      <Card sx={{ maxWidth: 300 }}> {/* Card-like appearance */}
        <CardContent>
          <Typography variant="h6" component="div" textAlign="center">
            Logging out...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Logout;
