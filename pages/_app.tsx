import type { AppProps } from "next/app";
import { LanguageContextProvider } from "@/context/LanguageContext";
import { ToastContextProvider } from "@/context/ToastContext";
import { theme } from "@/styles/mui-overwrite";
import "../styles/globals.scss";
import { ThemeRegistry } from "@/components";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeRegistry options={{ key: "mui", prepend: true }}>
      <ToastContextProvider>
        <LanguageContextProvider>
          <Component {...pageProps} />
        </LanguageContextProvider>
      </ToastContextProvider>
    </ThemeRegistry>
  );
}

export default MyApp;
