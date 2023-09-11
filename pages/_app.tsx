import type { AppProps } from "next/app";
import { Roboto } from "@next/font/google";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { LanguageContextProvider } from "@/context/LanguageContext";
import { ToastContextProvider } from "@/context/ToastContext";
import { theme } from "@/styles/mui-overwrite";
import "../styles/globals.scss";

const roboto = Roboto({
  weight: "100",
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
