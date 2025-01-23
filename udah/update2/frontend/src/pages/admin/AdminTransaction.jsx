import React from "react";
import { useLoaderData } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  CssBaseline,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ThemeProvider } from "@mui/material/styles";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import darkTheme from "../layout/Background";

const AdminTransaction = () => {
  const data = useLoaderData();

  // Validasi data awal
  const transactions = Array.isArray(data?.transactions) ? data.transactions : [];

  const generateReport = (transaction) => {
    try {
      const doc = new jsPDF();

      doc.setFillColor(0, 122, 255);
      doc.rect(0, 0, 210, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("Toko Pandan Sari", 105, 12, { align: "center" });

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Transaction ID: ${transaction?._id || "N/A"}`, 10, 30);
      doc.text(`Username: ${transaction?.username || "N/A"}`, 10, 40);
      doc.text(
        `Payment Method: ${transaction?.payment_method || "N/A"}`,
        10,
        50
      );
      doc.text(
        `Subtotal: Rp${transaction?.subtotal?.toLocaleString() || "0"}`,
        10,
        60
      );
      doc.text(
        `Date of Purchase: ${formatToJakartaTime(transaction?.date_of_buy)}`,
        10,
        70
      );

      const tableRows = transaction?.barang?.map((item, index) => [
        index + 1,
        item.id || "N/A",
        item.jumlah || 0,
        `Rp${item.harga?.toLocaleString() || "0"}`,
      ]) || [];

      doc.autoTable({
        head: [["No", "Item ID", "Quantity", "Price"]],
        body: tableRows,
        startY: 80,
      });

      const currentDate = formatToJakartaTime(new Date());
      doc.setFontSize(10);
      doc.text(
        `Created at: ${currentDate}`,
        10,
        doc.internal.pageSize.height - 10
      );

      const fileName = `${currentDate.replace(/[\s:/]/g, "-")}-${
        transaction._id
      }.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  if (transactions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
          backgroundColor: darkTheme.palette.background.default,
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Admin Transactions
        </Typography>
        <Divider sx={{ width: "50%", marginBottom: 2 }} />

        {transactions.map((transaction) => (
          <Card
            key={transaction._id}
            sx={{
              width: "80%",
              marginBottom: 4,
              backgroundColor: "background.paper",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction ID: {transaction._id}
              </Typography>
              <Typography variant="body1">
                Username: {transaction.username}
              </Typography>
              <Typography variant="body1">
                Payment Method: {transaction.payment_method}
              </Typography>
              <Typography variant="body1">
                Subtotal: Rp{transaction.subtotal.toLocaleString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Date of Purchase:{" "}
                {formatToJakartaTime(transaction.date_of_buy)}
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="h6">Items:</Typography>

              {transaction.barang?.length > 0 ? (
                <Box sx={{ height: 300, width: "100%", marginTop: 2 }}>
                  <DataGrid
                    rows={transaction.barang.map((item, index) => ({
                      id: `${transaction._id}-${index}`, // ID unik
                      no: index + 1,
                      item_id: item.id,
                      name: item.nama || "N/A",
                      quantity: item.jumlah,
                      price: `Rp${item.harga.toLocaleString()}`,
                    }))}
                    columns={[
                      { field: "no", headerName: "No", width: 100 },
                      { field: "name", headerName: "Name", width: 200 },
                      { field: "quantity", headerName: "Quantity", width: 150 },
                      { field: "price", headerName: "Price", width: 150 },
                    ]}
                    getRowId={(row) => row.id}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                  />
                </Box>
              ) : (
                <Typography color="textSecondary">
                  No items found.
                </Typography>
              )}

              <Box sx={{ marginTop: 2, textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => generateReport(transaction)}
                >
                  Generate Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </ThemeProvider>
  );
};

export default AdminTransaction;

const formatToJakartaTime = (date) => {
  if (!date) return "Invalid date";
  return new Date(date).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};