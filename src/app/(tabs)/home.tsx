import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ScreenShell } from "@/components/screen-shell";
import { HeaderActionGroup } from "@/components/ui";
import { HolyProgressDashboard } from "@/features/dashboard";
import { fetchScreenData } from "@/features/screen-data";
import type { ScreenDataResponse } from "@/features/screen-data";
import { useAppLanguage } from "@/localization";

/** Renders the Home dashboard with branded navigation and full-width introductory copy. */
export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const [initialData, setInitialData] = useState<ScreenDataResponse>();
  const [isInitialLoadSettled, setIsInitialLoadSettled] = useState(false);

  /** Loads Home's initial card data in one authenticated aggregate request. */
  useEffect(() => {
    let active = true;
    void fetchScreenData({
      country: "US",
      diocese: "dallas",
      locale: locale.toLowerCase().startsWith("es") ? "es-MX" : "en-US",
      screen: "home",
    })
      .then((data) => {
        if (active) setInitialData(data);
      })
      .catch(() => {
        // Individual card loaders remain the fallback when aggregate data is unavailable.
      })
      .finally(() => {
        if (active) setIsInitialLoadSettled(true);
      });
    return () => {
      active = false;
    };
  }, [locale]);

  return (
    <ScreenShell
      actions={
        <HeaderActionGroup
          onMessagesPress={() => router.push("/messages")}
          onNotificationsPress={() => router.push("/notifications")}
          onSettingsPress={() => router.push("/settings")}
        />
      }
      description={t("home.description")}
      showLogo
    >
      {isInitialLoadSettled ? <HolyProgressDashboard initialData={initialData} /> : null}
    </ScreenShell>
  );
}
