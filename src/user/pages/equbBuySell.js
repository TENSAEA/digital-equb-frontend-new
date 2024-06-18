import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Button,
  Tabs,
  Tab,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";

const BuySell = () => {
  const [value, setValue] = useState(0);
  const [equbsForSale, setEqubsForSale] = useState([]);
  const [userWonEqubs, setUserWonEqubs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authorization token not found");
    }
    // Fetch available equbs for sale
    axios
      .get("https://digital-equb-backend-new.onrender.com/equbBuySell/", {
        headers: {
          Authorization: `Bearer ${token}`, // Set the authorization header
        },
      })
      .then((response) => {
        setEqubsForSale(response.data);
      });
    axios
      .get(
        `https://digital-equb-backend-new.onrender.com/equbBuySell/user/${userId}/wonEqubs`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the authorization header
          },
        }
      )
      .then((response) => {
        setUserWonEqubs(response.data);
      });
  }, []);

  return (
    <Container>
      <Paper square>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Buy" />
          <Tab label="Sell" />
        </Tabs>
      </Paper>
      <Box
        display="flex"
        justifyContent="space-between"
        my={2}
        borderBottom={1}
        borderColor="grey.500"
      >
        {value === 0 && (
          <Box flex={1}>
            <Typography variant="h6">Available Equbs for Sale</Typography>
            {equbsForSale.map((equb, index) => (
              <Box key={index} p={2} border={1} borderColor="grey.300" my={1}>
                <Typography>Name: {equb.name}</Typography>
                <Typography>Description: {equb.description}</Typography>
                <Typography>Price: {equb.price}</Typography>
              </Box>
            ))}
          </Box>
        )}
        {value === 1 && (
          <Box flex={1}>
            <Typography variant="h6">Your Won Equbs</Typography>
            {userWonEqubs.map((equb, index) => (
              <Box key={index} p={2} border={1} borderColor="grey.300" my={1}>
                <Typography>Name: {equb.name}</Typography>
                <Button variant="contained" color="primary">
                  Sell
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default BuySell;
