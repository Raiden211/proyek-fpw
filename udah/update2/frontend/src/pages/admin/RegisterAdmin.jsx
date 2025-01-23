import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useLoaderData, useFetcher } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import darkTheme from "../layout/Background";

const RegisterAdmin = () => {
  const data = useLoaderData(); // Load users data
  const fetcher = useFetcher();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(
      Joi.object({
        username: Joi.string().required().messages({
          "string.empty": "Username is required",
        }),
        first_name: Joi.string().required().messages({
          "string.empty": "First name is required",
        }),
        last_name: Joi.string().required().messages({
          "string.empty": "Last name is required",
        }),
        email: Joi.string()
          .email({ tlds: { allow: false } })
          .required()
          .messages({
            "string.empty": "Email is required",
            "string.email": "Email must be a valid email address",
          }),
        password: Joi.string().min(5).required().messages({
          "string.empty": "Password is required",
          "string.min": "Password must be at least 6 characters long",
        }),
        confirm_password: Joi.string()
          .valid(Joi.ref("password"))
          .required()
          .messages({
            "any.only": "Passwords must match",
            "string.empty": "Please confirm your password",
          }),
      })
    ),
  });

  const doRegister = (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/admin/register",
    });
    reset();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#e3f2fd", // Light blue background
          p: 4,
        }}
      >
        {/* Page Title */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "black", // Ensure title is black
            mb: 4,
            textAlign: "center",
          }}
        >
          Admin Registration
        </Typography>

        {/* Form and Table Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Registration Form */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              p: 3,
              backgroundColor: "white", // White background for contrast
              borderRadius: "8px",
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: "bold", color: "black", mb: 3 }}
            >
              Register Admin
            </Typography>
            <form onSubmit={handleSubmit(doRegister)} noValidate>
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                InputProps={{
                  sx: { color: "black" }, // Text color
                }}
                InputLabelProps={{
                  sx: { color: "black" }, // Label color
                }}
                FormHelperTextProps={{
                  sx: { color: "black" }, // Helper text color
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black", // Border color
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="First Name"
                margin="normal"
                {...register("first_name")}
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                InputProps={{
                  sx: { color: "black" },
                }}
                InputLabelProps={{
                  sx: { color: "black" },
                }}
                FormHelperTextProps={{
                  sx: { color: "black" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                margin="normal"
                {...register("last_name")}
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
                InputProps={{
                  sx: { color: "black" },
                }}
                InputLabelProps={{
                  sx: { color: "black" },
                }}
                FormHelperTextProps={{
                  sx: { color: "black" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  sx: { color: "black" },
                }}
                InputLabelProps={{
                  sx: { color: "black" },
                }}
                FormHelperTextProps={{
                  sx: { color: "black" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                margin="normal"
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  sx: { color: "black" },
                }}
                InputLabelProps={{
                  sx: { color: "black" },
                }}
                FormHelperTextProps={{
                  sx: { color: "black" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                margin="normal"
                type="password"
                {...register("confirm_password")}
                error={!!errors.confirm_password}
                helperText={errors.confirm_password?.message}
                InputProps={{
                  sx: { color: "black" },
                }}
                InputLabelProps={{
                  sx: { color: "black" },
                }}
                FormHelperTextProps={{
                  sx: { color: "black" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
              >
                Register
              </Button>
            </form>
          </Paper>

          {/* Registered Users Table */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              p: 3,
              backgroundColor: "white", // White background for contrast
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: "bold", color: "black", mb: 3 }}
            >
              Registered Users
            </Typography>
            <TableContainer
              sx={{
                maxHeight: data.users.length > 5 ? "400px" : "none", // Enable scroll if more than 5 items
                overflowY: data.users.length > 5 ? "auto" : "visible",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                      Username
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                      Role
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.users.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        backgroundColor:
                          user.role === 1 ? "#c8e6c9" : "#f5f5f5", // Light green for admin, light gray for others
                      }}
                    >
                      <TableCell sx={{ color: "black" }}>{user.id}</TableCell>
                      <TableCell sx={{ color: "black" }}>
                        {user.username}
                      </TableCell>
                      <TableCell sx={{ color: "black" }}>
                        {user.role === 1 ? "Admin" : "User"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default RegisterAdmin;
