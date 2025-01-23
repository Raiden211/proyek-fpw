import React from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useLoaderData, useFetcher } from "react-router-dom";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import darkTheme from "../layout/Background";

const schema = Joi.object({
  diskon: Joi.number().min(5).max(80).required().messages({
    "number.min": "Diskon must be at least 5%",
    "number.max": "Diskon must be at most 80%",
    "number.empty": "Diskon is required",
  }),
  exp_date: Joi.date()
    .greater(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)) // Minimal 3 hari dari sekarang
    .required()
    .messages({
      "date.base": "Date is required",
      "date.greater": "Expiration date must be at least 3 days from today",
    }),
  min_pembelian: Joi.number().min(10000).required().messages({
    "number.min": "Min Pembelian must be at least 10,000",
    "number.empty": "Min Pembelian is required",
  }),
});

const AdminKupon = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });

  const data = useLoaderData(); // Loader data from the backend
  const fetcher = useFetcher();

  const onSubmit = (formData) => {
    console.log("Form Data:", formData);
    fetcher.submit(formData, {
      method: "post",
      action: "/admin/kupon",
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
          }}
        >
          Kupon Management
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
          {/* Form Section */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              p: 3,
              backgroundColor: "white", // White background for contrast
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" mb={2} color="black">
              Add New Kupon
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Diskon (%)"
                type="number"
                fullWidth
                margin="normal"
                {...register("diskon")}
                error={!!errors.diskon}
                helperText={errors.diskon?.message}
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
                label="Expiration Date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...register("exp_date")}
                error={!!errors.exp_date}
                helperText={errors.exp_date?.message}
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
                label="Min Pembelian (Rp)"
                type="number"
                fullWidth
                margin="normal"
                {...register("min_pembelian")}
                error={!!errors.min_pembelian}
                helperText={errors.min_pembelian?.message}
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
                sx={{ mt: 2 }}
              >
                Add Kupon
              </Button>
            </form>
          </Paper>

          {/* Table Section */}
          <Paper
            elevation={3}
            sx={{
              flex: 2,
              p: 3,
              backgroundColor: "white", // White background for contrast
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Typography variant="h6" mb={2} color="black">
              Kupon List
            </Typography>
            <TableContainer
              sx={{
                maxHeight: data.kupon.length > 5 ? "400px" : "none", // Enable scroll if more than 5 items
                overflowY: data.kupon.length > 5 ? "auto" : "visible",
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
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                      Diskon (%)
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                      Expiration Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "black" }}>
                      Min Pembelian (Rp)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.kupon.map((row) => {
                    const isExpired = new Date(row.exp_date) < new Date();
                    return (
                      <TableRow
                        key={row._id}
                        sx={{
                          backgroundColor: isExpired ? "#ffebee" : "inherit", // Light red for expired
                        }}
                      >
                        <TableCell sx={{ color: "black" }}>{row._id}</TableCell>
                        <TableCell sx={{ color: "black" }}>
                          {row.nama}
                        </TableCell>
                        <TableCell sx={{ color: "black" }}>
                          {row.diskon}
                        </TableCell>
                        <TableCell sx={{ color: "black" }}>
                          {row.exp_date}
                        </TableCell>
                        <TableCell sx={{ color: "black" }}>
                          {row.min_pembelian}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminKupon;
