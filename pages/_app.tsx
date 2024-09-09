import { useState } from "react";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@emotion/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react";
import { StyledEngineProvider } from "@mui/material/styles";

import { LanguageContextProvider } from "@/context/LanguageContext";
import { theme } from "@/styles/mui-overwrite";
import MusicPlayer from "@/components/MusicPlayer";
import { UserContextProvider } from "@/context/UserContext";
import { AudioContextProvider } from "@/context/AudioContext";
import { PresenceContextProvider } from "@/context/PresenceContext";
import { StatsContextProvider } from "@/context/StatsContext";

import "@/styles/normalize.css";
import "@/styles/global.scss";
import "react-toastify/dist/ReactToastify.css";

const googleKey = process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY!;

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [hideMusicPlayer, setHideMusicPlayer] = useState(true);
  return (
    <UserContextProvider>
      <GoogleOAuthProvider clientId={googleKey}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <LanguageContextProvider>
              <AudioContextProvider
                hideMusicPlayer={hideMusicPlayer}
                setHideMusicPlayer={setHideMusicPlayer}
              >
                <PresenceContextProvider>
                  <StatsContextProvider>
                    <ToastContainer autoClose={5000} />
                    <Component {...pageProps} />
                    <Analytics />
                    <MusicPlayer />
                  </StatsContextProvider>
                </PresenceContextProvider>
              </AudioContextProvider>
            </LanguageContextProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </GoogleOAuthProvider>
    </UserContextProvider>
  );
};

export default MyApp;
