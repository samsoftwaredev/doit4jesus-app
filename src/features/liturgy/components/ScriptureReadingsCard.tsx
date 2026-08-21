import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui";
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
}

export function ScriptureReadingsCard({
  completedReadingIds,
  readings,
  onReadingComplete,
  metadata,
  season,
}: ScriptureReadingsCardProps) {
  const completedCount = readings.filter((reading) =>
    completedReadingIds.includes(reading.id),
  ).length;
  const completionPercentage =
    readings.length === 0 ? 0 : (completedCount / readings.length) * 100;
  const [expandedReadingId, setExpandedReadingId] = useState<string | null>(
    null,
  );

  return (
    <Card fullWidth padding="md" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <MaterialCommunityIcons
            color={theme.colors.gold.pale}
            name="book-open-page-variant-outline"
            size={21}
          />
          <Text accessibilityRole="header" style={styles.title}>
            Today&apos;s Scripture Readings
          </Text>
        </View>
        <Text
          accessibilityLabel={`${completedCount} of ${readings.length} readings completed`}
          style={styles.count}
        >
          {completedCount} of {readings.length} completed
        </Text>
      </View>
      <LiturgicalChipList metadata={metadata} season={season} />
      <View
        accessibilityLabel={`${Math.round(completionPercentage)} percent complete`}
        style={styles.progressTrack}
      >
        <View
          style={[styles.progressValue, { width: `${completionPercentage}%` }]}
        />
      </View>
      {readings.length === 0 ? (
        <Text style={styles.empty}>
          Today&apos;s Scripture readings are not available yet.
        </Text>
      ) : (
        <View>
          {readings.map((reading) => (
            <ScriptureReadingRow
              completed={completedReadingIds.includes(reading.id)}
              expanded={expandedReadingId === reading.id}
              key={reading.id}
              onComplete={onReadingComplete}
              onToggle={() => {
                console.log(
                  "Toggling reading",
                  reading.id,
                  "expandedReadingId:",
                  expandedReadingId,
                );
                setExpandedReadingId((current) =>
                  current === reading.id ? null : reading.id,
                );
              }}
              reading={reading}
            />
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: theme.spacing[4] },
  count: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    textAlign: "right",
  },
  empty: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    paddingTop: theme.spacing[5],
    textAlign: "center",
  },
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
    marginRight: theme.spacing[3],
  },
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
    marginLeft: theme.spacing[2],
  },
});
