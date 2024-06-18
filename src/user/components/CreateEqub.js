import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  TextareaAutosize,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";

const CreateEqub = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [createdEqubId, setCreatedEqubId] = useState(null); // To store the created Equb ID
  const navigate = useNavigate(); // Navigation hook
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    if (!isError && createdEqubId) {
      // If successful and there's a valid Equb ID, redirect after 2 seconds
      const timer = setTimeout(() => {
        navigate(`/invite/${createdEqubId}`); // Navigate to the invitation page
      }, 2000); // Wait for 2 seconds

      return () => clearTimeout(timer); // Cleanup timer when the component unmounts
    }
  }, [isError, createdEqubId, navigate]); // Trigger on changes to these dependencies

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const response = await axios.post(
        "https://digital-equb-backend-new.onrender.com/api/equbs/create",
        {
          name,
          description,
          frequency,
          contributionAmount: parseFloat(contributionAmount),
          StartDate: startDate.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the authorization header
          },
        }
      );

      setCreatedEqubId(response.data.equb._id); // Store the created Equb ID
      setMessage("Equb created successfully");
      setIsError(false);

      // Clear the form after submission
      setName("");
      setDescription("");
      setFrequency("");
      setContributionAmount("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating Equb");
      setIsError(true);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 4,
        textAlign: "center",
        backgroundColor: "white",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Create Equb
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Equb Name"
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

        <Select
          fullWidth
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          displayEmpty
          required
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="" disabled>
            Select frequency
          </MenuItem>
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>

        <TextField
          fullWidth
          label="Contribution Amount"
          type="number"
          value={contributionAmount}
          onChange={(e) => setContributionAmount(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Start Date"
          type="date"
          value={startDate.toISOString().substring(0, 10)} // Convert Date object to 'yyyy-mm-dd' format
          onChange={(e) => setStartDate(new Date(e.target.value))} // Convert string to Date object
          InputLabelProps={{
            shrink: true,
          }}
          required
          margin="normal"
        />

        <Button variant="contained" color="primary" type="submit" fullWidth>
          Create Equb
        </Button>
      </form>

      {message && (
        <Alert severity={isError ? "error" : "success"} sx={{ marginTop: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default CreateEqub;
