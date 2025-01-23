import React from "react";
import { useLoaderData } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Button,
  Divider,
  CssBaseline,
  Paper,
  Avatar,
  Tooltip,
  Badge,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import darkTheme from "../layout/Background";

const UserTransaction = () => {
  const data = useLoaderData();

  // Ensure we access the correct 'transactions' array
  const transaksi = data?.transaksi ?? [];

  if (transaksi.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="textSecondary">
          No transactions found.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 4,
          backgroundColor: "#e3f2fd", // Light blue background
        }}
      >
        <Divider sx={{ width: "50%", marginBottom: 4, borderColor: "black" }} />
        <Grid container spacing={4} justifyContent="center">
          {transaksi.map((transaction) => (
            <Grid item xs={12} sm={8} md={6} key={transaction._id}>
              <Paper
                elevation={3}
                sx={{
                  backgroundColor: "white",
                  borderRadius: 2,
                  overflow: "hidden",
                  mt: 4,
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom color="black">
                    Transaction ID: {transaction._id}
                  </Typography>
                  <Typography variant="body1" color="black">
                    Username: {transaction.username}
                  </Typography>
                  <Typography variant="body1" color="black">
                    Payment Method: {transaction.payment_method}
                  </Typography>
                  <Typography variant="body1" color="black">
                    Subtotal: Rp{transaction.subtotal.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" color="black" gutterBottom>
                    Date of Purchase:{" "}
                    {new Date(transaction.date_of_buy).toLocaleString()}
                  </Typography>
                  <Divider sx={{ marginY: 2, borderColor: "black" }} />
                  <Typography variant="h6" color="black">
                    Items:
                  </Typography>
                  {transaction.barang.map((item) => (
                    <Box key={item._id} sx={{ marginY: 2 }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.image}
                        alt={item.nama}
                        sx={{
                          objectFit: "contain",
                          borderRadius: 2,
                          border: "1px solid #ddd",
                        }}
                      />
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="black"
                        mt={1}
                      >
                        {item.nama}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.deskripsi}
                      </Typography>
                      <Typography variant="body2" color="black">
                        Quantity: {item.jumlah}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", padding: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    sx={{
                      bgcolor: "#4caf50",
                      "&:hover": { bgcolor: "#388e3c" },
                    }} // Green color
                  >
                    View Details
                  </Button>
                </CardActions>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default UserTransaction;
