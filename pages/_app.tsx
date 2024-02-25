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
import { AccountSetupContextProvider } from "@/context/AccountSetup";
import { AudioContextProvider } from "@/context/AudioContext";
import { PresenceContextProvider } from "@/context/PresenceContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <AccountSetupContextProvider>
            <LanguageContextProvider>
              <AudioContextProvider>
                <PresenceContextProvider>
                  <ToastContainer autoClose={5000} />
                  <Component {...pageProps} />
                  <MusicPlayer />
                </PresenceContextProvider>
              </AudioContextProvider>
            </LanguageContextProvider>
          </AccountSetupContextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </UserContextProvider>
  );
}

export default MyApp;
