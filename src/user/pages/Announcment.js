import React, { useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import axios from "axios";

const Announcement = () => {
  const [announcementText, setAnnouncementText] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }
      const response = await axios.post(
        "https://digital-equb-backend-new.onrender.com/api/announcements",
        { announcement: announcementText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Announcement created successfully!");
      setIsError(false);
      setAnnouncementText(""); // Clear the form
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error creating announcement";
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">Create Announcement</Typography>
      {message && (
        <Alert severity={isError ? "error" : "success"}>{message}</Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Announcement"
          multiline
          rows={4}
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          fullWidth
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Create Announcement
        </Button>
      </form>
    </Box>
  );
};

export default Announcement;
