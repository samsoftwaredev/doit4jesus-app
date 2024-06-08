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
import { GoogleOAuthProvider } from "@react-oauth/google";

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
      </GoogleOAuthProvider>
    </UserContextProvider>
  );
};

export default MyApp;
