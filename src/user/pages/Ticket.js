import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
  Button,
  TextField,
} from "@mui/material";
import {
  Delete,
  Edit,
  CheckCircleOutline,
  Reply,
  Add,
} from "@mui/icons-material";

const Ticket = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    title: "",
    description: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editTicketId, setEditTicketId] = useState(null);
  const [additionalDescription, setAdditionalDescription] = useState("");

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://digital-equb-backend-new.onrender.com/api/tickets/user/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching user tickets:", error);
      }
    };

    fetchUserTickets();
  }, [user]);

  const [expandedTicketId, setExpandedTicketId] = useState("");

  const handleExpand = (ticketId) => {
    setExpandedTicketId(expandedTicketId === ticketId ? "" : ticketId);
  };

  const handleDelete = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://digital-equb-backend-new.onrender.com/api/tickets/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const handleResolve = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://digital-equb-backend-new.onrender.com/api/tickets/${ticketId}/update-status`,
        { status: "Resolved" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedTickets = tickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, status: "Resolved" } : ticket
      );
      setTickets(updatedTickets);
    } catch (error) {
      console.error("Error resolving ticket:", error);
    }
  };

  const handleCreateTicket = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://digital-equb-backend-new.onrender.com/api/tickets/create",
        {
          title: newTicketData.title,
          description: newTicketData.description,
          createdBy: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTickets([...tickets, response.data]);
      setNewTicketData({ title: "", description: "" });
      setSuccessMessage("Ticket created successfully");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating ticket:", error);
      setErrorMessage("Failed to create ticket. Please try again.");
      setSuccessMessage("");
    }
  };

  const handleEdit = (ticketId) => {
    setEditTicketId(ticketId);
  };

  const handleAdditionalDescriptionChange = (event) => {
    setAdditionalDescription(event.target.value);
  };

  const handleSaveAdditionalDescription = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://digital-equb-backend-new.onrender.com/api/tickets/${ticketId}/update-additional-description`,
        {
          additionalDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh tickets data after successful save
      const response = await axios.get(
        `https://digital-equb-backend-new.onrender.com/api/tickets/user/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTickets(response.data);
      setEditTicketId(null);
      setAdditionalDescription("");
    } catch (error) {
      console.error("Error updating additional description:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4">Tickets</Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">My Tickets</Typography>
        <IconButton onClick={() => setShowCreateForm(!showCreateForm)}>
          <Add />
        </IconButton>
      </Box>
      {showCreateForm && (
        <Box mb={2}>
          <TextField
            label="Title"
            value={newTicketData.title}
            onChange={(e) =>
              setNewTicketData({ ...newTicketData, title: e.target.value })
            }
            fullWidth
            mb={1}
          />
          <TextField
            label="Description"
            value={newTicketData.description}
            onChange={(e) =>
              setNewTicketData({
                ...newTicketData,
                description: e.target.value,
              })
            }
            fullWidth
            multiline
            rows={4}
            mb={1}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTicket}
          >
            Create
          </Button>
          {errorMessage && (
            <Typography variant="body1" color="error">
              {errorMessage}
            </Typography>
          )}
          {successMessage && (
            <Typography variant="body1">{successMessage}</Typography>
          )}
        </Box>
      )}
      <List>
        {tickets &&
          tickets.map((ticket) => (
            <div key={ticket._id}>
              <ListItem button onClick={() => handleExpand(ticket._id)}>
                <ListItemText
                  primary={ticket.title}
                  secondary={`Status: ${ticket.status}`}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleDelete(ticket._id)}>
                    <Delete />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(ticket._id)}>
                    <Edit />
                  </IconButton>
                  {ticket.status !== "Resolved" && (
                    <IconButton onClick={() => handleResolve(ticket._id)}>
                      <CheckCircleOutline />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              <Collapse
                in={expandedTicketId === ticket._id}
                timeout="auto"
                unmountOnExit
              >
                <Box ml={2}>
                  <Typography variant="subtitle1" color="error">
                    Description:
                  </Typography>
                  <Typography color="error">{ticket.description}</Typography>
                  {ticket.additionalDescriptions &&
                    ticket.additionalDescriptions.map((desc, index) => (
                      <React.Fragment key={index}>
                        <Typography variant="subtitle1" color="error">
                          Additional Description:
                        </Typography>
                        <Typography color="error">
                          {desc.description}
                        </Typography>
                      </React.Fragment>
                    ))}
                  {editTicketId === ticket._id && (
                    <>
                      <TextField
                        label="Additional Description"
                        value={additionalDescription}
                        onChange={handleAdditionalDescriptionChange}
                        fullWidth
                        multiline
                        rows={4}
                        mb={1}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleSaveAdditionalDescription(ticket._id)
                        }
                      >
                        Save
                      </Button>
                    </>
                  )}
                  {editTicketId === ticket._id && (
                    <Button variant="outlined" startIcon={<Reply />}>
                      Add Message
                    </Button>
                  )}
                </Box>
              </Collapse>
            </div>
          ))}
      </List>
    </Box>
  );
};

export default Ticket;
