import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Collapse,
  Alert,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Import delete icon

const Notifications = () => {
  const { userId } = useParams(); // Get the user ID from the URL parameters
  const [notifications, setNotifications] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null); // Track the selected notification

  // Fetch notifications for the specific user
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token"); // Authorization token
        if (!token) {
          throw new Error("Authorization token is missing");
        }
        const response = await axios.get(
          `https://digital-equb-backend-new.onrender.com/api/notifications/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(response.data.notifications);
      } catch (error) {
        setErrorMessage("Error fetching notifications");
      }
    };

    fetchNotifications();
  }, [userId]); // Run when the userId changes

  // Handle the "Details" button click to show/hide notification details
  const handleDetailsClick = async (notification) => {
    if (!notification.read) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await axios.put(
          `https://digital-equb-backend-new.onrender.com/api/notifications/update/${notification._id}`,
          null, // Since there's no body data, just send `null`
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // If the response status is 200 (OK), mark the notification as read
        if (response.status === 200) {
          setNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
              n._id === notification._id ? { ...n, read: true } : n
            )
          );
          setErrorMessage(""); // Clear any previous error messages
        } else {
          setErrorMessage("Unexpected response while updating notification");
        }
      } catch (error) {
        let errorMessage = "Error updating notification";

        if (error.response) {
          const { status, data } = error.response;

          if (status === 404) {
            errorMessage = `Notification with ID ${notification._id} not found`;
          } else {
            errorMessage += `: ${status} - ${data.message || "Unknown error"}`;
          }

          console.error("Error updating notification:", error.response);
        } else if (error.request) {
          errorMessage += ": No response from server";
        } else {
          errorMessage += `: ${error.message}`;
        }

        setErrorMessage(errorMessage); // Update the error message state
      }
    }

    // Toggle the collapse for the notification
    setSelectedNotification((prevSelected) =>
      prevSelected === notification._id ? null : notification._id
    );
  };

  // Function to handle the deletion of a notification
  const handleDeleteClick = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const response = await axios.delete(
        `https://digital-equb-backend-new.onrender.com/api/notifications/delete/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((n) => n._id !== notificationId)
        );
        setErrorMessage(""); // Clear any previous error messages
      } else {
        setErrorMessage("Unexpected response while deleting notification");
      }
    } catch (error) {
      let errorMessage = "Error deleting notification";

      if (error.response) {
        const { status, data } = error.response;

        if (status === 404) {
          errorMessage = `Notification with ID ${notificationId} not found`;
        } else {
          errorMessage += `: ${status} - ${data.message || "Unknown error"}`;
        }

        console.error("Error deleting notification:", error.response);
      } else if (error.request) {
        errorMessage += ": No response from server";
      } else {
        errorMessage += `: ${error.message}`;
      }

      setErrorMessage(errorMessage); // Update the error message state
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">Notifications</Typography>
      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Display the notifications as cards */}
      {notifications.map((notification) => (
        <Card key={notification._id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {notification.read ? "Notification" : "New Message"}
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDetailsClick(notification)}
                  sx={{ marginRight: 2 }}
                >
                  Details
                </Button>
                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteClick(notification._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Collapse in={selectedNotification === notification._id}>
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body1">
                  <strong>Message:</strong> {notification.message}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong>{" "}
                  {new Date(notification.createdDate).toLocaleString()}
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Notifications;
