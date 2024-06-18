import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { ReactTyped } from "react-typed";
import { styled } from "@mui/system";
import logo from "../../asset/logo.png";

const drawerWidth = 240;
const navItems = ["Home", "How It Works", "Features", "Sign Up", "Login"];

const FadeInTypography = styled(Typography)({
  animation: "fadeIn 2s ease-in",
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

const OuterHome = (props) => {
  const [activeItem, setActiveItem] = useState("");
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const homeRef = useRef(null);
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleNavItemClick = (item) => {
    setActiveItem(item);

    switch (item) {
      case "Home":
        homeRef.current.scrollIntoView({ behavior: "smooth" });
        break;
      case "How It Works":
        howItWorksRef.current.scrollIntoView({ behavior: "smooth" });
        break;
      case "Features":
        featuresRef.current.scrollIntoView({ behavior: "smooth" });
        break;
      case "Sign Up":
        navigate("/signup");
        break;
      case "Login":
        navigate("/login");
        break;
      default:
        break;
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Digital Equb
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => handleNavItemClick(item)}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? window().document.body : undefined;

  const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
    textAlign: "center",
    transition: "color 0.3s ease",
    color: active ? "yellow" : "white",
    display: "flex",
  }));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          position: "sticky",
          backgroundColor: "#082543",
          padding: "10px",
          borderRadius: "20px",
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Toolbar sx={{ color: "white" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              fontFamily: "initial",
            }}
          >
            <img
              src={logo}
              alt="Digital Equb Logo"
              style={{ maxWidth: "100px", height: "auto", marginRight: "16px" }}
            />
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <List sx={{ display: "flex", flexDirection: "row", padding: 0 }}>
              {navItems.map((item) => (
                <ListItem key={item} disablePadding sx={{ width: "auto" }}>
                  <StyledListItemButton
                    active={activeItem === item}
                    onClick={() => handleNavItemClick(item)}
                  >
                    <ListItemText primary={item} />
                  </StyledListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              fontFamily: "initial",
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      <Box component="main" sx={{ p: 3, flexGrow: 1, fontFamily: "initial" }}>
        {/* Home section */}
        <Box
          ref={homeRef}
          sx={{
            height: "87vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            fontFamily: "initial",
            marginTop: "50px",
          }}
        >
          <Typography
            variant="h3"
            sx={{ mb: 2, fontFamily: "initial", color: "#082543" }}
          >
            <ReactTyped
              strings={[
                "Welcome to Digital Equb",
                "Make your life better",
                "By saving Digitally",
              ]}
              typeSpeed={80}
              loop
              backSpeed={20}
              cursorChar=">"
              showCursor={true}
            />{" "}
          </Typography>
          <FadeInTypography
            variant="h5"
            sx={{ mb: 2, fontFamily: "initial", color: "blue" }}
          >
            Join a modernized version of traditional equbs. Create, join, or
            manage equbs with ease.
          </FadeInTypography>
          <FadeInTypography
            variant="h5"
            sx={{ mb: 2, fontFamily: "initial", color: "#1E90FF" }}
          >
            Discover the power of collaborative savings and financial
            empowerment.
          </FadeInTypography>
          <FadeInTypography
            variant="h5"
            sx={{ fontFamily: "initial", color: "#9370DB" }}
          >
            Start your journey today and unlock a world of possibilities.
          </FadeInTypography>
        </Box>

        {/* How It Works section */}
        <Box
          ref={howItWorksRef}
          sx={{ mt: 5, height: "100vh", fontFamily: "initial" }}
        >
          <Typography
            variant="h3"
            sx={{ textAlign: "center", marginBottom: 3, fontFamily: "initial" }}
          >
            How It Works
          </Typography>
          <Paper
            sx={{
              padding: 3,
              margin: "auto",
              maxWidth: 800,
              fontFamily: "initial",
              boxShadow: "0px 4px 20px black",
            }}
          >
            {/* Step-by-step explanation */}
            <FadeInTypography
              sx={{
                fontWeight: "bold",
                fontSize: "1.5em",
                marginBottom: 2,
                fontFamily: "initial",
              }}
            >
              Step 1: Create or Join an Equb
            </FadeInTypography>
            <Typography sx={{ marginBottom: 2, fontFamily: "initial" }}>
              Create your own equb and invite others to join, or search for
              existing equbs to participate in.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <FadeInTypography
              sx={{
                fontWeight: "bold",
                fontSize: "1.5em",
                marginBottom: 2,
                fontFamily: "initial",
              }}
            >
              Step 2: Contribute Regularly
            </FadeInTypography>
            <Typography sx={{ marginBottom: 2, fontFamily: "initial" }}>
              Contribute the agreed-upon amount at regular intervals.
              Contributions are collected into a common pool.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <FadeInTypography
              sx={{
                fontWeight: "bold",
                fontSize: "1.5em",
                marginBottom: 2,
                fontFamily: "initial",
              }}
            >
              Step 3: Take Turns Receiving the Pool
            </FadeInTypography>
            <Typography sx={{ marginBottom: 2, fontFamily: "initial" }}>
              Based on a predetermined schedule, members take turns receiving
              the entire pool. This continues until everyone has received their
              share.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <FadeInTypography
              sx={{
                fontWeight: "bold",
                fontSize: "1.5em",
                marginBottom: 2,
                fontFamily: "initial",
              }}
            >
              Step 4: Complete the Cycle
            </FadeInTypography>
            <Typography sx={{ marginBottom: 2, fontFamily: "initial" }}>
              Once the cycle is complete, you can start a new equb or continue
              with the existing group for another round.
            </Typography>
          </Paper>
        </Box>

        {/* Features section */}
        <Box
          ref={featuresRef}
          sx={{ mt: 30, mb: 50, height: "80vh", fontFamily: "initial" }}
        >
          <Typography
            variant="h3"
            sx={{ textAlign: "center", marginBottom: 3, fontFamily: "initial" }}
          >
            Features
          </Typography>

          <Paper
            sx={{
              padding: 3,
              maxWidth: 1000,
              margin: "auto",
              fontFamily: "initial",
              boxShadow: "0px 4px 20px black",
            }}
          >
            <FadeInTypography
              variant="h6"
              sx={{
                color: "#4CAF50",
                fontWeight: "bold",
                fontFamily: "initial",
              }}
            >
              Secure Transactions
            </FadeInTypography>
            <Typography variant="body1" sx={{ fontFamily: "initial" }}>
              Our platform uses advanced encryption to ensure that all
              transactions are secure and your data is protected.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <FadeInTypography
              variant="h6"
              sx={{
                color: "#2196F3",
                fontWeight: "bold",
                fontFamily: "initial",
              }}
            >
              Easy Equb Management
            </FadeInTypography>
            <Typography variant="body1" sx={{ fontFamily: "initial" }}>
              Manage your equbs with ease through an intuitive interface.
              Create, edit, or delete equbs with just a few clicks.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <FadeInTypography
              variant="h6"
              sx={{
                color: "#FF9800",
                fontWeight: "bold",
                fontFamily: "initial",
              }}
            >
              Transparent Records
            </FadeInTypography>
            <Typography variant="body1" sx={{ fontFamily: "initial" }}>
              View all contributions and payouts in real-time. Our system keeps
              detailed records to ensure complete transparency.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <FadeInTypography
              variant="h6"
              sx={{
                color: "#9C27B0",
                fontWeight: "bold",
                fontFamily: "initial",
              }}
            >
              Customizable Equbs
            </FadeInTypography>
            <Typography variant="body1" sx={{ fontFamily: "initial" }}>
              Create equbs tailored to your needs. Adjust frequency,
              contribution amounts, and more to fit your preferences.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <FadeInTypography
              variant="h6"
              sx={{
                color: "#F44336",
                fontWeight: "bold",
                fontFamily: "initial",
              }}
            >
              Live Chat Support
            </FadeInTypography>
            <Typography variant="body1" sx={{ fontFamily: "initial" }}>
              Get instant help with our live chat support. Our team is ready to
              assist you with any questions or issues you may have.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <FadeInTypography
              variant="h6"
              sx={{
                color: "#3F51B5",
                fontWeight: "bold",
                fontFamily: "initial",
              }}
            >
              Tickets Support
            </FadeInTypography>
            <Typography variant="body1" sx={{ fontFamily: "initial" }}>
              Submit support tickets for more complex issues. Our team will
              respond quickly to resolve any problems.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="contained"
              color="primary"
              sx={{ fontFamily: "initial" }}
              onClick={() => navigate("/signup")}
            >
              Let us get started
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* Footer section */}
      <Box
        component="footer"
        sx={{
          mt: "auto",
          p: 3,
          backgroundColor: "#082543",
          fontFamily: "initial",
          borderRadius: "20px",
          width: "90%",
          margin: "auto",
        }}
      >
        <Typography
          variant="body2"
          sx={{ textAlign: "center", fontFamily: "initial", color: "white" }}
        >
          &copy; 2024 Digital Equb. All rights reserved.
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", fontFamily: "initial", color: "white" }}
        >
          Contact: info@digitalequb.com | Terms of Service | Privacy Policy
        </Typography>
      </Box>
    </Box>
  );
};

export default OuterHome;
