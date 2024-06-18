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
import { Edit, Reply } from "@mui/icons-material";

const SupportCard = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  const [editTicketId, setEditTicketId] = useState(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://digital-equb-backend-new.onrender.com/api/tickets/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data); // Add this line
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching user tickets:", error);
      }
    };

    fetchUserTickets();
  }, []); // Add this line

  const [expandedTicketId, setExpandedTicketId] = useState("");

  const handleExpand = (ticketId) => {
    setExpandedTicketId(expandedTicketId === ticketId ? "" : ticketId);
  };

  const handleEdit = (ticketId) => {
    setEditTicketId(ticketId);
  };

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleSaveAnswer = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `https://digital-equb-backend-new.onrender.com/api/tickets/${ticketId}/reply`,
        {
          answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedTicket = response.data;
      setTickets(
        tickets.map((ticket) =>
          ticket._id === ticketId ? updatedTicket : ticket
        )
      );
      setEditTicketId(null);
      setAnswer("");
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
      </Box>
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
                  <IconButton onClick={() => handleEdit(ticket._id)}>
                    <Edit />
                  </IconButton>
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
                        label="Provide an answer"
                        value={answer}
                        onChange={handleAnswerChange}
                        fullWidth
                        multiline
                        rows={4}
                        mb={1}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveAnswer(ticket._id)}
                      >
                        Save
                      </Button>
                    </>
                  )}
                  {editTicketId === ticket._id && (
                    <Button variant="outlined" startIcon={<Reply />}>
                      Add Answer
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

export default SupportCard;
