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
} from "@mui/material";

const UserCreatedEqubs = () => {
  const [equbs, setEqubs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserCreatedEqubs = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure this is available
        const response = await axios.get(
          "https://digital-equb-backend-new.onrender.com/api/equbs/user-created",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEqubs(response.data.equbs);
      } catch (error) {
        console.error("Error fetching user-created equbs", error);
      }
    };

    fetchUserCreatedEqubs();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">My Equbs</Typography> {/* Heading */}
      <Grid container spacing={3}>
        {equbs.map((equb) => (
          <Grid item xs={12} sm={6} md={4} key={equb._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{equb.name}</Typography>{" "}
                {/* Equb name */}
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/draw/${equb._id}`)} // Redirect to draw
                >
                  Draw
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserCreatedEqubs;
