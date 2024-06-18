import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";

const AvailableEqubs = () => {
  const [equbs, setEqubs] = useState([]);
  const [message, setMessage] = useState("");
  const { auth, clearAuthData } = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableEqubs = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await axios.get(
          "https://digital-equb-backend-new.onrender.com/api/equbs/available-equbs",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set authorization header
            },
          }
        );

        setEqubs(response.data.equbs); // Set the available equbs
      } catch (error) {
        if (error.response && error.response.status === 401) {
          clearAuthData(); // Clear auth data and redirect to login
          navigate("/login");
        } else {
          setMessage("Error fetching available equbs");
        }
      }
    };

    fetchAvailableEqubs(); // Fetch available equbs on component mount
  }, [navigate, clearAuthData]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 3,
        ml: 30, // Ensure the sidebar doesn't cover the content
      }}
    >
      {message && <Alert severity="error">{message}</Alert>}{" "}
      {/* Display error message */}
      <h1>Available Equbs</h1>
      <Grid container spacing={3}>
        {equbs.map((equb) => (
          <Grid item xs={12} sm={6} md={4} key={equb._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{equb.name}</Typography>{" "}
                {/* Display equb name */}
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/equb-details/${equb._id}`)}
                >
                  Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AvailableEqubs;
