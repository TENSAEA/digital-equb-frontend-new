import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Box, Alert } from "@mui/material";

const Verify = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `https://digital-equb-backend-new.onrender.com/api/users/verify/${token}`
        );
        setMessage(response.data.message);
        setIsError(false);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error verifying email";
        setMessage(errorMessage);
        setIsError(true);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {message && (
          <Alert
            severity={isError ? "error" : "success"}
            style={{ marginBottom: 16 }}
          >
            {message}
          </Alert>
        )}
        <Typography variant="body1">
          {isError
            ? "Email verification failed. Please try again."
            : "Your email has been verified successfully."}
        </Typography>
      </Box>
    </Container>
  );
};

export default Verify;
