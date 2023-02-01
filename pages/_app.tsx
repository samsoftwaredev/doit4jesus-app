import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { Roboto } from "@next/font/google";
import "../styles/globals.css";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={roboto.className}>
      <CssBaseline />
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
