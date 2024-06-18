import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
} from "@mui/material";
import {
  Groups as MyEqubIcon,
  Forum as CustomerForumIcon,
  Celebration as HolidayLotteryIcon,
  HelpOutline as SupportIcon,
  Chat as LiveChatSupportIcon,
  Payment as PaymentIcon,
  Casino as DrawIcon,
  HelpOutline as FaqIcon,
} from "@mui/icons-material";
import LiveChatSupport from "./LiveChatSupport"; // Import the LiveChatSupport component
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const DashboardContent = () => {
  const navigate = useNavigate();
  const [equbs, setEqubs] = useState([]);
  const [adminEqubs, setAdminEqubs] = useState([]);
  const [holidayLotteries, setHolidayLotteries] = useState([]);
  const [equbData, setEqubData] = useState([]); // State for chart data
  const user = JSON.parse(localStorage.getItem("user")); // Get user object from localStorage
  const isAdmin = user?.role === "admin"; // Check if user is admin and access role property
  useEffect(() => {
    const fetchEqubs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://digital-equb-backend-new.onrender.com/api/equbs/user-created",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEqubs(response.data.equbs);
      } catch (error) {
        console.error("Error fetching user-created equbs", error);
      }
    };

    const fetchAdminEqubs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://digital-equb-backend-new.onrender.com/api/equbs/available-equbs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAdminEqubs(response.data.equbs);
      } catch (error) {
        console.error("Error fetching admin-created equbs", error);
      }
    };

    const fetchHolidayLotteries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://digital-equb-backend-new.onrender.com/api/holiday-lotteries",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHolidayLotteries(response.data);
      } catch (error) {
        console.error("Error fetching holiday lotteries", error);
      }
    };

    fetchEqubs();
    fetchAdminEqubs();
    fetchHolidayLotteries();
  }, []);

  const fetchEqubDataForChart = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch data for user-created equbs
      const userEqubsResponse = await axios.get(
        "https://digital-equb-backend-new.onrender.com/api/equbs/user-created",
        { headers }
      );
      const userCreatedCount = userEqubsResponse.data.equbs.length;

      // Fetch data for admin-created equbs
      const adminEqubsResponse = await axios.get(
        "https://digital-equb-backend-new.onrender.com/api/equbs/available-equbs",
        { headers }
      );
      const adminCreatedCount = adminEqubsResponse.data.equbs.length;

      // Fetch data for holiday lotteries
      const holidayLotteriesResponse = await axios.get(
        "https://digital-equb-backend-new.onrender.com/api/holiday-lotteries",
        { headers }
      );
      const holidayLotteryCount = holidayLotteriesResponse.data.length;

      // Combine the data into a format suitable for the chart
      const chartData = [
        {
          month: new Date().toLocaleString("default", { month: "long" }), // Current month
          userCreated: userCreatedCount,
          adminCreated: adminCreatedCount,
          holidayLottery: holidayLotteryCount,
        },
        // Add more data points for other months if necessary
      ];

      setEqubData(chartData);
    } catch (error) {
      console.error("Error fetching data for chart", error);
    }
  };

  // Call this function in your useEffect if isAdmin is true
  useEffect(() => {
    if (isAdmin) {
      fetchEqubDataForChart();
    }
  }, [isAdmin]);

  const handleCardClick = (route) => {
    navigate(route);
  };

  const handleOpen = () => {
    navigate("/supportcard");
  };

  const cardStyles = {
    "&:hover": {
      boxShadow: 6,
      backgroundColor: "#e0f7fa",
    },
    transition: "0.3s",
  };

  return (
    <div>
      {isAdmin && (
        <>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Dashboard Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ backgroundColor: "#e0f7fa", p: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  User Created Equbs:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                  {equbs?.length || 0}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ backgroundColor: "#e0f7fa", p: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Admin Created Equbs:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                  {adminEqubs?.length || 0}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ backgroundColor: "#e0f7fa", p: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Holiday Lotteries:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                  {holidayLotteries?.length || 0}
                </Typography>
              </Card>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Equb Growth Analysis
            </Typography>
            <LineChart width={600} height={300} data={equbData}>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="userCreated"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="adminCreated" stroke="#82ca9d" />
              <Line type="monotone" dataKey="holidayLottery" stroke="#ffc658" />
            </LineChart>
          </Box>
        </>
      )}

      {isAdmin && (
        <>
          <br />
          <br />
          <br />
          <hr />
        </>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <CardActionArea onClick={() => handleCardClick("/myequb")}>
            <Card sx={cardStyles}>
              <CardContent>
                <MyEqubIcon fontSize="large" sx={{ color: "#1e88e5" }} />
                <Typography variant="subtitle1" sx={{ color: "#1e88e5" }}>
                  My Equb
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CardActionArea onClick={() => handleCardClick("/holidaylottery")}>
            <Card sx={cardStyles}>
              <CardContent>
                <HolidayLotteryIcon
                  fontSize="large"
                  sx={{ color: "#7b1fa2" }}
                />
                <Typography variant="subtitle1" sx={{ color: "#7b1fa2" }}>
                  Holiday Lottery
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>
        {/* Hide Group Chat card for admin */}
        {!isAdmin && (
          <Grid item xs={12} sm={6} md={4}>
            <CardActionArea onClick={() => handleCardClick("/equb-group-chat")}>
              <Card sx={cardStyles}>
                <CardContent>
                  <LiveChatSupportIcon
                    fontSize="large"
                    sx={{ color: "#388e3c" }}
                  />
                  <Typography variant="subtitle1" sx={{ color: "#388e3c" }}>
                    Group Chat
                  </Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid>
        )}

        {/* Hide Payment card for admin */}
        {!isAdmin && (
          <Grid item xs={12} sm={6} md={4}>
            <CardActionArea onClick={() => handleCardClick("/payment/:equbId")}>
              <Card
                sx={{
                  ...cardStyles,
                  "&:hover": { backgroundColor: "#b2dfdb" },
                }}
              >
                <CardContent>
                  <PaymentIcon fontSize="large" sx={{ color: "#009688" }} />
                  <Typography variant="subtitle1" sx={{ color: "#009688" }}>
                    Payment
                  </Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={4}>
          <CardActionArea
            onClick={() => handleCardClick("/user-created-equbs")}
          >
            <Card
              sx={{ ...cardStyles, "&:hover": { backgroundColor: "#ffebee" } }}
            >
              <CardContent>
                <DrawIcon fontSize="large" sx={{ color: "#d32f2f" }} />
                <Typography variant="subtitle1" sx={{ color: "#d32f2f" }}>
                  Draw
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>
        {isAdmin && (
          <Grid item xs={12} sm={6} md={4}>
            <CardActionArea onClick={handleOpen}>
              <Card>
                <CardContent>
                  <SupportIcon fontSize="large" />
                  <Typography variant="subtitle1">Support</Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid>
        )}

        {/* Hide FAQ card for admin */}
        {!isAdmin && (
          <Grid item xs={12} sm={6} md={4}>
            <CardActionArea onClick={() => handleCardClick("/faq")}>
              <Card sx={cardStyles}>
                <CardContent>
                  <FaqIcon fontSize="large" sx={{ color: "#ff5722" }} />
                  <Typography variant="subtitle1" sx={{ color: "#ff5722" }}>
                    FAQ
                  </Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid>
        )}
      </Grid>
      <LiveChatSupport />
    </div>
  );
};

export default DashboardContent;
