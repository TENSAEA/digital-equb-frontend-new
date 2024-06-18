import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
} from "@mui/material";

const User_Member_Equbs = () => {
  const [equbs, setEqubs] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

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
  }, []);

  const handleResultClick = (equbId) => {
    navigate(`/draw/${equbId}/result`);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3, ml: 30 }}>
      {message && (
        <Alert severity={isError ? "error" : "success"}>{message}</Alert>
      )}{" "}
      {/* Display error or success message */}
      <Typography variant="h4">My Equbs</Typography> {/* Section heading */}
      <Grid container spacing={3}>
        {equbs.map((equb) => (
          <Grid item xs={12} sm={6} md={4} key={equb._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{equb.name}</Typography>{" "}
                {/* Display equb name */}
                <Typography variant="body2">
                  Admin: {equb.admin.fname} {equb.admin.lname}
                </Typography>{" "}
                {/* Display admin name */}
                <Typography variant="body2">
                  Members: {equb.members.length}
                </Typography>{" "}
                {/* Display number of members */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleResultClick(equb._id)}
                >
                  Result
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default User_Member_Equbs;
