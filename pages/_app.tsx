import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { Roboto } from "@next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@mui/material";
import { LanguageContextProvider } from "@/context/LanguageContext";
import { theme } from "@/styles/mui-overwrite";
import { ToastContextProvider } from "@/context/ToastContext";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastContextProvider>
      <LanguageContextProvider>
        <ThemeProvider theme={theme}>
          <main className={roboto.className}>
            <CssBaseline />
            <Component {...pageProps} />
          </main>
        </ThemeProvider>
      </LanguageContextProvider>
    </ToastContextProvider>
  );
}

export default MyApp;
