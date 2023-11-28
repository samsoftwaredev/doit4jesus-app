import type { AppProps } from "next/app";
import { LanguageContextProvider } from "@/context/LanguageContext";
import { ToastContextProvider } from "@/context/ToastContext";
import { theme } from "@/styles/mui-overwrite";
import { ThemeProvider } from "@emotion/react";
import { StyledEngineProvider } from "@mui/material/styles";
import "@/styles/normalize.css";
import "@/styles/global.scss";
import { AudioPlayer } from "../components";
import { Rosary } from "../class";
import { INTERFACE_LANGUAGES } from "../interfaces";
import { Box } from "@mui/material";
import MusicPlayer from "@/components/MusicPlayer";

const myRosary = new Rosary();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <ToastContextProvider>
          <LanguageContextProvider>
            <Component {...pageProps} />
            <MusicPlayer rosary={myRosary} />
          </LanguageContextProvider>
        </ToastContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default MyApp;
