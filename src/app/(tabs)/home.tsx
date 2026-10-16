import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LayoutChangeEvent, ScrollView } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { HeaderActionGroup } from "@/components/ui";
import { HolyProgressDashboard } from "@/features/dashboard";
import { fetchScreenData } from "@/features/screen-data";
import type { ScreenDataResponse } from "@/features/screen-data";
import { logDevelopmentError } from "@/lib/development-logger";
import { useAppLanguage } from "@/localization";

/** Extracts a single search-parameter value when Expo Router supplies a repeated parameter array. */
function firstSearchParameter(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** Renders the Home dashboard with branded navigation and full-width introductory copy. */
export default function HomeScreen() {
  const router = useRouter();
  const { scrollTo: rawScrollTarget } = useLocalSearchParams<{ scrollTo?: string | string[] }>();
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const [initialData, setInitialData] = useState<ScreenDataResponse>();
  const [isInitialLoadSettled, setIsInitialLoadSettled] = useState(false);
  const [gardenOffsetY, setGardenOffsetY] = useState<number | null>(null);
  const homeScrollViewRef = useRef<ScrollView>(null);
  const hasScrolledToGardenRef = useRef(false);
  const scrollTarget = firstSearchParameter(rawScrollTarget);

  /** Records the Garden position within Home's scroll view for an incoming Garden route target. */
  const handleGardenLayout = useCallback((event: LayoutChangeEvent) => {
    setGardenOffsetY(event.nativeEvent.layout.y);
  }, []);

  useEffect(
    /** Scrolls an incoming Home Garden route to the measured Rosary Garden and clears its one-time target. */
    function scrollToRequestedGarden() {
      if (scrollTarget !== "garden") {
        hasScrolledToGardenRef.current = false;
        return;
      }
      if (gardenOffsetY === null || hasScrolledToGardenRef.current || !homeScrollViewRef.current) return;

      hasScrolledToGardenRef.current = true;
      homeScrollViewRef.current.scrollTo({ animated: true, y: gardenOffsetY });
      router.setParams({ scrollTo: undefined });
    },
    [gardenOffsetY, router, scrollTarget],
  );

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
      .catch((error) => {
        logDevelopmentError("loading Home aggregate data", error);
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
      scrollViewRef={homeScrollViewRef}
    >
      {isInitialLoadSettled ? (
        <HolyProgressDashboard initialData={initialData} onGardenLayout={handleGardenLayout} />
      ) : null}
    </ScreenShell>
  );
}
