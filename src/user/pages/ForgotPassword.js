// src/components/ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://digital-equb-backend-new.onrender.com/api/users/forgot-password",
        { email }
      );
      setMessage(response.data.message);
      setIsError(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error sending password reset email";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          boxShadow: 3,
          padding: 4,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" component="h2" sx={{ marginBottom: 2 }}>
          Forgot Password
        </Typography>

        {message && (
          <Alert
            severity={isError ? "error" : "success"}
            sx={{ marginBottom: 2 }}
          >
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            Send Reset Link
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
