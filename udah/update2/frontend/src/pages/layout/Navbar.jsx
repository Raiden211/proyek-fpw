import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import logo from "../../assets/toserba.jpg";
import UserData from "../../controller/UserData";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Access Redux store state
  const reduxUsername = useSelector((state) => state.user.username);
  const { role } = UserData();

  // Local state for username
  const [username, setUsername] = useState(reduxUsername);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const isCheckoutPage = role !== 1 && location.pathname === "/user/checkout";

  useEffect(() => {
    // Update local state whenever reduxUsername changes
    if (reduxUsername) {
      setUsername(reduxUsername);
    }
  }, [reduxUsername]);

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        {/* Logo and Title */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="logo"
          onClick={() => navigate(role === 1 ? "/admin/home" : "/user/home")}
          sx={{ mr: 2 }}
        >
          <img
            src={logo}
            alt="Toserba Logo"
            style={{ width: 50, height: 50, borderRadius: "50%" }}
          />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Toko Pandan Sari
        </Typography>

        {!isCheckoutPage && (
          <>
            {/* Navigation Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {role === 1 ? (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/admin/home")}
                  >
                    Home
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/admin/transaksi")}
                  >
                    Transaksi
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/admin/report")}
                  >
                    Report
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/admin/barang")}
                  >
                    Barang
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/admin/kupon")}
                  >
                    Kupon
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/admin/jenis")}
                  >
                    Jenis
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/admin/register")}
                  >
                    Admin & User
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/user/home")}
                  >
                    Home
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/user/transaksi")}
                  >
                    Transaksi
                  </Button>
                  {role === 2 && (
                    <>
                      <Button
                        color="inherit"
                        onClick={() => navigate("/user/topup")}
                      >
                        Topup
                      </Button>
                      <Button
                        color="inherit"
                        onClick={() => navigate("/user/details")}
                      >
                        Details
                      </Button>
                    </>
                  )}
                </>
              )}

              {/* Cart Button */}
              <IconButton
                color="inherit"
                onClick={() =>
                  navigate(role === 1 ? "/admin/cart" : "/user/cart")
                }
              >
                <ShoppingCartIcon />
              </IconButton>
            </Box>

            {/* User Menu */}
            <Box sx={{ ml: 2 }}>
              <Button color="inherit" onClick={handleMenuOpen}>
                Welcome, {username || "Guest"}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/logout");
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;