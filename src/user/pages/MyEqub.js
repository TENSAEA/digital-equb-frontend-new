import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import CreateEqub from "../components/CreateEqub";
import AvailableEqubs from "../components/AvailableEqubs";
import MyEqubs from "../components/MyEqubs";

const MyEqub = () => {
  // State to track which component should be displayed and which card is active
  const [activeComponent, setActiveComponent] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")); // Get user object from localStorage
  const isAdmin = user?.role === "admin"; // Check if user is admin and access role property
  // Function to render the active component based on the state
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "create":
        return <CreateEqub />;
      case "join":
        return <AvailableEqubs />;
      case "myequbs":
        return <MyEqubs />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={4} md={3}>
          <Card
            sx={{
              border: activeComponent === "create" ? "2px solid blue" : "none", // Conditionally apply border
            }}
          >
            <CardContent>
              <Typography variant="h6">Create Equb</Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setActiveComponent("create")} // Set the active component
              >
                Create Equb
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {!isAdmin && (
          <Grid item xs={12} sm={4} md={3}>
            <Card
              sx={{
                border: activeComponent === "join" ? "2px solid blue" : "none", // Conditionally apply border
              }}
            >
              <CardContent>
                <Typography variant="h6">Join Equb</Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setActiveComponent("join")} // Set the active component
                >
                  Join Equb
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
        <Grid item xs={12} sm={4} md={3}>
          <Card
            sx={{
              border: activeComponent === "myequbs" ? "2px solid blue" : "none", // Conditionally apply border
            }}
          >
            <CardContent>
              <Typography variant="h6">My Equbs</Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setActiveComponent("myequbs")} // Set the active component
              >
                My Equbs
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 3 }}>
        {renderActiveComponent()} {/* Render the selected component */}
      </Box>
    </Box>
  );
};

export default MyEqub;
