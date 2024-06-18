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
} from "@mui/material";

const JoinEqub = ({ user }) => {
  const { id } = useParams(); // Get equb ID from the route
  const [equb, setEqub] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const [joinButtonDisabled, setJoinButtonDisabled] = useState(false);

  const handleJoinEqub = async () => {
    if (joinButtonDisabled) {
      return;
    }
    setJoinButtonDisabled(true);
    await confirmJoinEqub();
    setJoinButtonDisabled(false);
  };

  useEffect(() => {
    const fetchEqubDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await axios.get(
          `https://digital-equb-backend-new.onrender.com/api/equbs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set authorization header
            },
          }
        );

        setEqub(response.data.equb);
      } catch (error) {
        setMessage("Error fetching equb details");
        setIsError(true);
      }
    };

    fetchEqubDetails(); // Fetch equb details
  }, [id]);

  const confirmJoinEqub = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure token is valid
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      await axios.post(
        "https://digital-equb-backend-new.onrender.com/api/requests/send",
        {
          senderId: user._id,
          equbId: id,
          equbAdminId: equb.admin,
          message: "Request to join the Equb",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set authorization header
          },
        }
      );

      setMessage(
        "Your request has been sent to the Equb admin. Please wait for approval."
      );
      setIsError(false);

      setTimeout(() => {
        navigate("/available-equbs"); // Redirect after a delay
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data.message || error.message);
      setIsError(true);
    }
  };

  if (!equb) {
    return <Typography variant="h6">Loading...</Typography>; // While fetching data
  }

  return (
    <Box sx={{ padding: 3 }}>
      {message && (
        <Alert severity={isError ? "error" : "success"}>{message}</Alert> // Show message
      )}
      <Card>
        <CardContent>
          <Typography variant="h4">{equb.name}</Typography>
          <Typography variant="body1">{equb.description}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={confirmJoinEqub} // Join the equb on confirm
            disabled={joinButtonDisabled}
          >
            Confirm To Join
          </Button>{" "}
          {/* Confirm join button */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default JoinEqub;
