import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import type { LayoutChangeEvent, ScrollView } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { HeaderActionGroup } from "@/components/ui";
import { HolyProgressDashboard } from "@/features/dashboard";
import { fetchScreenData } from "@/features/screen-data";
import type { ScreenDataResponse } from "@/features/screen-data";
import { logDevelopmentError } from "@/lib/development-logger";
import { useAppLanguage } from "@/localization";

/** Quiet period after the last Garden position change before a one-time Garden route target is cleared. */
const GARDEN_SCROLL_SETTLE_MS = 800;

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
  const [dashboardOffsetY, setDashboardOffsetY] = useState(0);
  const [gardenLayoutY, setGardenLayoutY] = useState<number | null>(null);
  const homeScrollViewRef = useRef<ScrollView>(null);
  const hasScrolledToGardenRef = useRef(false);
  const scrollTarget = firstSearchParameter(rawScrollTarget);

  /** Records where the dashboard starts below Home's page header inside the scroll content. */
  const handleDashboardLayout = useCallback((event: LayoutChangeEvent) => {
    setDashboardOffsetY(event.nativeEvent.layout.y);
  }, []);

  /** Records the Garden position within the dashboard, which is relative to the dashboard rather than the scroll view. */
  const handleGardenLayout = useCallback((event: LayoutChangeEvent) => {
    setGardenLayoutY(event.nativeEvent.layout.y);
  }, []);

  // Scroll-content offset of the Garden: the header above the dashboard plus the Garden's offset inside it.
  const gardenOffsetY = gardenLayoutY === null ? null : dashboardOffsetY + gardenLayoutY;

  useEffect(
    /**
     * Scrolls an incoming Home Garden route to the measured Rosary Garden.
     *
     * Cards above the Garden (church reminders, progress, daily Rosary) finish loading after the first layout and
     * push the Garden down, so the scroll is repeated whenever its position changes and the one-time target is only
     * cleared once the position has stopped moving.
     */
    function scrollToRequestedGarden() {
      if (scrollTarget !== "garden") {
        hasScrolledToGardenRef.current = false;
        return;
      }
      if (gardenOffsetY === null || !homeScrollViewRef.current) return;

      homeScrollViewRef.current.scrollTo({ animated: !hasScrolledToGardenRef.current, y: gardenOffsetY });
      hasScrolledToGardenRef.current = true;
      const settleTimer = setTimeout(() => router.setParams({ scrollTo: undefined }), GARDEN_SCROLL_SETTLE_MS);
      return () => clearTimeout(settleTimer);
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
        <View onLayout={handleDashboardLayout} testID="home-dashboard-container">
          <HolyProgressDashboard initialData={initialData} onGardenLayout={handleGardenLayout} />
        </View>
      ) : null}
    </ScreenShell>
  );
}
