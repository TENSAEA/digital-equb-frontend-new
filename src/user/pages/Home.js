import React, { useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { Routes, Route, useNavigate } from "react-router-dom"; // Corrected import
import Sidebar from "../components/Sidebar";
import Box from "@mui/material/Box";
import DashboardContent from "./DashboardContent"; // Import your Dashboard content component
import MyEqub from "./MyEqub"; // Import other components
import HolidayLottery from "./HolidayLottery"; // ...
import LiveChatSupport from "./LiveChatSupport";
import Payment from "./Payment";
import Faq from "./Faq";
import AvailableEqubs from "../components/AvailableEqubs";
import EqubDetails from "../components/EqubDetails"; // Importing EqubDetails
import JoinEqub from "../components/JoinEqub"; // Importing JoinEqub
import Draw from "./Draw";
import UserCreatedEqubs from "./UserCreatedEqubs";
import Invite from "../components/Invite";
import Notification from "./Notification";
import Chat from "./Chat";
import Ticket from "./Ticket";
import Profile from "./Profile";
import EqubGroupChat from "./EqubGroupChat";
import Report from "./Report";
import PaymentSuccess from "./PaymentSuccess";
import Join from "../components/Join";
import Manage from "../../admin/Manage";
import BuySell from "./equbBuySell";
import SupportCard from "../../admin/SupportCard";
import Announcement from "./Announcment";
const Home = () => {
  const { auth, clearAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        await axios.get(
          "https://digital-equb-backend-new.onrender.com/api/home",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`, // Pass the JWT token
            },
          }
        );
      } catch (error) {
        clearAuthData(); // Clear authentication data on unauthorized access
        navigate("/login"); // Redirect to login if unauthorized
      }
    };

    fetchHomeData(); // Fetch data when the component mounts
  }, [auth.token, navigate, clearAuthData]);

  return (
    <div>
      <Sidebar user={auth.user} />
      <Box component="main" sx={{ flexGrow: 1, padding: 3, ml: 30 }}>
        <Routes>
          {" "}
          {/* Define the routes for each component */}
          <Route path="/home" element={<DashboardContent />} />{" "}
          {/* Dashboard */}
          <Route path="/myequb" element={<MyEqub />} /> {/* My Equb */}
          <Route path="/available-equbs" element={<AvailableEqubs />} />{" "}
          {/* Route for available equbs */}
          <Route path="/equb-details/:id" element={<EqubDetails />} />{" "}
          {/* Route for equb details */}
          <Route
            path="/join-equb/:id"
            element={<JoinEqub user={auth.user} />}
          />{" "}
          <Route path="/announcement" element={<Announcement />} />
          {/* Route for joining equb */}
          <Route path="/holidaylottery" element={<HolidayLottery />} />{" "}
          {/* Holiday Lottery */}
          <Route path="/livechatsupport" element={<LiveChatSupport />} />{" "}
          <Route path="/supportcard" element={<SupportCard />} />
          {""}
          {/* Live Chat Support */}
          <Route path="/payment/:equbId" element={<Payment />} />{" "}
          {/* Payment */}
          <Route
            path="/user-created-equbs"
            element={<UserCreatedEqubs />}
          />{" "}
          {/* Correct path */}
          <Route path="/draw/:equbId" element={<Draw />} /> {/* Draw */}
          <Route path="/faq" element={<Faq />} /> {/* FAQ */}
          <Route
            path="/invite/:equbId"
            element={<Invite inviter={auth.user} />}
          />{" "}
          {/* invite members to join the equb */}
          <Route path="/notifications" element={<Notification />} />
          <Route path="/chat/:equbId" element={<Chat />} />
          <Route path="/equb-group-chat" element={<EqubGroupChat />} />
          <Route path="/tickets" element={<Ticket user={auth.user} />} />
          <Route path="/profile" element={<Profile user={auth.user} />} />
          <Route path="/reports" element={<Report user={auth.user} />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/join/:equbId" element={<Join />} />
          <Route path="/equb/buy-sell" element={<BuySell />} />
          <Route path="/manage/:equbId" element={<Manage />} />
        </Routes>
      </Box>
    </div>
  );
};

export default Home;
