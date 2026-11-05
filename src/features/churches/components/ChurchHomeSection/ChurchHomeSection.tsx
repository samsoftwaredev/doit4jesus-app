import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import type { Href } from "expo-router";
import { useCallback, useState } from "react";
import { AppState, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/components";
import { Button, Card } from "@/components/ui";
import { useResponsiveLayout } from "@/hooks";
import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { getChurchSubscriptions, getUpcomingChurchServices } from "../../churches.api";
import type { ChurchSubscription, UpcomingChurchService } from "../../churches.types";

const EUCHARIST_BACKGROUND =
  require("../../../../../assets/images/churches/eucharist-invitation-oil-painting.jpg") as number;

export type ChurchHomeSectionProps = {
  now?: Date;
};

/** Formats an instant as a stable local calendar key in the church's timezone. */
function getDateKey(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

/** Advances an ISO calendar key by one day without relying on a 24-hour DST-sensitive duration. */
function getNextDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const nextDate = new Date(Date.UTC(year!, month! - 1, day! + 1));
  return nextDate.toISOString().slice(0, 10);
}

/** Produces localized Today, Tomorrow, or dated occurrence copy in the church's timezone. */
function formatOccurrence(
  occurrence: UpcomingChurchService,
  now: Date,
  locale: string,
  translate: (key: string, options?: Record<string, unknown>) => string,
): string {
  const startsAt = new Date(occurrence.startsAt);
  const service = translate(`churches.services.${occurrence.serviceType}`);
  const time = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: occurrence.timezone,
  }).format(startsAt);
  const occurrenceKey = getDateKey(startsAt, occurrence.timezone);
  const todayKey = getDateKey(now, occurrence.timezone);
  const tomorrowKey = getNextDateKey(todayKey);
  if (occurrenceKey === todayKey) return translate("churches.home.occurrenceToday", { service, time });
  if (occurrenceKey === tomorrowKey) return translate("churches.home.occurrenceTomorrow", { service, time });
  const date = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    timeZone: occurrence.timezone,
  }).format(startsAt);
  return translate("churches.home.occurrenceDate", { date, service, time });
}

/** Loads Home church reminders and renders either the Eucharistic invitation or upcoming-service management. */
export function ChurchHomeSection({ now }: ChurchHomeSectionProps) {
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const { i18n, t } = useTranslation();
  const { isNarrowPhone } = useResponsiveLayout();
  const [subscriptions, setSubscriptions] = useState<ChurchSubscription[] | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingChurchService[]>([]);
  const [hasError, setHasError] = useState(false);
  const [currentNow, setCurrentNow] = useState(() => now ?? new Date());
  const locale = i18n.resolvedLanguage === "es" ? "es-MX" : "en-US";

  /** Refreshes subscriptions first so the invitation never depends on an unnecessary occurrence request. */
  const loadChurchHome = useCallback(async () => {
    setHasError(false);
    const referenceNow = now ?? new Date();
    setCurrentNow(referenceNow);
    try {
      const nextSubscriptions = await getChurchSubscriptions();
      setSubscriptions(nextSubscriptions);
      if (nextSubscriptions.length === 0) {
        setUpcoming([]);
        return;
      }
      const services = await getUpcomingChurchServices({ days: 7, limit: 50, offset: 0 });
      setUpcoming(
        [...services.data]
          .filter((service) => new Date(service.startsAt).getTime() >= referenceNow.getTime())
          .sort((left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt))
          .slice(0, 3),
      );
    } catch (error) {
      logDevelopmentError("loading church reminders on Home", error);
      setHasError(true);
      setSubscriptions(null);
    }
  }, [now]);

  useFocusEffect(
    useCallback(() => {
      void loadChurchHome();
      const subscription = AppState.addEventListener("change", (state) => {
        if (state === "active") void loadChurchHome();
      });
      return () => subscription.remove();
    }, [loadChurchHome]),
  );

  /** Opens full-screen church discovery. */
  function openChurchDiscovery(): void {
    router.push("/churches" as Href);
  }

  /** Opens reminder preferences directly for an already subscribed user. */
  function openReminderReview(): void {
    router.push("/churches/reminders" as Href);
  }

  if (hasError) {
    return (
      <Card title={t("churches.home.manageTitle")}>
        <View style={styles.stack}>
          <Text accessibilityRole="alert" style={styles.muted}>
            {t("churches.home.error")}
          </Text>
          <Button onPress={() => void loadChurchHome()} variant="outline">
            {t("common.retry")}
          </Button>
        </View>
      </Card>
    );
  }

  if (subscriptions === null) {
    return <View accessibilityLabel={t("churches.search.searching")} style={styles.loading} />;
  }

  if (subscriptions.length === 0) {
    const benefits = ["mass", "confession", "adoration", "reminders"] as const;
    return (
      <View style={styles.invitationFrame}>
        <Image
          accessible={false}
          contentFit="cover"
          contentPosition="right center"
          pointerEvents="none"
          source={EUCHARIST_BACKGROUND}
          style={styles.invitationBackground}
          testID="church-invitation-background"
        />
        <View accessible={false} pointerEvents="none" style={styles.invitationOverlay} />
        <Card
          footer={
            <Button fullWidth onPress={openChurchDiscovery}>
              {t("churches.invitation.action")}
            </Button>
          }
          header={
            <View style={styles.invitationHeaderCopy} testID="church-invitation-header">
              <Text
                accessibilityRole="header"
                style={[styles.invitationTitle, isNarrowPhone && styles.invitationTitleCompact]}
              >
                {t("churches.invitation.title")}
              </Text>
              <Text style={[styles.invitationSubtitle, isNarrowPhone && styles.invitationSubtitleCompact]}>
                {t("churches.invitation.subtitle")}
              </Text>
            </View>
          }
          headerStyle={[styles.invitationHeader, isNarrowPhone && styles.invitationHeaderCompact]}
          style={styles.invitationCard}
        >
          <View style={styles.stack}>
            <Text style={styles.invitationDescription}>{t("churches.invitation.description")}</Text>
            {benefits.map((benefit) => (
              <View key={benefit} style={styles.benefit}>
                <Feather accessible={false} color={theme.colors.accent.amberLight} name="check-circle" size={18} />
                <Text style={styles.benefitText}>{t(`churches.invitation.${benefit}`)}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>
    );
  }

  const hasPendingSchedule = subscriptions.some((subscription) => !subscription.scheduleReady);
  return (
    <View style={styles.cards}>
      <View style={styles.upcomingFrame}>
        <Image
          accessible={false}
          contentFit="cover"
          contentPosition="right center"
          pointerEvents="none"
          source={EUCHARIST_BACKGROUND}
          style={styles.upcomingBackground}
          testID="church-upcoming-background"
        />
        <View accessible={false} pointerEvents="none" style={styles.upcomingOverlay} />
        <Card
          headerRight={
            <View style={styles.headerActions}>
              <IconButton accessibilityLabel={t("churches.search.title")} onPress={openChurchDiscovery}>
                <Feather accessible={false} color={theme.colors.icon.primary} name="search" size={20} />
              </IconButton>
              <IconButton accessibilityLabel={t("churches.home.manageAction")} onPress={openReminderReview}>
                <Feather accessible={false} color={theme.colors.icon.primary} name="settings" size={20} />
              </IconButton>
            </View>
          }
          style={styles.upcomingCard}
          title={t("churches.home.upcomingTitle")}
          titleStyle={styles.upcomingTitle}
        >
          <View style={styles.stack}>
            {upcoming.map((occurrence) => (
              <View
                accessibilityLabel={formatOccurrence(occurrence, currentNow, locale, t)}
                key={occurrence.id}
                style={styles.row}
              >
                <Feather accessible={false} color={theme.colors.accent.amberLight} name="calendar" size={20} />
                <View style={styles.rowCopy}>
                  <Text style={styles.upcomingOccurrence}>{formatOccurrence(occurrence, currentNow, locale, t)}</Text>
                  <Text style={styles.upcomingMuted}>{occurrence.churchName}</Text>
                </View>
              </View>
            ))}
            {upcoming.length === 0 ? (
              <View style={styles.stack}>
                <Text style={styles.upcomingOccurrence}>
                  {t(hasPendingSchedule ? "churches.home.pending" : "churches.home.empty")}
                </Text>
                {hasPendingSchedule ? (
                  <Text style={styles.upcomingMuted}>{t("churches.home.pendingDescription")}</Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </Card>
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  benefit: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2], minWidth: 0 },
  benefitText: { ...theme.typography.body, color: theme.colors.text.white, flex: 1 },
  cards: { gap: theme.spacing[3] },
  headerActions: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2] },
  invitationBackground: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  invitationCard: { backgroundColor: "transparent" },
  invitationDescription: { ...theme.typography.bodySmall, color: theme.colors.text.white },
  invitationFrame: { borderRadius: theme.radii.md, overflow: "hidden", position: "relative" },
  invitationHeader: {
    borderBottomWidth: 0,
    margin: 0,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[4],
  },
  invitationHeaderCompact: { paddingHorizontal: theme.spacing[3] },
  invitationHeaderCopy: { borderBottomWidth: 0, justifyContent: "center", minWidth: 0 },
  invitationOverlay: {
    backgroundColor: "rgba(4, 13, 21, 0.68)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  invitationSubtitle: {
    ...theme.typography.body,
    color: theme.colors.text.white,
    marginTop: theme.spacing[2],
  },
  invitationSubtitleCompact: { ...theme.typography.bodySmall, marginTop: theme.spacing[1] },
  invitationTitle: {
    ...theme.typography.heading1,
    color: theme.colors.text.white,
    fontFamily: theme.fontFamilies.devotional,
  },
  invitationTitleCompact: { fontSize: theme.fontSizes.xl, lineHeight: theme.lineHeights.xl },
  loading: { minHeight: theme.sizes.touchTarget },
  muted: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
  occurrence: { ...theme.typography.body, color: theme.colors.text.primary, fontWeight: "700" },
  row: { alignItems: "center", flexDirection: "row", gap: theme.spacing[3], minWidth: 0 },
  rowCopy: { flex: 1, gap: theme.spacing[1], minWidth: 0 },
  stack: { gap: theme.spacing[3] },
  upcomingBackground: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  upcomingCard: { backgroundColor: "transparent" },
  upcomingFrame: { borderRadius: theme.radii.md, overflow: "hidden", position: "relative" },
  upcomingMuted: { ...theme.typography.bodySmall, color: theme.colors.text.white },
  upcomingOccurrence: { ...theme.typography.body, color: theme.colors.text.white, fontWeight: "700" },
  upcomingOverlay: {
    backgroundColor: "rgba(4, 13, 21, 0.72)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  upcomingTitle: { color: theme.colors.text.white },
}));
