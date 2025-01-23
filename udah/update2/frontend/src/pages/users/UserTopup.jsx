import React, { useState } from "react";
import { useLoaderData, useFetcher } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  CircularProgress,
  Alert,
} from "@mui/material";

const UserTopup = () => {
  const data = useLoaderData(); // Get the current saldo from the loader
  const fetcher = useFetcher();
  const [topupAmount, setTopupAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleTopup = async (e) => {
    e.preventDefault();
    if (!topupAmount || isNaN(topupAmount) || topupAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    // Submit the form data using the fetcher
    fetcher.submit(
      { amount: topupAmount },
      { method: "post", action: "/user/topup" }
    );
  };

  // Handle fetcher state changes
  React.useEffect(() => {
    if (fetcher.state === "idle") {
      if (fetcher.data?.error) {
        setError(fetcher.data.error);
      } else if (fetcher.data?.success) {
        setSuccess("Topup successful!");
        setTopupAmount("");
      }
      setLoading(false);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Topup Saldo
        </Typography>

        {/* Current Saldo */}
        <Typography variant="h6" gutterBottom>
          Current Saldo: Rp {data.saldo.toLocaleString("id-ID")}
        </Typography>

        {/* Topup Form */}
        <Box component="form" onSubmit={handleTopup} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Topup Amount"
            variant="outlined"
            type="number"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Topup"}
          </Button>
        </Box>

        {/* Error and Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default UserTopup;
