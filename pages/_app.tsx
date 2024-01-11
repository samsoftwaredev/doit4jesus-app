import type { AppProps } from "next/app";
import { LanguageContextProvider } from "@/context/LanguageContext";
import { ToastContextProvider } from "@/context/ToastContext";
import { theme } from "@/styles/mui-overwrite";
import { ThemeProvider } from "@emotion/react";
import { StyledEngineProvider } from "@mui/material/styles";
import "@/styles/normalize.css";
import "@/styles/global.scss";
import MusicPlayer from "@/components/MusicPlayer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { myRosary } from "@/class";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <ToastContextProvider>
          <LanguageContextProvider>
            <ToastContainer autoClose={5000} />
            <Component {...pageProps} />
            <MusicPlayer rosary={myRosary} />
          </LanguageContextProvider>
        </ToastContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default MyApp;
