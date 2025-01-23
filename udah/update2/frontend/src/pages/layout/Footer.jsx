import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "common.white",
        py: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h6" align="center" gutterBottom>
          Toko Pandan Sari
        </Typography>
        <Typography variant="body2" align="center">
          Created by Kelompok 3. All Rights Reserved
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
