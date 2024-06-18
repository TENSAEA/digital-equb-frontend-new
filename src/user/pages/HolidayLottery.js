import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  TextareaAutosize,
  Button,
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
} from "@mui/material";

const HolidayLottery = () => {
  const [lotteries, setLotteries] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchHolidayLotteries = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await axios.get(
          "https://digital-equb-backend-new.onrender.com/api/holiday-lotteries",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Ensure you're setting lotteries correctly
        setLotteries(response.data); // Or adjust based on the response structure
      } catch (error) {
        setMessage("Error fetching holiday lotteries");
        setIsError(true);
      }
    };

    fetchHolidayLotteries();
  }, []);
  const handleCreateLottery = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      await axios.post(
        "https://digital-equb-backend-new.onrender.com/api/holiday-lotteries/create",
        {
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Holiday lottery created successfully");
      setIsError(false);

      setName("");
      setDescription("");
    } catch (error) {
      setMessage("Error creating holiday lottery");
      setIsError(true);
    }
  };

  const handleJoinLottery = async (lotteryId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      await axios.post(
        `https://digital-equb-backend-new.onrender.com/api/holiday-lotteries/${lotteryId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("You have joined the lottery successfully");
      setIsError(false);
    } catch (error) {
      setMessage("Error joining the lottery");
      setIsError(true);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {message && (
        <Alert severity={isError ? "error" : "success"}>{message}</Alert>
      )}
      {user.role === "admin" && (
        <Box
          sx={{
            maxWidth: 400,
            margin: "auto",
            padding: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Create Holiday Lottery
          </Typography>

          <form onSubmit={handleCreateLottery}>
            <TextField
              fullWidth
              label="Lottery Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />

            <TextareaAutosize
              minRows={3}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", marginBottom: 16 }}
              required
            />

            <Button variant="contained" color="primary" type="submit" fullWidth>
              Create Lottery
            </Button>
          </form>
        </Box>
      )}

      {user.role !== "admin" && // Only show lotteries for non-admin users
        lotteries.map((lottery) => (
          <Card key={lottery._id}>
            <CardContent>
              <Typography variant="h4">{lottery.name}</Typography>
              <Typography variant="body1">{lottery.description}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleJoinLottery(lottery._id)}
              >
                Join Lottery
              </Button>
            </CardContent>
          </Card>
        ))}
    </Box>
  );
};

export default HolidayLottery;
