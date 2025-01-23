import React from "react";
import { useLoaderData, useNavigate, useFetcher } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  CssBaseline,
  Paper,
  Grid,
  Avatar,
  Tooltip,
  Badge,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import darkTheme from "../layout/Background";

const AdminCart = () => {
  const data = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const cartItems = Array.isArray(data?.cart?.cart) ? data.cart.cart : [];
  const subtotal = data?.cart?.subtotal || 0;

  const handleCartAction = (action, item, jumlah) => {
    console.log(`Action: ${action}, Item: ${item}, Jumlah: ${jumlah}`);
    fetcher.submit(
      {
        action,
        id_barang: item,
      },
      { method: "put", action: "/admin/cart" }
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#e3f2fd"
        p={4}
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
            gap: 4,
            p: 4,
            bgcolor: "white",
            borderRadius: 4,
            width: { xs: "100%", md: "80%" },
            maxWidth: "1200px",
            maxHeight: "90vh",
            overflow: "hidden",
          }}
        >
          {/* Left Panel: Cart Items */}
          <Box
            flex={2}
            maxHeight="80vh"
            sx={{ overflowY: "auto", width: "100%" }}
          >
            <Typography variant="h5" gutterBottom color="black">
              Keranjang
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    mb: 2,
                    bgcolor: "#f9f9f9",
                    borderRadius: 2,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} flex={1}>
                    <Avatar
                      src={item?.barang?.image || ""}
                      alt={item?.barang?.nama || "Item"}
                      sx={{ width: 64, height: 64, borderRadius: 2 }}
                    />
                    <Box>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="black"
                      >
                        {item?.barang?.nama || "Unknown Item"}
                      </Typography>
                      <Typography variant="body2" color="black">
                        {`Rp${item?.total?.toLocaleString() || 0}`}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Tooltip title="Kurangi Jumlah">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleCartAction(
                            "decrease",
                            item.id_barang,
                            Math.max(0, item.jumlah - 1)
                          )
                        }
                        disabled={item?.jumlah === 1}
                      >
                        <Remove />
                      </IconButton>
                    </Tooltip>
                    <Badge badgeContent={item?.jumlah} color="primary" />
                    <Tooltip title="Tambah Jumlah">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleCartAction(
                            "increase",
                            item.id_barang,
                            item.jumlah + 1
                          )
                        }
                      >
                        <Add />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Hapus Item">
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleCartAction("delete", item.id_barang, 0)
                        }
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              ))
            ) : (
              <Typography variant="body2" color="black">
                Keranjang Anda kosong.
              </Typography>
            )}
          </Box>

          {/* Right Panel: Summary */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              p: 3,
              bgcolor: "#f9f9f9",
              borderRadius: 2,
              width: "100%",
            }}
          >
            <Typography variant="h5" gutterBottom color="black">
              Ringkasan Belanja
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="body1" color="black">
                Subtotal
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="black">
                Rp{subtotal.toLocaleString()}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={() => {
                if (cartItems.length > 0) {
                  navigate("/admin/checkout");
                } else {
                  alert("Mau beli apa?");
                  navigate("/admin/home");
                }
              }}
              sx={{ mt: 2 }}
            >
              Beli Sekarang
            </Button>
          </Paper>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default AdminCart;
