import React from "react";
import { useLoaderData, useFetcher } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";
import jsPDF from "jspdf";

// Function to format the current date to Jakarta time
const formatToJakartaTime = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(date);
};

const ReportPenjualan = () => {
  const data = useLoaderData(); // Preloaded report data from the backend
  const fetcher = useFetcher();
  console.log("Loaded Data:", data);

  const generateReport = (item) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(0, 122, 255); // Blue color
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("Toko Pandan Sari", 105, 12, { align: "center" });

    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Item Name: ${item.nama}`, 10, 30);
    doc.text(`Description: ${item.deskripsi}`, 10, 40);
    doc.text(`Total Quantity Bought: ${item.total_quantity}`, 10, 50);
    doc.text(`Subtotal Price: ${item.subtotal_price.toLocaleString()}`, 10, 60);

    // Footer
    const currentDate = formatToJakartaTime(new Date());
    doc.setFontSize(10);
    doc.text(
      `Created at: ${currentDate}`,
      10,
      doc.internal.pageSize.height - 10
    );

    doc.save(`Report_${item.nama}.pdf`);
  };

  const generateAllReports = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(0, 122, 255); // Blue color
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("Toko Pandan Sari", 105, 12, { align: "center" });

    // Content
    let y = 30;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    data.report.forEach((item, index) => {
      doc.text(`${index + 1}. Item Name: ${item.nama}`, 10, y);
      doc.text(`Description: ${item.deskripsi}`, 10, y + 10);
      doc.text(`Total Quantity Bought: ${item.total_quantity}`, 10, y + 20);
      doc.text(
        `Subtotal Price: ${item.subtotal_price.toLocaleString()}`,
        10,
        y + 30
      );
      y += 40;

      if (y > 270) {
        doc.addPage();
        y = 30;
      }
    });

    // Footer
    const currentDate = formatToJakartaTime(new Date());
    doc.setFontSize(10);
    doc.text(
      `Created at: ${currentDate}`,
      10,
      doc.internal.pageSize.height - 10
    );

    doc.save("All_Reports.pdf");
  };

  if (!data || !data.report || data.report.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="87vh"
        width="100vw"
        overflow="hidden"
        p={0}
        m={0}
        sx={{ backgroundColor: "#EDCE8C" }}
      >
        <Typography variant="h6">No sales data available.</Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="87vh"
      width="100vw"
      overflow="hidden"
      p={0}
      m={0}
      sx={{ backgroundColor: "#EDCE8C" }}
    >
      <Box
        flex={1}
        p={2}
        mr={2}
        border="1px solid #ccc"
        borderRadius="8px"
        sx={{
          backgroundColor: "white",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <Typography variant="h6" mb={2}>
          Item Sales Report
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Total Quantity Bought</TableCell>
                <TableCell>Subtotal Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.report.map((item) => (
                <TableRow key={item.id_barang}>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.deskripsi}</TableCell>
                  <TableCell>{item.total_quantity}</TableCell>
                  <TableCell>{item.subtotal_price}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => generateReport(item)}
                    >
                      Generate Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} textAlign="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={generateAllReports}
          >
            Generate All Reports
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportPenjualan;
