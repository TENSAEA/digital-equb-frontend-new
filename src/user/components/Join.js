import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Box, Alert } from "@mui/material";

const Join = () => {
  const { equbId } = useParams();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const handleJoinEqub = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.post(
          "https://digital-equb-backend-new.onrender.com/api/equbs/join",
          {
            equbID: equbId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage(response.data.message);
        setIsError(false); // Assuming the callback will return a success message if no errors
      } catch (error) {
        setMessage("Error recording payment");
        setIsError(false);
      }
    };

    handleJoinEqub();
  }, [equbId]);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {message && (
          <Alert
            severity={isError ? "error" : "success"}
            style={{ marginBottom: 16 }}
          >
            {message}
          </Alert>
        )}
        <Typography variant="body1">
          You are successfully joined an equb.
        </Typography>
      </Box>
    </Container>
  );
};

export default Join;
