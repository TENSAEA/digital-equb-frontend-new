import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Report = () => {
  const [requests, setRequests] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await axios.get(
          `https://digital-equb-backend-new.onrender.com/api/requests/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRequests(response.data);
      } catch (error) {
        setMessage("Error fetching user requests");
      }
    };

    const fetchUserContributions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await axios.get(
          `https://digital-equb-backend-new.onrender.com/api/equb/${userId}/contribution-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setContributions(response.data);
      } catch (error) {
        setMessage("Error fetching user contributions");
      }
    };

    fetchUserRequests();
    fetchUserContributions();
  }, [userId]);

  const handleDeleteContribution = async (contributionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      await axios.delete(
        `https://digital-equb-backend-new.onrender.com/api/equb/contribution/${contributionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContributions(
        contributions.filter(
          (contribution) => contribution._id !== contributionId
        )
      );
    } catch (error) {
      setMessage("Error deleting contribution");
    }
  };
  const handleDeleteRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      await axios.delete(
        `https://digital-equb-backend-new.onrender.com/api/requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequests(requests.filter((request) => request._id !== requestId));
    } catch (error) {
      setMessage("Error deleting request");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      {message && <Alert severity="error">{message}</Alert>}
      <Typography variant="h4">Report</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">Request History</Typography>
          {requests.map((request) => (
            <Card key={request._id}>
              <CardContent>
                <Typography variant="body2">
                  Equb ID: {request.equbId}
                </Typography>
                <Typography variant="body2">
                  Message: {request.message}
                </Typography>
                <Typography variant="body2">
                  Date: {new Date(request.date).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Status: {request.status}
                </Typography>
                <IconButton onClick={() => handleDeleteRequest(request._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">Payment History</Typography>
          {contributions.map((contribution) => (
            <Card key={contribution._id}>
              <CardContent>
                <Typography variant="body2">
                  Equb ID: {contribution.equbId}
                </Typography>
                <Typography variant="body2">
                  Date: {new Date(contribution.date).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Round: {contribution.round}
                </Typography>
                <IconButton
                  onClick={() => handleDeleteContribution(contribution._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Report;
