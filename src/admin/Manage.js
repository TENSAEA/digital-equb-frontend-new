import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Invite from "../user/components/Invite";
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

const Manage = () => {
  const { equbId } = useParams();
  const [equb, setEqub] = useState(null);
  const [requests, setRequests] = useState([]);
  const [areRequestsVisible, setAreRequestsVisible] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [requestStatuses, setRequestStatuses] = useState({});

  const fetchEqubDetails = useCallback(async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `https://digital-equb-backend-new.onrender.com/api/equbs/${equbId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setEqub(response.data.equb);
  }, [equbId]);

  const fetchJoinRequests = useCallback(async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    setUserRole(user.role);
    const response = await axios.get(
      `https://digital-equb-backend-new.onrender.com/api/requests/user/${equbId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newStatuses = response.data.reduce((statuses, request) => {
      statuses[request._id] = request.status;
      return statuses;
    }, {});
    setRequests(response.data);
    setRequestStatuses(newStatuses); // Add this line to set initial requestStatuses
  }, [equbId]);

  useEffect(() => {
    fetchEqubDetails();
    fetchJoinRequests();
  }, [fetchEqubDetails, fetchJoinRequests]);

  const approveRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `https://digital-equb-backend-new.onrender.com/api/requests/${requestId}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setRequestStatuses((prevStatuses) => ({
      ...prevStatuses,
      [requestId]: "approved",
    }));
    // Refresh the requests and equb details after approving a request
    fetchJoinRequests();
    fetchEqubDetails();
  };

  const rejectRequest = async (requestId) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `https://digital-equb-backend-new.onrender.com/api/requests/${requestId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setRequestStatuses((prevStatuses) => ({
      ...prevStatuses,
      [requestId]: "rejected",
    }));
    fetchJoinRequests();
    fetchEqubDetails();
  };

  if (equb === null || requests === null) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4">{equb.name}</Typography>
      <Typography variant="h6">Members:</Typography>
      <List>
        {equb.members.map((member) => (
          <ListItem key={member._id}>
            <ListItemText primary={`${member.fname} ${member.lname}`} />
          </ListItem>
        ))}
      </List>
      {<Invite inviter={userRole} />}
      {userRole === "admin" && (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAreRequestsVisible(!areRequestsVisible)}
            disabled={!requests || requests.length === 0}
          >
            {requests && requests.length > 0 ? "View Requests" : "No Requests"}
          </Button>
          <Typography variant="h6">Join Requests:</Typography>
          {areRequestsVisible && (
            <List>
              {requests.map((request) => (
                <Box
                  key={request._id}
                  sx={{
                    bgcolor: `${
                      requestStatuses[request._id] === "approved"
                        ? "success.main"
                        : requestStatuses[request._id] === "rejected"
                        ? "error.main"
                        : "background.paper"
                    }`,
                    p: 3,
                    borderRadius: 5,
                  }}
                >
                  <ListItem>
                    <ListItemText
                      primary={`Request from user with ID: ${request.senderId}`}
                      secondary={`Message: ${request.message}`}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => approveRequest(request._id)}
                      disabled={requestStatuses[request._id] !== "pending"}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => rejectRequest(request._id)}
                      disabled={requestStatuses[request._id] !== "pending"}
                    >
                      Reject
                    </Button>
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </>
      )}
    </Container>
  );
};

export default Manage;
