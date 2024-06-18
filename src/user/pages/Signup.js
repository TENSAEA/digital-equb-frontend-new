import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Alert,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthContext } from "../../contexts/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, acceptTerms: e.target.checked });
  };

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      return;
    }

    if (!formData.acceptTerms) {
      setMessage("You must accept the terms and policies");
      setIsError(true);
      return;
    }

    // Show loading spinner
    setLoading(true);

    try {
      const response = await axios.post(
        "https://digital-equb-backend-new.onrender.com/api/users/signup",
        {
          fname: formData.fname,
          lname: formData.lname,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        }
      );

      const { token, user } = response.data;

      // Set authentication data
      setAuthData(token, user);

      // Clear form data
      setFormData({
        fname: "",
        lname: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
      });

      setMessage(
        "Registration successful! Please check your email to verify your account."
      );
      setIsError(false);

      // Hide the spinner and redirect after a delay
      setTimeout(() => {
        setLoading(false);
        navigate("/verify"); // Redirect to the Verify component
      }, 10000);
    } catch (error) {
      setLoading(false); // Hide the spinner immediately if there's an error

      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message);
        setIsError(true);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
        setIsError(true);
      }
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Ensure it takes the full height of the screen
        position: "relative", // Required for the overlay
      }}
    >
      <Box
        component="div"
        sx={{
          boxShadow: 3,
          padding: 4,
          borderRadius: 2,
          backgroundColor: "white",
          width: "100%",
          maxWidth: "500px",
          filter: loading ? "blur(5px)" : "none", // Apply blur effect conditionally
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Register
        </Typography>

        {message && isError && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="fname"
            label="First Name"
            variant="outlined"
            value={formData.fname}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            name="lname"
            label="Last Name"
            variant="outlined"
            value={formData.lname}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            name="phone"
            label="Phone"
            variant="outlined"
            value={formData.phone}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            variant="outlined"
            type="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleToggleVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.acceptTerms}
                onChange={handleCheckboxChange}
              />
            }
            label="I accept the terms and policies"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            Register
          </Button>
        </form>

        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Box>

      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={100} />
          {message && !isError && (
            <Alert severity="success" sx={{ marginBottom: 2, marginTop: 2 }}>
              {message}
            </Alert>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Signup;
