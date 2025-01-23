import React from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useFetcher } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CssBaseline,
  ThemeProvider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import darkTheme from "../layout/Background";

const AdminJenis = () => {
  const data = useLoaderData(); // Data fetched from the loader
  const fetcher = useFetcher(); // Used to submit data
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = (formData) => {
    fetcher.submit(
      { nama: formData.nama },
      { method: "POST", action: "/admin/jenis" }
    );
    reset(); // Reset the form after submission
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          p: 4,
          backgroundColor: "#e3f2fd", // Light blue background
          minHeight: "100vh",
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
          }}
        >
          Jenis Management
        </Typography>

        {/* Form */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: "white", // White background for contrast
            borderRadius: "8px",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Nama Jenis"
              {...register("nama", { required: "Nama is required" })}
              error={!!errors.nama}
              helperText={errors.nama?.message}
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Add />}
              sx={{ height: "56px" }} // Match height with TextField
            >
              Add Jenis
            </Button>
          </Box>
        </Paper>

        {/* Table */}
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "white", // White background for contrast
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <TableContainer
            sx={{
              maxHeight: data.jenis.length > 8 ? 480 : "none", // Set maxHeight only if more than 8 items
              overflowY: data.jenis.length > 8 ? "auto" : "visible", // Enable scroll only if more than 8 items
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                    Nama
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.jenis.map((jenis) => (
                  <TableRow key={jenis.id}>
                    <TableCell sx={{ color: "black" }}>{jenis.id}</TableCell>
                    <TableCell sx={{ color: "black" }}>{jenis.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default AdminJenis;
