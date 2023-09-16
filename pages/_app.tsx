import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material";
import { LanguageContextProvider } from "@/context/LanguageContext";
import { ToastContextProvider } from "@/context/ToastContext";
import { theme } from "@/styles/mui-overwrite";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <ToastContextProvider>
        <LanguageContextProvider>
          <Component {...pageProps} />
        </LanguageContextProvider>
      </ToastContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
