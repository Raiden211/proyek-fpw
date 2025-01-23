import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

const BarangCard = (props) => {
  const theme = useTheme();

  return (
    <Card
      key={props.item.id}
      sx={{
        maxWidth: "100%",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <CardActionArea onClick={() => props.onNavigate(props.item.id)}>
        {/* Card Media (Image) */}
        <CardMedia
          component="img"
          height="200"
          image={props.item.image}
          alt={props.item.nama}
          sx={{
            objectFit: "contain",
            backgroundColor: theme.palette.background.paper,
          }}
        />

        {/* Card Content */}
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
            }}
          >
            {props.item.nama}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: "500",
            }}
          >
            Rp {props.item.harga.toLocaleString("id-ID")}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* Card Actions (Button) */}
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "16px",
        }}
      ></CardActions>
    </Card>
  );
};

export default BarangCard;
