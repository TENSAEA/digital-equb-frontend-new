import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from "@mui/material";

const EqubGroupChat = () => {
  const [equbs, setEqubs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEqubs = async () => {
      try {
        const response = await axios.get(
          "https://digital-equb-backend-new.onrender.com/api/equbs/my-equbs",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEqubs(response.data.equbs);
      } catch (error) {
        console.error("Error fetching user equbs:", error);
      }
    };

    fetchUserEqubs();
  }, []);

  const handleChatRedirect = (equbId) => {
    navigate(`/chat/${equbId}`);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h2" gutterBottom>
        Your Equbs
      </Typography>
      <List>
        {equbs.map((equb) => (
          <ListItem
            key={equb._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ListItemText primary={equb.name} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleChatRedirect(equb._id)}
            >
              Group Chat
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default EqubGroupChat;
