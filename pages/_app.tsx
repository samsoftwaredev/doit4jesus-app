import type { AppProps } from "next/app";
import { Roboto } from "@next/font/google";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { LanguageContextProvider } from "@/context/LanguageContext";
import { ToastContextProvider } from "@/context/ToastContext";
import { theme } from "@/styles/mui-overwrite";
import "../styles/globals.scss";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastContextProvider>
      <LanguageContextProvider>
        <main className={roboto.className}>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </main>
      </LanguageContextProvider>
    </ToastContextProvider>
  );
}

export default MyApp;
