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
  Grid,
  Avatar,
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { useEffect } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"; // Icon for the login form
import logo from "../assets/toserba.jpg"; // Replace with your logo path
import { useDispatch } from "react-redux"; // Import useDispatch
import { setUser } from "../store/userSlice"; // Import the setUser action
const Login = () => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const dispatch = useDispatch();
  const schema = Joi.object({
    username: Joi.string().required().messages({
      "string.empty": "Username is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1092C5",
      },
      secondary: {
        main: "#f58925", // orange color for accents
      },
      background: {
        default: "#b6e7fc", // light blue background for the entire page
        paper: "#f9f9f9", // Slightly off-white background for the paper component
      },
      text: {
        primary: "#000000", // Black text for primary content
        secondary: "#4f4f4f", // Dark gray text for secondary content
      },
    },
  });

  const onSubmit = (data) => {
    dispatch(setUser(data.username));
    fetcher.submit(data, {
      method: "post",
      action: "/login",
    });
  };

  useEffect(() => {
    if (fetcher.data?.error) {
      alert(fetcher.data.error);
    }
  }, [fetcher.data]);

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            backgroundColor: "background.paper",
            borderRadius: 2,
          }}
        >
          {/* Logo and Title */}
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
            gutterBottom
            sx={{ color: "text.secondary" }}
          >
            Login to Your Account
          </Typography>

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 2, width: "100%" }}
          >
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
              InputLabelProps={{ style: { color: "text.secondary" } }}
              InputProps={{ style: { color: "text.primary" } }}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputLabelProps={{ style: { color: "text.secondary" } }}
              InputProps={{ style: { color: "text.primary" } }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Login
            </Button>
          </Box>

          {/* Links */}
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography
                variant="body2"
                component={Link}
                to="/Register"
                sx={{ color: "secondary.main", textDecoration: "none" }}
              >
                Don't have an account? Register
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                component={Link}
                to="/"
                sx={{ color: "secondary.main", textDecoration: "none" }}
              >
                Back to Home
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
