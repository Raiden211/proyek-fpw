import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#EDCE8C",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#6e6a6a",
    },
  },
});

export default darkTheme;
