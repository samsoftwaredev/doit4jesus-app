import { ThemeProvider } from '@emotion/react';
import { StyledEngineProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MusicPlayer from '@/components/MusicPlayer';
import { AudioContextProvider } from '@/context/AudioContext';
import { FriendsContextProvider } from '@/context/FriendsContext';
import { LanguageContextProvider } from '@/context/LanguageContext';
import { PresenceContextProvider } from '@/context/PresenceContext';
import { StatsContextProvider } from '@/context/StatsContext';
import { UserContextProvider } from '@/context/UserContext';
import '@/styles/global.scss';
import { theme } from '@/styles/mui-overwrite';
import '@/styles/normalize.css';

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
                    <FriendsContextProvider>
                      <ToastContainer autoClose={5000} />
                      <Component {...pageProps} />
                      <Analytics />
                      <MusicPlayer />
                    </FriendsContextProvider>
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
