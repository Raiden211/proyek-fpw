import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { useLoaderData, useNavigate } from "react-router-dom";
import BarangCard from "../layout/BarangCard";
import darkTheme from "../layout/Background";

const UserHome = () => {
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
          return true; // No filter applied
      }
    });

  const handleNavigate = (id) => {
    navigate(`/user/barang/${id}`);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div
        style={{
          minHeight: "80vh",
          backgroundColor: darkTheme.palette.background.default,
          color: darkTheme.palette.text.primary,
          padding: "24px",
          marginTop: "64px",
        }}
      >
        {/* Search Bar and Filter Section */}
        <div
          style={{
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
            sx={{
              backgroundColor: darkTheme.palette.background.paper,
              borderRadius: "4px",
              input: {
                color: darkTheme.palette.text.primary, // Set text color to black
              },
            }}
            InputProps={{
              style: {
                color: "black", // Ensure black text in the input
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
        </div>

        {/* Grid of Barang Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredBarang.map((item) => (
            <BarangCard key={item.id} item={item} onNavigate={handleNavigate} />
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default UserHome;
