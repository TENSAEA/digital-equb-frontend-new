import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Box,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material"; // Importing the ArrowBack icon

const EqubDetails = () => {
  const { id } = useParams(); // Get the equb ID from the route parameters
  const [equb, setEqub] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEqubDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await axios.get(
          `https://digital-equb-backend-new.onrender.com/api/equbs/${id}`, // Fetch equb details by ID
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set authorization header
            },
          }
        );

        setEqub(response.data.equb); // Store the equb details
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login"); // Redirect to login if unauthorized
        } else {
          setMessage("Error fetching equb details");
          setIsError(true);
        }
      }
    };

    fetchEqubDetails(); // Fetch equb details on component mount
  }, [id, navigate]);

  if (!equb) {
    return <Typography variant="h6">Loading...</Typography>; // Display while fetching data
  }

  return (
    <Box sx={{ padding: 3 }}>
      {message && (
        <Alert severity={isError ? "error" : "success"}>{message}</Alert> // Display error or success message
      )}

      <Card>
        <CardContent>
          {/* Back button */}
          <IconButton
            onClick={() => navigate("/myequb")}
            color="primary"
            aria-label="back"
          >
            <ArrowBack />
            <Typography variant="body2">Back</Typography>
          </IconButton>
          <Typography variant="h4">{equb.name}</Typography>{" "}
          {/* Display equb name */}
          <Typography variant="body1">{equb.description}</Typography>{" "}
          {/* Display equb description */}
          <Typography variant="body2">Frequency: {equb.frequency}</Typography>
          <Typography variant="body2">
            Contribution: {equb.contributionAmount}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/join-equb/${id}`)} // Navigate to join-equb
          >
            Join
          </Button>{" "}
          {/* Join button */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EqubDetails;
