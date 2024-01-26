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
import { UserContextProvider } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/class/SupabaseDB";
import Loading from "@/components/Loading";

function MyApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<Session | null | undefined>();

  useEffect(() => {
    const getSession = async () => {
      let errorMessage = "No session";
      await supabase.auth
        .getSession()
        .then(async ({ data: { session } }) => {
          if (session) setSession(session);
          else throw new Error(errorMessage);
        })
        .catch((err) => {
          if (err.message === errorMessage) setSession(null);
          console.error(err);
        });
    };
    getSession();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session === null) {
        setSession(session);
      } else if (event === "SIGNED_OUT" && session !== null) {
        setSession(null);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) return <Loading />;

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <UserContextProvider session={session!}>
          <ToastContextProvider>
            <LanguageContextProvider>
              <ToastContainer autoClose={5000} />
              <Component {...pageProps} />
              <MusicPlayer rosary={myRosary} />
            </LanguageContextProvider>
          </ToastContextProvider>
        </UserContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default MyApp;
