import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect, useRouter } from "expo-router";
import type { Href } from "expo-router";
import { useCallback, useState } from "react";
import { AppState, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/components";
import { Button, Card } from "@/components/ui";
import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { getChurchSubscriptions, getUpcomingChurchServices } from "../../churches.api";
import type { ChurchSubscription, UpcomingChurchService } from "../../churches.types";

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

/** Loads Home church reminders and exposes reminder management from the upcoming-services header. */
export function ChurchHomeSection({ now }: ChurchHomeSectionProps) {
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const { i18n, t } = useTranslation();
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

  /** Opens the protected discovery and reminder-management route. */
  function openChurches(): void {
    router.push("/churches" as Href);
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
      <Card
        footer={
          <Button fullWidth onPress={openChurches}>
            {t("churches.invitation.action")}
          </Button>
        }
        title={t("churches.invitation.title")}
      >
        <View style={styles.stack}>
          <Text style={styles.muted}>{t("churches.invitation.description")}</Text>
          {benefits.map((benefit) => (
            <View key={benefit} style={styles.benefit}>
              <Feather accessible={false} color={theme.colors.semantic.success} name="check-circle" size={18} />
              <Text style={styles.benefitText}>{t(`churches.invitation.${benefit}`)}</Text>
            </View>
          ))}
        </View>
      </Card>
    );
  }

  const hasPendingSchedule = subscriptions.some((subscription) => !subscription.scheduleReady);
  return (
    <View style={styles.cards}>
      <Card
        headerRight={
          <IconButton accessibilityLabel={t("churches.home.manageAction")} onPress={openChurches}>
            <Feather accessible={false} color={theme.colors.icon.primary} name="settings" size={20} />
          </IconButton>
        }
        title={t("churches.home.upcomingTitle")}
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
                <Text style={styles.occurrence}>{formatOccurrence(occurrence, currentNow, locale, t)}</Text>
                <Text style={styles.muted}>{occurrence.churchName}</Text>
              </View>
            </View>
          ))}
          {upcoming.length === 0 ? (
            <View style={styles.stack}>
              <Text style={styles.occurrence}>
                {t(hasPendingSchedule ? "churches.home.pending" : "churches.home.empty")}
              </Text>
              {hasPendingSchedule ? <Text style={styles.muted}>{t("churches.home.pendingDescription")}</Text> : null}
            </View>
          ) : null}
        </View>
      </Card>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  benefit: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2], minWidth: 0 },
  benefitText: { ...theme.typography.body, color: theme.colors.text.primary, flex: 1 },
  cards: { gap: theme.spacing[3] },
  loading: { minHeight: theme.sizes.touchTarget },
  muted: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
  occurrence: { ...theme.typography.body, color: theme.colors.text.primary, fontWeight: "700" },
  row: { alignItems: "center", flexDirection: "row", gap: theme.spacing[3], minWidth: 0 },
  rowCopy: { flex: 1, gap: theme.spacing[1], minWidth: 0 },
  stack: { gap: theme.spacing[3] },
}));
