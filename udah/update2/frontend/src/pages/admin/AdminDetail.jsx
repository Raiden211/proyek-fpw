import React, { useState } from "react";
import { useNavigate, useParams, useLoaderData } from "react-router-dom";
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
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import darkTheme from "../layout/Background";

const AdminDetail = () => {
  const { id } = useParams();
  const data = useLoaderData();
  const navigate = useNavigate();

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
            </Paper>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDetail;