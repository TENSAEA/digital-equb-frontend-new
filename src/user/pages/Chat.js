import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Paper,
} from "@mui/material";

const Chat = () => {
  const { equbId } = useParams();
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Parse the user object from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchMembers = async () => {
      if (!userId) {
        console.error("User ID is not defined");
        return;
      }

      try {
        const response = await axios.get(
          `https://digital-equb-backend-new.onrender.com/api/equbs/${equbId}/members`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMembers(response.data.members);
      } catch (error) {
        console.error("Error fetching equb members:", error);
      }
    };

    fetchMembers();
  }, [equbId, userId]);

  useEffect(() => {
    let intervalId;

    const fetchChatHistory = async () => {
      if (!selectedUser || !userId) {
        console.error("User ID or selected user is not defined");
        return;
      }

      try {
        const response = await axios.get(
          `https://digital-equb-backend-new.onrender.com/api/chat/${userId}/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setChatHistory(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (selectedUser) {
      fetchChatHistory(); // Initial fetch
      intervalId = setInterval(fetchChatHistory, 1000); // Polling every second
    }

    return () => clearInterval(intervalId); // Clear interval on component unmount or when selectedUser changes
  }, [selectedUser, userId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedUser) return;

    if (!userId) {
      console.error("User ID is not defined");
      return;
    }

    try {
      const response = await axios.post(
        "https://digital-equb-backend-new.onrender.com/api/chat/create",
        {
          senderId: userId,
          receiverId: selectedUser._id,
          message: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setChatHistory([...chatHistory, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h2" gutterBottom>
        Chat
      </Typography>
      <Box display="flex" gap={2}>
        <Box width="30%">
          <TextField
            label="Search members"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            sx={{ marginBottom: 2 }}
          />
          <List component={Paper}>
            {members
              .filter(
                (member) =>
                  member.fname
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  `${member.fname} ${member.lname}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((member) => (
                <ListItem
                  button
                  key={member._id}
                  onClick={() => handleUserClick(member)}
                >
                  <ListItemText primary={`${member.fname} ${member.lname}`} />
                </ListItem>
              ))}
          </List>
        </Box>
        {selectedUser && (
          <Box width="70%">
            <Typography variant="h5" component="h3" gutterBottom>
              Chat with {selectedUser.fname} {selectedUser.lname}
            </Typography>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                marginBottom: 2,
                maxHeight: "60vh",
                overflow: "auto",
              }}
            >
              {chatHistory.map((chat) => (
                <Box
                  key={chat._id}
                  mb={2}
                  sx={{
                    textAlign: chat.senderId === userId ? "right" : "left",
                    width: "100%",
                    display: "flex",
                    justifyContent:
                      chat.senderId === userId ? "flex-end" : "flex-start",
                  }}
                >
                  <Typography
                    variant="body1"
                    component="p"
                    sx={{
                      backgroundColor:
                        chat.senderId === userId ? "#e1ffc7" : "#f1f0f0",
                      padding: 1,
                      borderRadius: 1,
                    }}
                  >
                    {chat.message}
                  </Typography>
                </Box>
              ))}
            </Paper>
            <TextField
              label="Type a message"
              variant="outlined"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Chat;
