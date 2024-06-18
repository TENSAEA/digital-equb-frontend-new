import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      return;
    }

    try {
      const response = await axios.post(
        `https://digital-equb-backend-new.onrender.com/api/users/reset-password/${token}`,
        { password }
      );
      setMessage(response.data.message);
      setIsError(false);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
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
          Reset Password
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
            type="password"
            label="New Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Reset Password
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ResetPassword;
