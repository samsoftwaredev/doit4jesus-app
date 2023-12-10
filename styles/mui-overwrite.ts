import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      light: "#00bcd4",
      main: "#163755",
    },
    secondary: {
      main: "#E8D1CB",
    },
    warning: {
      light: "#955f27",
      main: "#ff9800",
      dark: "#844d42",
    },
    error: {
      light: "##c09397",
      main: "#b47a84",
      dark: "#9f4435",
    },
    info: {
      light: "#ffffff",
      main: "#000000",
      dark: "#fafafa",
    },
    success: {
      light: "#a69540",
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
