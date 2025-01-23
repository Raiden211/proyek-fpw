import React, { useEffect, useState } from "react";
import { adminTransReportHandler } from "../../controller/DataHandler";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  CssBaseline,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ReportPenjualanAdmin = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { transactions } = await adminTransReportHandler();
        console.log("Transactions:", transactions); // Log untuk memeriksa data
        setTransactions(transactions.data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  // Fungsi untuk membuat laporan PDF
  const generatePDF = (transaction) => {
    const doc = new jsPDF();
    doc.text(`Laporan Transaksi - Admin ID: ${transaction.id_admin}`, 10, 10);

    doc.autoTable({
      head: [["ID Barang", "Nama Barang", "Jumlah Beli", "Total"]],
      body: transaction.barang.map((item) => [
        item.id,
        item.nama,
        item.jumlah_beli,
        item.total.toLocaleString("id-ID", { style: "currency", currency: "IDR" }),
      ]),
    });

    doc.text("Detail Pembeli:", 10, doc.lastAutoTable.finalY + 10);
    doc.text(`Nama: ${transaction.users[0].first_name} ${transaction.users[0].last_name}`, 10, doc.lastAutoTable.finalY + 20);
    doc.text(`Email: ${transaction.users[0].email}`, 10, doc.lastAutoTable.finalY + 30);

    doc.text("Detail Transaksi:", 10, doc.lastAutoTable.finalY + 50);
    doc.text(`Subtotal: ${transaction.subtotal.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}`, 10, doc.lastAutoTable.finalY + 60);
    doc.text(`Metode Pembayaran: ${transaction.pay_method}`, 10, doc.lastAutoTable.finalY + 70);
    doc.text(`Tanggal Pembelian: ${new Date(transaction.date_of_buy).toLocaleString()}`, 10, doc.lastAutoTable.finalY + 80);

    doc.save(`Laporan_Transaksi_${transaction._id}.pdf`);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Laporan Penjualan Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 2 }}>
        {transactions.map((transaction) => (
          <Card key={transaction._id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaksi ID: {transaction._id}
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              <Typography>
                <strong>Admin ID:</strong> {transaction.id_admin}
              </Typography>
              <Typography>
                <strong>Pembeli:</strong> {transaction.users[0].first_name} {transaction.users[0].last_name} (
                {transaction.users[0].email})
              </Typography>
              <Typography>
                <strong>Subtotal:</strong>{" "}
                {transaction.subtotal.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
              </Typography>
              <Typography>
                <strong>Metode Pembayaran:</strong> {transaction.pay_method}
              </Typography>
              <Typography>
                <strong>Tanggal Pembelian:</strong>{" "}
                {new Date(transaction.date_of_buy).toLocaleString()}
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="subtitle1">Barang:</Typography>
              {transaction.barang.map((item) => (
                <Box key={item.id} sx={{ marginBottom: 1 }}>
                  <Typography>
                    - {item.nama} (Jumlah: {item.jumlah_beli}) -{" "}
                    {item.total.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                  </Typography>
                </Box>
              ))}
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => generatePDF(transaction)}
              >
                Download Laporan PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ReportPenjualanAdmin;