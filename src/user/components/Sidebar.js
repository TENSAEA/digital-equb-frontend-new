import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { Badge } from "@mui/material"; // Badge to display the notification count
import AnnouncementIcon from "@mui/icons-material/Announcement"; // Import announcement icon

import {
  Dashboard as DashboardIcon,
  AccountCircle as MyProfileIcon,
  BarChart as ReportIcon,
  SupportAgent as TicketsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Person as ProfileIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import Brightness4 from "@mui/icons-material/Brightness4";
import axios from "axios";
import { useThemeContext } from "../../contexts/ThemeProvider";
import Avatar from "@mui/material/Avatar";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const theme = useTheme();
  const { toggleTheme } = useThemeContext();
  const [open, setOpen] = React.useState(true);
  const [unreadCount, setUnreadCount] = React.useState(0); // State to hold notification count
  const navigate = useNavigate(); // To handle navigation
  const user = JSON.parse(localStorage.getItem("user")); // Get user object from localStorage
  const isAdmin = user?.role === "admin"; // Check if user is admin and access role property
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNotificationsClick = () => {
    navigate("/notifications"); // Redirect to notifications page
  };

  React.useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const token = localStorage.getItem("token"); // Authorization token
        if (!token) {
          throw new Error("Authorization token is missing");
        }

        const response = await axios.get(
          "https://digital-equb-backend-new.onrender.com/api/notifications/unread-count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUnreadCount(response.data.count); // Set the unread count
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    };

    fetchUnreadNotifications(); // Fetch unread notifications on component mount
  }, []); // No dependencies, fetches once on mount

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Digital Equb
          </Typography>
          <Box sx={{ flexGrow: 1 }} /> {/* Spacer to push icons to the right */}
          <Typography
            sx={{
              fontWeight: "bold",
              color: "white",
              marginRight: 2,
            }}
          >
            {user ? `${user.fname} ${user.lname}` : "Guest"}
          </Typography>
          <Typography
            sx={{
              fontWeight: "medium",
              color: "white",
              fontStyle: "italic",
            }}
          >
            {user.role}
          </Typography>
          <IconButton onClick={toggleTheme}>
            <Brightness4 />
          </IconButton>
          <IconButton onClick={handleNotificationsClick}>
            {" "}
            {/* Redirects to /notifications */}
            <Badge badgeContent={unreadCount} color="secondary">
              {" "}
              {/* Shows notification count */}
              <NotificationsIcon /> {/* Icon for notifications */}
            </Badge>
          </IconButton>
          <IconButton>
            {user.profileImage ? (
              <Avatar
                src={`https://digital-equb-backend-new.onrender.com/uploads/${user.profileImage}`}
                alt={`${user.fname} ${user.lname}`}
              />
            ) : (
              <ProfileIcon /> // Default icon if no profile image is available
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to="/home">
              {" "}
              {/* Navigate to /home */}
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to="/profile">
              {" "}
              {/* Navigate to /profile */}
              <ListItemIcon>
                <MyProfileIcon />
              </ListItemIcon>
              <ListItemText
                primary="My Profile"
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to="/reports">
              {" "}
              {/* Navigate to /reports */}
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          {!isAdmin && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/tickets">
                {" "}
                {/* Navigate to /tickets */}
                <ListItemIcon>
                  <TicketsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Tickets"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          )}
          {isAdmin && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/announcement">
                <ListItemIcon>
                  <AnnouncementIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Announcement"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to="/logout">
              {" "}
              {/* Navigate to /logout */}
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader /> {/* Ensures content aligns with the drawer */}
        {/* Main content goes here */}
      </Box>
    </Box>
  );
}
