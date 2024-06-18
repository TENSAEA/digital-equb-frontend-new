import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Box, Alert } from "@mui/material";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [callbackExecuted, setCallbackExecuted] = useState(false);

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref");

    const handlePaymentCallback = async () => {
      const token = localStorage.getItem("token");

      if (!token || callbackExecuted) {
        return;
      }

      setCallbackExecuted(true);

      try {
        const response = await axios.post(
          "https://digital-equb-backend-new.onrender.com/api/equb/payment/callback",
          {
            tx_ref,
            status: "success",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage(response.data.message);
        setIsError(false); // Assuming the callback will return a success message if no errors
      } catch (error) {
        setMessage("Error recording payment");
        setIsError(false);
      }
    };

    handlePaymentCallback();
  }, [searchParams, callbackExecuted]);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Alert severity={isError ? "error" : "success"} sx={{ mt: 2 }}>
          {isError ? message : "Payment was successful!"}
        </Alert>
        <Typography variant="h4" gutterBottom>
          Thank you for your contribution!
        </Typography>
        <Typography variant="body1">
          Your payment has been recorded. You can check the status of your
          contribution in your Report Page.
        </Typography>
      </Box>
    </Container>
  );
};

export default PaymentSuccess;
