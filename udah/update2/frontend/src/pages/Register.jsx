import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigate, Link, useFetcher } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  createTheme,
  CssBaseline,
  Checkbox,
  FormControlLabel,
  Avatar,
  Grid,
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import logo from "../assets/toserba.jpg"; // Replace with your logo path

const Register = () => {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const schema = Joi.object({
    username: Joi.string().min(4).required().messages({
      "string.empty": "Username is required",
      "string.min": "Min 4 panjangnya",
    }),
    first_name: Joi.string().min(4).required().messages({
      "string.empty": "First name is required",
      "string.min": "Min 4 panjangnya",
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
    password: Joi.string().min(4).required().messages({
      "string.empty": "Password is required",
      "string.min": "Min 4 panjangnya",
    }),
    confirm_password: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "string.empty": "Confirm Password is required",
        "any.only": "Confirm password harus sama dengan password",
      }),
    terms: Joi.boolean().valid(true).required().messages({
      "any.only": "You must agree to the terms and conditions",
    }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  // Use the light theme from the Login page
  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1092C5", // Blue color for primary elements
      },
      secondary: {
        main: "#f58925", // Orange color for accents
      },
      background: {
        default: "#b6e7fc", // Light blue background for the entire page
        paper: "#f9f9f9", // Slightly off-white background for the paper component
      },
      text: {
        primary: "#000000", // Black text for primary content
        secondary: "#4f4f4f", // Dark gray text for secondary content
      },
    },
  });

  const doRegister = (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/register",
    });
    reset();
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "background.default", // Light blue background
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 2, md: 3 }, // Reduced padding for a smaller box
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
            width: "100%",
            backgroundColor: "background.paper", // Off-white background for the paper
            borderRadius: 2,
          }}
        >
          {/* Logo and Title */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Avatar
              src={logo}
              alt="Toko Pandan Sari Logo"
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Toko Pandan Sari
            </Typography>
            <Typography
              variant="h6"
              component="h2"
              sx={{ color: "text.secondary" }}
            >
              Create Your Account
            </Typography>
          </Box>

          {/* Registration Form */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              Register
            </Typography>
            <form onSubmit={handleSubmit(doRegister)} noValidate>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  {...register("first_name")}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  {...register("last_name")}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type="password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  variant="outlined"
                  type="password"
                  {...register("confirm_password")}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                />
              </Box>
              <Box mb={2}>
                <FormControlLabel
                  control={<Checkbox {...register("terms")} color="primary" />}
                  label="I agree to the terms and conditions"
                />
                {errors.terms && (
                  <Typography variant="body2" color="error">
                    {errors.terms.message}
                  </Typography>
                )}
              </Box>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: 2, py: 1.5 }}
              >
                Register
              </Button>
            </form>
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Have an account?{" "}
                <Link
                  to="/Login"
                  style={{ color: "#1092C5", textDecoration: "none" }}
                >
                  Login
                </Link>
              </Typography>
              <Typography variant="body2" mt={1}>
                <Link
                  to="/"
                  style={{ color: "#1092C5", textDecoration: "none" }}
                >
                  Back to Home
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
