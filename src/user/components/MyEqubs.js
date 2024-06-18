import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
} from "@mui/material";

const MyEqubs = () => {
  const [createdEqubs, setCreatedEqubs] = useState([]);
  const [joinedEqubs, setJoinedEqubs] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get user object from localStorage
  const isAdmin = user?.role === "admin"; // Check if user is admin and access role property

  useEffect(() => {
    const fetchUserEqubs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        // Fetch equbs created by the user
        const createdResponse = await axios.get(
          "https://digital-equb-backend-new.onrender.com/api/equbs/user-created",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch equbs the user has joined
        const joinedResponse = await axios.get(
          "https://digital-equb-backend-new.onrender.com/api/equbs/my-equbs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCreatedEqubs(createdResponse.data.equbs);
        const user = JSON.parse(localStorage.getItem("user")); // Retrieve the user's ID from local storage
        setJoinedEqubs(
          joinedResponse.data.equbs.filter(
            (equb) => equb.admin._id !== user._id
          )
        );
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          setMessage("Error fetching user equbs");
          setIsError(true);
        }
      }
    };

    fetchUserEqubs();
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 3,
        ml: 30,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {message && (
        <Alert severity={isError ? "error" : "success"}>{message}</Alert>
      )}

      <Typography variant="h4">My Created Equbs</Typography>
      <Grid container spacing={3}>
        {createdEqubs.length > 0 ? (
          createdEqubs.map((equb) => (
            <Grid item xs={12} sm={6} md={4} key={equb._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{equb.name}</Typography>
                  <Typography variant="body2">
                    Admin: {equb.admin.fname} {equb.admin.lname}
                  </Typography>
                  <Typography variant="body2">
                    Members: {equb.members.length}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/manage/${equb._id}`)}
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mt: 2, width: "100%" }}>
              No equb created
            </Typography>
          </Grid>
        )}
      </Grid>
      {!isAdmin && (
        <>
          <Typography variant="h4" sx={{ mt: 3 }}>
            Equbs I've Joined
          </Typography>
          <Grid container spacing={3}>
            {joinedEqubs.length > 0 ? (
              joinedEqubs.map((equb) => (
                <Grid item xs={12} sm={6} md={4} key={equb._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{equb.name}</Typography>
                      <Typography variant="body2">
                        Admin: {equb.admin.fname} {equb.admin.lname}
                      </Typography>
                      <Typography variant="body2">
                        Members: {equb.members.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ mt: 2, width: "100%" }}>
                  No equb joined
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default MyEqubs;
