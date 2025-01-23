import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLoaderData, useNavigate, useFetcher } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CssBaseline,
  TextField,
  Paper,
  Avatar,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import darkTheme from "../layout/Background";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

const schema = Joi.object({
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
      "string.email": "Email must contain '@'",
    }),
  payment_method: Joi.string().required().messages({
    "string.empty": "Payment method is required",
  }),
});

const UserCheckout = () => {
  const data = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const [selectedKupon, setSelectedKupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const kuponList = Array.isArray(data?.kupon) ? data.kupon : [];

  const cartItems = Array.isArray(data?.cart?.cart) ? data.cart.cart : [];
  const subtotal = data?.cart?.subtotal || 0;

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      payment_method: "",
      kupon: "",
    },
    resolver: joiResolver(schema),
  });

  const [discount, setDiscount] = useState(0);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleKuponChange = (event) => {
    const selectedKuponId = event.target.value;
    setSelectedKupon(selectedKuponId);

    const kupon = kuponList.find((k) => k.id === selectedKuponId);
    if (kupon) {
      if (subtotal >= kupon.min_pembelian) {
        const newSubtotal = subtotal - (subtotal * kupon.diskon) / 100;
        setDiscount((subtotal * kupon.diskon) / 100);
      } else {
        alert(
          `Kupon ini membutuhkan minimal pembelian Rp${kupon.min_pembelian.toLocaleString()}`
        );
        setSelectedKupon(""); // Reset selected coupon
        setDiscount(0); // Reset discount
      }
    }
  };

  const handleCheckout = () => {
    if (!paymentMethod) {
      alert("Please select a payment method!");
      return;
    }

    const cartId = data.cart?._id; // Use optional chaining to ensure cart ID exists
    if (!cartId) {
      alert("Cart ID not found!");
      return;
    }

    // Get form values from react-hook-form
    const { first_name, last_name, email } = getValues();

    if (!first_name || !last_name || !email) {
      alert(
        "Please fill in all required fields (first name, last name, email)!"
      );
      return;
    }

    const formData = new FormData();
    formData.append("id_cart", cartId);
    formData.append("payment_method", paymentMethod);
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("email", email);

    // Send coupon_id only if selected
    if (selectedKupon) {
      formData.append("coupon_id", selectedKupon);
    }

    fetcher.submit(formData, {
      method: "post",
      action: "/user/checkout",
    });
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
            mt: 8,
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
                    <Typography color="black">
                      {item?.jumlah} X Rp{item?.barang?.harga.toLocaleString()}
                    </Typography>
                  </Box>
                </Paper>
              ))
            ) : (
              <Typography variant="body2" color="black">
                Keranjang Anda kosong.
              </Typography>
            )}
          </Box>

          {/* Right Panel: Customer Information and Payment */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              p: 3,
              bgcolor: "#f9f9f9",
              borderRadius: 2,
              width: "100%",
              overflowY: "auto", // Enable scrolling if content overflows
              maxHeight: "80vh", // Limit height to prevent overflow
            }}
          >
            <Typography variant="h5" gutterBottom color="black">
              Informasi Pelanggan
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                    InputProps={{ sx: { color: "black" } }}
                    InputLabelProps={{ sx: { color: "black" } }}
                    FormHelperTextProps={{ sx: { color: "black" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "black" },
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                    InputProps={{ sx: { color: "black" } }}
                    InputLabelProps={{ sx: { color: "black" } }}
                    FormHelperTextProps={{ sx: { color: "black" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "black" },
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{ sx: { color: "black" } }}
                    InputLabelProps={{ sx: { color: "black" } }}
                    FormHelperTextProps={{ sx: { color: "black" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "black" },
                      },
                    }}
                  />
                )}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="payment-method-label" sx={{ color: "black" }}>
                  Pilih Metode Pembayaran
                </InputLabel>
                <Select
                  labelId="payment-method-label"
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                  label="Pilih Metode Pembayaran"
                  sx={{
                    color: "black",
                    "& .MuiSelect-icon": { color: "black" },
                  }}
                >
                  <MenuItem value="qris">Qris</MenuItem>
                  <MenuItem value="tunai">Tunai</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="coupon-label" sx={{ color: "black" }}>
                  Pilih Kupon
                </InputLabel>
                <Select
                  labelId="coupon-label"
                  value={selectedKupon}
                  onChange={handleKuponChange}
                  label="Pilih Kupon"
                  sx={{
                    color: "black",
                    "& .MuiSelect-icon": { color: "black" },
                  }}
                >
                  {kuponList.map((kupon) => (
                    <MenuItem
                      key={kupon.id}
                      value={kupon.id}
                      disabled={subtotal < kupon.min_pembelian}
                      sx={{
                        color:
                          subtotal < kupon.min_pembelian ? "gray" : "black",
                      }}
                    >
                      {kupon.nama}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="body1" color="black">
                  Subtotal
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="black">
                  Rp{subtotal.toLocaleString()}
                </Typography>
              </Box>
              {discount > 0 && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="body1" color="black">
                    Diskon
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="success">
                    -Rp{discount.toLocaleString()}
                  </Typography>
                </Box>
              )}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="body1" color="black">
                  Total
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="success">
                  Rp{(subtotal - discount).toLocaleString()}
                </Typography>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{
                  mt: 2,
                  bgcolor: "#4caf50",
                  "&:hover": { bgcolor: "#388e3c" },
                }} // Green color
              >
                Beli Sekarang
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                size="large"
                sx={{
                  mt: 2,
                  bgcolor: "#f44336",
                  "&:hover": { bgcolor: "#d32f2f" },
                }} // Red color
                onClick={() => navigate("/user/home")}
              >
                Kembali
              </Button>
            </Box>
          </Paper>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default UserCheckout;
