import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Typography, Card, CardContent } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NameCard = styled(Card)({
  marginBottom: "16px",
  backgroundColor: "#f0f0f0", // Light gray background for cards
  color: "#3f51b5", // Blue color for text
  borderRadius: "8px", // Rounded corners
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
});

const BlurBackground = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 999,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const WinnerText = styled(Typography)({
  color: "#4caf50", // Green color for winner text
  fontWeight: "bold",
});

const WinnerContainer = styled("div")({
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
});

const Draw = () => {
  const { equbId } = useParams();
  const [eligibleMembers, setEligibleMembers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEligibleMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token not found");
        }

        const response = await axios.get(
          `https://digital-equb-backend-new.onrender.com/api/equb-draws/eligible-members/${equbId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEligibleMembers(response.data.eligibleMembers);
      } catch (error) {
        console.error("Error fetching eligible members:", error);
      }
    };

    fetchEligibleMembers();
  }, [equbId]);

  const handleDraw = async (e) => {
    e.preventDefault();
    try {
      setDrawing(true);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
      const winner = eligibleMembers[randomIndex];
      setWinner(winner);

      setTimeout(() => {
        setDrawing(false);
        setShowWinnerModal(true);
      }, 3000);

      const response = await axios.post(
        "https://digital-equb-backend-new.onrender.com/api/equb-draws/store-draw",
        {
          equbId,
          winnerId: winner._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Draw result stored successfully!");
      } else {
        console.error("Error storing draw result:", response.data);
      }
    } catch (error) {
      console.error("Error drawing:", error);
    }
  };

  const handleOK = () => {
    setShowWinnerModal(false);
    navigate(`/draw/${equbId}`);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Eligible Members For This Round Are:
      </Typography>
      {eligibleMembers.map((member, index) => (
        <NameCard key={index}>
          <CardContent>
            <Typography variant="body1">
              {member.fname} {member.lname}
            </Typography>
          </CardContent>
        </NameCard>
      ))}
      <Button variant="contained" onClick={handleDraw} sx={{ mt: 2 }}>
        Draw!
      </Button>
      {drawing && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Drawing...
        </Typography>
      )}
      {showWinnerModal && (
        <BlurBackground>
          <WinnerContainer>
            <WinnerText variant="h6">
              Winner: {winner.fname} {winner.lname}
            </WinnerText>
            <Typography
              variant="body1"
              sx={{ color: "#4caf50", fontWeight: "bold" }}
            >
              Success!
            </Typography>
            <Button variant="contained" onClick={handleOK} sx={{ mt: 2 }}>
              OK
            </Button>
          </WinnerContainer>
        </BlurBackground>
      )}
    </div>
  );
};

export default Draw;
