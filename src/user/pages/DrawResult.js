import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";

const DrawResult = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrawResult = async () => {
      try {
        const response = await axios.get(
          `https://digital-equb-backend-new.onrender.com/api//equb-draws/draw/${id}/result`
        );
        setResult(response.data);
      } catch (err) {
        setError("Error fetching draw result");
      } finally {
        setLoading(false);
      }
    };

    fetchDrawResult();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">Draw Result</Typography>
      {result ? (
        <Box>
          <Typography variant="h6">Equb Name: {result.equb.name}</Typography>
          <Typography variant="body1">
            Draw Date: {new Date(result.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">Winner: {result.winner.name}</Typography>
          {/* Add more fields as necessary */}
        </Box>
      ) : (
        <Typography>No result found</Typography>
      )}
    </Box>
  );
};

export default DrawResult;
