import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#464e61",
      light: "#00bcd4",
    },
    secondary: {
      main: "#E8D1CB",
    },
    warning: {
      main: "#ff9800",
      light: "#a69540",
    },
    error: {
      main: "#9f4435",
    },
    info: {
      main: "#000",
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
      styleOverrides: {
        contained: {
          borderRadius: "50px",
        },
      },
    },
  },
});
