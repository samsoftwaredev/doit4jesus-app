import { CssBaseline } from '@mui/material';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { AppProps } from 'next/app';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { MusicPlayer } from '@/components';
import { AudioContextProvider } from '@/context/AudioContext';
import { FriendsContextProvider } from '@/context/FriendsContext';
import { LanguageContextProvider } from '@/context/LanguageContext';
import { PresenceContextProvider } from '@/context/PresenceContext';
import { StatsContextProvider } from '@/context/StatsContext';
import { ThemeContextProvider, useThemeContext } from '@/context/ThemeContext';
import { UserContextProvider } from '@/context/UserContext';
import { getTheme } from '@/styles/mui-overwrite';

import { NAV_APP_LINKS, NAV_MAIN_LINKS } from '../constants';

const googleKey = process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY!;

const AppContent = ({ Component, pageProps }: AppProps) => {
  const { mode } = useThemeContext();
  const theme = getTheme(mode);
  const darkTheme = getTheme('dark');
  const [hideMusicPlayer, setHideMusicPlayer] = useState(true);
  const pathname = usePathname() ?? '';
  const isAuthPage =
    pathname.includes(NAV_MAIN_LINKS.login.link) ||
    pathname.includes(NAV_MAIN_LINKS.signup.link) ||
    pathname.includes(NAV_MAIN_LINKS.register.link) ||
    pathname.includes(NAV_MAIN_LINKS.forgotPassword.link) ||
    pathname.includes(NAV_MAIN_LINKS.updatePassword.link);
  const activeTheme = isAuthPage ? darkTheme : theme;

  const appContextPaths =
    pathname.includes(NAV_APP_LINKS.app.link) ||
    pathname.includes(NAV_MAIN_LINKS.login.link) ||
    pathname.includes(NAV_MAIN_LINKS.signup.link) ||
    pathname.includes(NAV_MAIN_LINKS.register.link) ||
    pathname.includes(NAV_MAIN_LINKS.forgotPassword.link) ||
    pathname.includes(NAV_MAIN_LINKS.updatePassword.link);

  if (appContextPaths) {
    return (
      <>
        <SpeedInsights />
        <CssBaseline />
        <UserContextProvider>
          <GoogleOAuthProvider clientId={googleKey}>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={activeTheme}>
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
      </>
    );
  }

  return (
    <>
      <SpeedInsights />
      <CssBaseline />
      <GoogleOAuthProvider clientId={googleKey}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={activeTheme}>
            <LanguageContextProvider>
              <Component {...pageProps} />
              <Analytics />
            </LanguageContextProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </GoogleOAuthProvider>
    </>
  );
};

const MyApp = (props: AppProps) => {
  return (
    <ThemeContextProvider>
      <AppContent {...props} />
    </ThemeContextProvider>
  );
};

export default MyApp;
