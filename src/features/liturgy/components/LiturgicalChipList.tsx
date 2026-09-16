import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
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

/** Renders this feature with colors from the currently resolved app appearance. */
export function LiturgicalChipList({ metadata, season }: LiturgicalChipListProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const [expanded, setExpanded] = useState(false);
  const chips = [
    { icon: "leaf" as const, label: t("liturgy.details.season"), value: displaySeason(season) },
    metadata.sundayCycle
      ? {
          icon: "calendar-star" as const,
          label: t("liturgy.details.sunday"),
          value: t("liturgy.details.year", { year: metadata.sundayCycle }),
        }
      : null,
    metadata.weekdayCycle
      ? {
          icon: "calendar-week" as const,
          label: t("liturgy.details.weekday"),
          value: t("liturgy.details.cycle", { cycle: metadata.weekdayCycle }),
        }
      : null,
    metadata.psalterWeek
      ? {
          icon: "book-open-page-variant-outline" as const,
          label: t("liturgy.details.psalter"),
          value: t("liturgy.details.week", { week: metadata.psalterWeek }),
        }
      : null,
  ].filter((chip): chip is NonNullable<typeof chip> => chip !== null);

  return (
    <View style={styles.section}>
      <Pressable
        accessibilityLabel={expanded ? t("liturgy.details.hide") : t("liturgy.details.show")}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((current) => !current)}
        style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
      >
        <Text style={styles.title}>{t("liturgy.details.title")}</Text>
        <MaterialCommunityIcons
          color={theme.colors.gold.pale}
          name={expanded ? "chevron-up" : "chevron-down"}
          size={21}
        />
      </Pressable>
      {expanded ? (
        <View style={styles.chips}>
          {chips.map((chip) => (
            <LiturgicalChip key={chip.label} {...chip} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  chips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2], marginTop: theme.spacing[2] },
  pressed: { opacity: theme.opacity.muted },
  section: { marginTop: theme.spacing[2] },
  title: { ...theme.typography.label, color: theme.colors.text.secondary },
  toggle: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", minHeight: 44 },
}));
