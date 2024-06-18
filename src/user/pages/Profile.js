import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Avatar } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
    profileImage: "",
    fname: user.fname,
    lname: user.lname,
    email: user.email,
    phone: user.phone,
    sex: user.sex,
    age: user.age,
    address: user.address,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdatePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      if (formData.newPassword !== formData.confirmNewPassword) {
        setErrorMessage("New passwords do not match");
        return;
      }
      await axios.put(
        "https://digital-equb-backend-new.onrender.com/api/users/password",
        {
          currentPassword: formData.password,
          newPassword: formData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage("Password updated successfully");
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleUpdateProfilePicture = async () => {
    try {
      const token = localStorage.getItem("token");
      const profileImageFormData = new FormData();
      profileImageFormData.append("profileImage", formData.profileImage);
      const response = await axios.put(
        "https://digital-equb-backend-new.onrender.com/api/users/profile-picture",
        profileImageFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccessMessage("Profile picture updated successfully");
      user.profileImage = response.data.user.profileImage; // Update the user's profile picture on the frontend
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://digital-equb-backend-new.onrender.com/api/users/details",
        {
          fname: formData.fname,
          lname: formData.lname,
          email: formData.email,
          phone: formData.phone,
          sex: formData.sex,
          age: formData.age,
          address: formData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Profile updated successfully");
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Avatar
          alt="Profile Picture"
          src={`https://digital-equb-backend-new.onrender.com/uploads/${user.profileImage}`}
          sx={{ width: 80, height: 80, marginBottom: 2 }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, profileImage: e.target.files[0] })
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateProfilePicture}
        >
          Update Profile Picture
        </Button>
      </Grid>
      <Grid item xs={12} md={8}>
        <form sx={{ boxShadow: 3, padding: 2 }}>
          <Typography color="error" sx={{ marginBottom: 1 }}>
            {errorMessage}
          </Typography>
          <Typography color="success" sx={{ marginBottom: 1 }}>
            {successMessage}
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Update Profile
          </Typography>
          <TextField
            label="First Name"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
          <TextField
            label="Last Name"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            fullWidth
            disabled
            sx={{ marginBottom: 1 }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
          <TextField
            label="Sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
          <TextField
            type="number"
            label="Age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateProfile}
            sx={{ marginBottom: 1 }}
          >
            Update Profile
          </Button>
        </form>
        <form sx={{ boxShadow: 1, padding: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Change Password
          </Typography>
          <TextField
            type="password"
            label="Current Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
          <TextField
            type="password"
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
          <TextField
            type="password"
            label="Confirm New Password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdatePassword}
            sx={{ marginBottom: 1 }}
          >
            Change Password
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default Profile;
