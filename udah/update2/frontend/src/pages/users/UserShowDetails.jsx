import React, { useState } from "react";
import { useLoaderData, useSubmit } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Button,
  CssBaseline,
  Alert,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import darkTheme from "../layout/Background";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

// Joi validation schema for password change
const passwordSchema = Joi.object({
  newPassword: Joi.string().min(4).required().messages({
    "string.empty": "New password is required.",
    "string.min": "New password must be at least 4 characters long.",
  }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .messages({
      "string.empty": "Confirm password is required.",
      "any.only": "Passwords do not match.",
    }),
});

const UserShowDetails = () => {
  const { details } = useLoaderData();
  const { _id, username, first_name, last_name, email, password } = details;
  const [message, setMessage] = useState({ type: "", text: "" });
  const submit = useSubmit();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(passwordSchema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("newPassword", data.newPassword);
    formData.append("confirmPassword", data.confirmPassword);

    console.log("Form Data:", {
      userId: _id,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });

    try {
      const response = await fetch(
        "http://localhost:3000/v1/users/update-password",
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${username.token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        reset(); // Reset the form
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to update password.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "80vh",
          backgroundColor: darkTheme.palette.background.default,
          color: darkTheme.palette.text.primary,
          padding: "24px",
          marginTop: "64px",
        }}
      >
        {/* User Details Card */}
        <Paper elevation={3} sx={{ padding: "16px", marginBottom: "24px" }}>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell>{_id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                  <TableCell>{username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>First Name</TableCell>
                  <TableCell>{first_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Last Name</TableCell>
                  <TableCell>{last_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell>{email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Password</TableCell>
                  <TableCell>{password}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Password Change Form */}
        <Paper elevation={3} sx={{ padding: "16px" }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Change Password
          </Typography>

          {message.text && (
            <Alert severity={message.type} sx={{ marginBottom: "16px" }}>
              {message.text}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* New Password */}
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="password"
                  label="New Password"
                  margin="normal"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                />
              )}
            />

            {/* Confirm New Password */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  margin="normal"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "16px" }}
            >
              Change Password
            </Button>
          </form>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default UserShowDetails;
