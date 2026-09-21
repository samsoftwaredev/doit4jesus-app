import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button, Card } from "@/components/ui";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type { DailyLiturgyViewModel, DailyReading } from "../liturgy.types";
import { LiturgicalChipList } from "./LiturgicalChipList";
import { ScriptureReadingRow } from "./ScriptureReadingRow";

interface ScriptureReadingsCardProps {
  completedReadingIds: string[];
  readings: DailyReading[];
  onReadingComplete: (readingId: string) => Promise<void>;
  metadata: DailyLiturgyViewModel["metadata"];
  season: string;
  isNavigating?: boolean;
  nextDayDisabled?: boolean;
  nextDate?: string;
  previousDate?: string;
  onNextDay?: () => void;
  onPreviousDay?: () => void;
}

/** Formats an ISO liturgy date without allowing timezone conversion to change the day. */
function formatNavDate(isoDate: string, locale: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Renders daily Scripture readings, their completion progress, and the rewards
 * context while preserving readable header copy on narrow layouts.
 */
export function ScriptureReadingsCard({
  completedReadingIds,
  readings,
  onReadingComplete,
  metadata,
  season,
  isNavigating = false,
  nextDayDisabled = false,
  nextDate,
  previousDate,
  onNextDay,
  onPreviousDay,
}: ScriptureReadingsCardProps) {
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const styles = useThemedStyles(styleSheet);
  const completedCount = readings.filter((reading) => completedReadingIds.includes(reading.id)).length;
  const completionPercentage = readings.length === 0 ? 0 : (completedCount / readings.length) * 100;
  const [expandedReadingId, setExpandedReadingId] = useState<string | null>(null);

  return (
    <Card fullWidth padding="md" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <MaterialCommunityIcons color={theme.colors.gold.pale} name="book-open-page-variant-outline" size={21} />
          <View style={styles.headingCopy}>
            <Text accessibilityRole="header" style={styles.title}>
              {t("liturgy.readings.title")}
            </Text>
            <Text style={styles.description}>{t("liturgy.readings.description")}</Text>
          </View>
        </View>
        <Text
          accessibilityLabel={t("liturgy.readings.completedCountLabel", {
            completed: completedCount,
            total: readings.length,
          })}
          style={styles.count}
        >
          {t("liturgy.readings.completedCount", { completed: completedCount, total: readings.length })}
        </Text>
      </View>
      <LiturgicalChipList metadata={metadata} season={season} />
      <View
        accessibilityLabel={t("liturgy.readings.progressLabel", { percent: Math.round(completionPercentage) })}
        style={styles.progressTrack}
      >
        <View style={[styles.progressValue, { width: `${completionPercentage}%` }]} />
      </View>
      {readings.length === 0 ? (
        <Text style={styles.empty}>{t("liturgy.readings.empty")}</Text>
      ) : (
        <View>
          {readings.map((reading) => (
            <ScriptureReadingRow
              completed={completedReadingIds.includes(reading.id)}
              expanded={expandedReadingId === reading.id}
              key={reading.id}
              onComplete={onReadingComplete}
              onToggle={() => {
                setExpandedReadingId((current) => (current === reading.id ? null : reading.id));
              }}
              reading={reading}
            />
          ))}
        </View>
      )}
      <View style={styles.navigation}>
        <Button
          accessibilityLabel={t("liturgy.readings.previousLabel")}
          disabled={isNavigating || !onPreviousDay}
          leftIcon={<MaterialCommunityIcons color={theme.colors.semantic.success} name="chevron-left" size={18} />}
          onPress={onPreviousDay}
          size="sm"
          style={styles.navigationButton}
          variant="outline"
        >
          {previousDate ? formatNavDate(previousDate, locale) : t("liturgy.readings.previous")}
        </Button>
        <Button
          accessibilityHint={nextDayDisabled ? t("liturgy.readings.nextHint") : undefined}
          accessibilityLabel={t("liturgy.readings.nextLabel")}
          disabled={isNavigating || nextDayDisabled || !onNextDay}
          onPress={onNextDay}
          rightIcon={<MaterialCommunityIcons color={theme.colors.semantic.success} name="chevron-right" size={18} />}
          size="sm"
          style={styles.navigationButton}
          variant="outline"
        >
          {nextDate ? formatNavDate(nextDate, locale) : t("liturgy.readings.next")}
        </Button>
      </View>
    </Card>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: { marginTop: theme.spacing[4] },
  count: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    textAlign: "right",
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0.5],
  },
  empty: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    paddingTop: theme.spacing[5],
    textAlign: "center",
  },
  navigation: {
    flexDirection: "row",
    gap: theme.spacing[3],
    marginTop: theme.spacing[3],
  },
  navigationButton: { flex: 1 },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: theme.spacing[2],
  },
  heading: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    minWidth: 0,
    marginRight: theme.spacing[3],
  },
  headingCopy: { flex: 1, marginLeft: theme.spacing[2], minWidth: 0 },
  progressTrack: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[2],
    backgroundColor: theme.colors.border.subtle,
    borderRadius: theme.radii.pill,
    height: 4,
    overflow: "hidden",
  },
  progressValue: {
    backgroundColor: theme.colors.semantic.success,
    borderRadius: theme.radii.pill,
    height: "100%",
  },
  title: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
  },
}));
