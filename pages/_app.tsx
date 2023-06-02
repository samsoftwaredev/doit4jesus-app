import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { Roboto } from "@next/font/google";
import "../styles/globals.css";
import { ThemeProvider, colors, createTheme } from "@mui/material";
import { LanguageContextProvider } from "@/context/LanguageContext";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const theme = createTheme({
  palette: {
    primary: { main: colors.purple[50] },
    secondary: { main: colors.pink[100] },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageContextProvider>
      <ThemeProvider theme={theme}>
        <main className={roboto.className}>
          <CssBaseline />
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </LanguageContextProvider>
  );
}

export default MyApp;
