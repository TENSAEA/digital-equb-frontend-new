import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useParams } from "react-router-dom";

// Invite component to invite users to an Equb
const Invite = ({ inviter }) => {
  const { equbId } = useParams(); // Get the Equb ID from the URL parameter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [Error, setIsError] = useState(false);

  // Search users by name
  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]); // Reset results if query is too short
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }
      const response = await axios.get(
        `https://digital-equb-backend-new.onrender.com/api/users/search/${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSearchResults(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Error fetching users");
    }

    setLoading(false);
  };

  // Select user
  const handleSelectUser = (user) => {
    setSelectedUsers((prevSelected) => [...prevSelected, user]);
    setSearchResults([]); // Clear search results after selecting a user
  };

  // Remove user
  const handleRemoveUser = (user) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.filter((u) => u._id !== user._id)
    );
  };

  // Send invitations
  const handleInvite = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const notifications = selectedUsers.map((user) => ({
        recipient: user._id,
        message: `You are invited to join an equb by ${inviter.fname} ${inviter.lname}. Click here to join: https://digital-equb-frontend-new.onrender.com/join/${equbId}`,
      }));

      await axios.post(
        "https://digital-equb-backend-new.onrender.com/api/notifications/many",
        { invitations: notifications },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the authorization header
          },
        }
      );

      setMessage("Invitations sent successfully");
      setIsError(false);

      // Clear the form after submission
      setSelectedUsers([]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error sending invitations";
      setMessage(errorMessage);
      setIsError(true); // Set to true on error
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">Invite Users to Equb</Typography>
      <TextField
        label="Search Users"
        value={searchQuery}
        onChange={handleSearch}
        fullWidth
        sx={{ my: 2 }}
      />
      {loading && <CircularProgress />}{" "}
      {/* Show loading indicator during search */}
      {/* Display search results */}
      {searchResults.length > 0 && (
        <Autocomplete
          options={searchResults}
          getOptionLabel={(user) => `${user.fname} ${user.lname}`}
          renderInput={(params) => (
            <TextField {...params} label="Search Users" variant="outlined" />
          )}
          onChange={(event, value) => handleSelectUser(value)}
          // This ensures the dropdown is open if there are options
          open={searchResults.length > 0}
          onOpen={() => {
            if (searchResults.length === 0) {
              // Optionally, trigger search again or handle as needed
            }
          }}
          onClose={() => {
            // Handle dropdown close if needed
          }}
          // No need to set a value here since we're not pre-selecting any option
        />
      )}
      {/* Display selected users */}
      <Box sx={{ mt: 2 }}>
        {selectedUsers.map((user) => (
          <Chip
            key={user._id}
            label={`${user.fname} ${user.lname}`}
            onDelete={() => handleRemoveUser(user)}
            color="primary"
            sx={{ mr: 1 }}
          />
        ))}
      </Box>
      {/* Send invitations */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleInvite}
        sx={{ mt: 2 }}
      >
        Invite
      </Button>
      {message && (
        <Alert
          severity={Error ? "error" : "success"} // Use the Error state to determine the severity
          sx={{ mt: 2 }}
        >
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default Invite;
