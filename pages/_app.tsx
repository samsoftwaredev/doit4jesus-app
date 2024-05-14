import type { AppProps } from "next/app";
import { LanguageContextProvider } from "@/context/LanguageContext";
import { theme } from "@/styles/mui-overwrite";
import { ThemeProvider } from "@emotion/react";
import { StyledEngineProvider } from "@mui/material/styles";
import "@/styles/normalize.css";
import "@/styles/global.scss";
import MusicPlayer from "@/components/MusicPlayer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContextProvider } from "@/context/UserContext";
import { AudioContextProvider } from "@/context/AudioContext";
import { PresenceContextProvider } from "@/context/PresenceContext";
import { Analytics } from "@vercel/analytics/react";
import { useState } from "react";
import { StatsContextProvider } from "@/context/StatsContext";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [hideMusicPlayer, setHideMusicPlayer] = useState(true);
  return (
    <UserContextProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <LanguageContextProvider>
            <AudioContextProvider
              hideMusicPlayer={hideMusicPlayer}
              setHideMusicPlayer={setHideMusicPlayer}
            >
              <StatsContextProvider>
                <PresenceContextProvider>
                  <ToastContainer autoClose={5000} />
                  <Component {...pageProps} />
                  <Analytics />
                  <MusicPlayer />
                </PresenceContextProvider>
              </StatsContextProvider>
            </AudioContextProvider>
          </LanguageContextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </UserContextProvider>
  );
};

export default MyApp;
