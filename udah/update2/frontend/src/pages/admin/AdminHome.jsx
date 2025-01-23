import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import BarangCard from "../layout/BarangCard";
import darkTheme from "../layout/Background";
import { useLoaderData, useNavigate } from "react-router-dom";

const AdminHome = () => {
  const data = useLoaderData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePriceFilterChange = (event) => {
    setPriceFilter(event.target.value);
  };

  const filteredBarang = data.barang
    .filter((item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => {
      switch (priceFilter) {
        case "<5000":
          return item.harga < 5000;
        case "5000-20000":
          return item.harga >= 5000 && item.harga <= 20000;
        case "20000-50000":
          return item.harga >= 20000 && item.harga <= 50000;
        case ">=50000":
          return item.harga >= 50000;
        default:
          return true;
      }
    });

  const handleNavigate = (id) => {
    navigate(`/admin/barang/${id}`);
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
        {/* Page Title */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", marginBottom: "24px" }}
        >
          Admin Dashboard
        </Typography>

        {/* Search Bar and Filter Section */}
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            marginBottom: "24px",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: darkTheme.palette.background.paper,
                borderRadius: "4px",
                input: {
                  color: darkTheme.palette.text.primary, // Text color
                },
              },
            }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="price-filter-label" sx={{ color: "text.primary" }}>
              Filter by Price
            </InputLabel>
            <Select
              labelId="price-filter-label"
              value={priceFilter}
              onChange={handlePriceFilterChange}
              label="Filter by Price"
              sx={{
                backgroundColor: darkTheme.palette.background.paper,
                color: darkTheme.palette.text.primary,
                "& .MuiSelect-icon": {
                  color: darkTheme.palette.text.primary, // Icon color
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="<5000">Less than Rp5,000</MenuItem>
              <MenuItem value="5000-20000">Rp5,000 - Rp20,000</MenuItem>
              <MenuItem value="20000-50000">Rp20,000 - Rp50,000</MenuItem>
              <MenuItem value=">=50000">Rp50,000 or more</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Grid of Barang Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // 1 column on extra-small screens
              sm: "repeat(2, 1fr)", // 2 columns on small screens
              md: "repeat(3, 1fr)", // 3 columns on medium screens
              lg: "repeat(4, 1fr)", // 4 columns on large screens
            },
            gap: "20px",
          }}
        >
          {filteredBarang.map((item) => (
            <BarangCard key={item.id} item={item} onNavigate={handleNavigate} />
          ))}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminHome;
