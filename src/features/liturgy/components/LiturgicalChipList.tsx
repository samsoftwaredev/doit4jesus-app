import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

import type { DailyLiturgyViewModel } from "../liturgy.types";
import { LiturgicalChip } from "./LiturgicalChip";

interface LiturgicalChipListProps {
  metadata: DailyLiturgyViewModel["metadata"];
  season: string;
}

function displaySeason(value: string) {
  return value.replaceAll("_", " ");
}

export function LiturgicalChipList({ metadata, season }: LiturgicalChipListProps) {
  const [expanded, setExpanded] = useState(false);
  const chips = [
    { icon: "leaf" as const, label: "Season", value: displaySeason(season) },
    metadata.sundayCycle ? { icon: "calendar-star" as const, label: "Sunday", value: `Year ${metadata.sundayCycle}` } : null,
    metadata.weekdayCycle ? { icon: "calendar-week" as const, label: "Weekday", value: `Cycle ${metadata.weekdayCycle}` } : null,
    metadata.psalterWeek ? { icon: "book-open-page-variant-outline" as const, label: "Psalter", value: `Week ${metadata.psalterWeek}` } : null,
  ].filter((chip): chip is NonNullable<typeof chip> => chip !== null);

  return (
    <View style={styles.section}>
      <Pressable
        accessibilityLabel={expanded ? "Hide liturgical details" : "Show liturgical details"}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((current) => !current)}
        style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
      >
        <Text style={styles.title}>Liturgical details</Text>
        <MaterialCommunityIcons color={theme.colors.gold.pale} name={expanded ? "chevron-up" : "chevron-down"} size={21} />
      </Pressable>
      {expanded ? <View style={styles.chips}>{chips.map((chip) => <LiturgicalChip key={chip.label} {...chip} />)}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2], marginTop: theme.spacing[2] },
  pressed: { opacity: theme.opacity.muted },
  section: { marginTop: theme.spacing[2] },
  title: { ...theme.typography.label, color: theme.colors.text.secondary },
  toggle: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", minHeight: 44 },
});
