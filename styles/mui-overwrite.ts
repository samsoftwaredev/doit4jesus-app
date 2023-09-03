import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#464e61",
    },
    secondary: {
      main: "#000",
    },
    warning: {
      main: "#ff9800",
      light: "#a69540",
    },
    error: {
      main: "#9f4435",
    },
    info: {
      main: "#00bcd4",
    },
    success: {
      main: "#009688",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {},
    },
  },
});
