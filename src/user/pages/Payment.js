import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  Container,
} from "@mui/material";

const Payment = () => {
  const [equbs, setEqubs] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchUserEqubs = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await axios.get(
          "https://digital-equb-backend-new.onrender.com/api/equbs/my-equbs", // Endpoint for user's equbs
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set authorization header
            },
          }
        );

        setEqubs(response.data.equbs); // Store the user's equbs
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          setMessage("Error fetching user equbs");
          setIsError(true);
        }
      }
    };

    fetchUserEqubs(); // Fetch user's equbs on component mount
  }, [navigate]);

  const handleContribution = async (equb) => {
    try {
      setMessage("");
      setIsError(false);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const email = equb.admin.email;
      const amount =
        equb.contributionAmount * (equb.frequency === "monthly" ? 1.05 : 1.03);

      // Check if the user has already contributed for the current round
      const response = await axios.post(
        "https://digital-equb-backend-new.onrender.com/api/equb/check-contribution",
        {
          equbId: equb._id,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.data.message ===
        "You have already contributed for the current round."
      ) {
        setMessage(response.data.message);
        setIsError(true);
        return;
      }

      const paymentResponse = await axios.post(
        "https://digital-equb-backend-new.onrender.com/api/equb/initiate-payment",
        {
          equbId: equb._id,
          userId,
          amount,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { paymentUrl } = paymentResponse.data;
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Error initiating payment:", error);
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        setMessage("No response from the server. Please try again later.");
      } else {
        setMessage(`Request error: ${error.message}`);
      }
      setIsError(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {message && (
        <Alert severity={isError ? "error" : "success"}>{message}</Alert>
      )}{" "}
      {/* Display error or success message */}
      <Typography variant="h4" gutterBottom>
        Your Equbs
      </Typography>{" "}
      {/* Section heading */}
      <Grid container spacing={3}>
        {equbs.map((equb) => (
          <Grid item xs={12} sm={6} md={4} key={equb._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{equb.name}</Typography>{" "}
                <Typography variant="h6">{equb.contributionAmount}</Typography>{" "}
                {/* Display equb name */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleContribution(equb)}
                  sx={{ mt: 2 }}
                >
                  Pay Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Payment;
