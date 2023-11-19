import type { AppProps } from "next/app";
import { LanguageContextProvider } from "@/context/LanguageContext";
import { ToastContextProvider } from "@/context/ToastContext";
import { theme } from "@/styles/mui-overwrite";
import { ThemeProvider } from "@mui/material";
import "@/styles/normalize.css";

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
