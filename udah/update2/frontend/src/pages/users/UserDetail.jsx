import React, { useState } from "react";
import {
  useNavigate,
  useParams,
  useLoaderData,
  useFetcher,
} from "react-router-dom";
import {
  Box,
  Button,
  CssBaseline,
  Typography,
  IconButton,
  Paper,
  Avatar,
  Tooltip,
  Rating,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import darkTheme from "../layout/Background";
import BarangCard from "../layout/BarangCard";

const UserDetail = () => {
  const { id } = useParams();
  const data = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);

  // Calculate subtotal based on quantity and price
  const subtotal = quantity * data.barang.harga;

  const handleIncrease = () => {
    if (quantity < data.barang.stok) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    const formData = new FormData();
    formData.append("actionType", "addToCart");
    formData.append("id_barang", data.barang.id);
    formData.append("jumlah", quantity);

    fetcher.submit(formData, {
      method: "post",
    });
  };

  // Submit review handler
  const handleSubmitReview = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("actionType", "addReview");
    formData.append("id_barang", data.barang.id);
    formData.append("review", newReview);
    formData.append("rating", newRating);

    fetcher.submit(formData, {
      method: "post",
    });

    setNewReview("");
    setNewRating(5);
  };

  // Delete review handler
  const handleDeleteReview = (id_review) => {
    const formData = new FormData();
    formData.append("actionType", "deleteReview");
    formData.append("id_barang", data.barang.id);
    formData.append("id_review", id_review);

    fetcher.submit(formData, {
      method: "post",
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#e3f2fd",
          p: 4,
          mt: 8,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
            p: 4,
            bgcolor: "white",
            borderRadius: 4,
            width: { xs: "100%", md: "80%" },
            maxWidth: "1200px",
          }}
        >
          {/* Left Panel: Image and Details */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              flex: 1,
            }}
          >
            <Avatar
              src={data.barang.image}
              alt={data.barang.nama}
              sx={{
                width: 300,
                height: 300,
                borderRadius: 2,
                mb: 3,
              }}
            />
            <Typography variant="h4" fontWeight="bold" color="black">
              {data.barang.nama}
            </Typography>
            <Typography variant="body1" color="textSecondary" mt={2}>
              {data.barang.deskripsi}
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Jenis: {data.barang.jenis}
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Harga: Rp{data.barang.harga.toLocaleString("id-ID")}
            </Typography>
            <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body1" fontWeight="bold" color="black">
                Rating:
              </Typography>
              <Rating
                value={data.barang.rating}
                readOnly
                precision={0.5}
                size="medium"
              />
              <Typography variant="body2" color="textSecondary">
                ({data.barang.rating})
              </Typography>
            </Box>
          </Box>

          {/* Right Panel */}
          <Box sx={{ flex: 1, width: "100%" }}>
            {/* Reviews Section */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                bgcolor: "#f9f9f9",
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="black" mb={2}>
                Ulasan Pelanggan
              </Typography>
              <List
                sx={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  bgcolor: "#f9f9f9",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                {data.barang.reviews.map((review) => (
                  <ListItem
                    key={review.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      bgcolor: "#e0e0e0",
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" color="black" fontWeight="bold">
                        {review.username}
                      </Typography>
                      <Rating value={review.rating} readOnly precision={0.5} size="small" />
                      <ListItemText primary={review.review} />
                    </Box>
                    <Tooltip title="Hapus Ulasan">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
              {/* Form to add review */}
              <Box
                component="form"
                onSubmit={handleSubmitReview}
                sx={{ mt: 3, display: "flex", gap: 2, flexDirection: "column" }}
              >
                <TextField
                  label="Tulis Ulasan Anda"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  required
                  InputLabelProps={{
                    style: { color: "black" }, // Warna hitam untuk label
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black", // Warna hitam untuk border
                      },
                      "&:hover fieldset": {
                        borderColor: "#388e3c", // Warna hijau saat hover
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "black", // Warna teks yang diketik menjadi hitam
                    },
                  }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography>Rating:</Typography>
                  <Rating
                    value={newRating}
                    onChange={(e, newValue) => setNewRating(newValue)}
                  />
                </Box>
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                  Kirim Ulasan
                </Button>
              </Box>
            </Paper>

            {/* Quantity Controls and Actions */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                bgcolor: "#f9f9f9",
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="black" mb={3}>
                Atur Jumlah
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Tooltip title="Kurangi Jumlah">
                  <IconButton
                    color="primary"
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                </Tooltip>
                <Typography variant="h6" color="black">
                  {quantity}
                </Typography>
                <Tooltip title="Tambah Jumlah">
                  <IconButton
                    color="primary"
                    onClick={handleIncrease}
                    disabled={quantity >= data.barang.stok}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="body1" color="textSecondary" mb={3}>
                Subtotal: Rp {subtotal.toLocaleString("id-ID")}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                sx={{ width: "100%" }}
              >
                Tambah ke Keranjang
              </Button>
            </Paper>
          </Box>
        </Paper>
      </Box>

      {/* Grid of BarangCards */}
      <Box
        sx={{
          minHeight: "80vh",
          backgroundColor: darkTheme.palette.background.default,
          color: darkTheme.palette.text.primary,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 2,
          padding: 4,
          mt: 4,
        }}
      >
        {data.barangs
          .filter((item) => item.id_user === data.barang.id_user)
          .map((item) => (
            <BarangCard
              key={item.id}
              item={item}
              onNavigate={() => navigate(`/user/barang/${item.id}`)}
            />
          ))}
      </Box>
    </ThemeProvider>
  );
};

export default UserDetail;