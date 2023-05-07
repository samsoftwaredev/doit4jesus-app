import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { Roboto } from "@next/font/google";
import "../styles/globals.css";
import { LanguageContextProvider } from "@/context/LanguageContext";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageContextProvider>
      <main className={roboto.className}>
        <CssBaseline />
        <Component {...pageProps} />
      </main>
    </LanguageContextProvider>
  );
}

export default MyApp;
