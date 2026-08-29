import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

import { liturgicalTheme } from "../liturgicalTheme";
import type { DailyLiturgyViewModel } from "../liturgy.types";
import { DailyMassHeader } from "./DailyMassHeader";

interface CelebrationHeroCardProps {
  celebration: DailyLiturgyViewModel["celebration"];
  date: string;
  onCalendarPress?: () => void;
}

function displaySeason(season: string) {
  return season.replaceAll("_", " ");
}

function displayGrade(grade: string) {
  return grade.replaceAll("_", " ");
}

export function CelebrationHeroCard({ celebration, date, onCalendarPress }: CelebrationHeroCardProps) {
  const colors = liturgicalTheme[celebration.liturgicalColor];

  return (
    <View
      accessibilityLabel={`Celebration: ${celebration.name}. Liturgical color ${celebration.liturgicalColor.toLowerCase()}.`}
      style={[styles.card, { borderColor: colors.border, shadowColor: colors.accent }]}
    >
      <LinearGradient
        colors={["rgba(29, 62, 91, 0.88)", "rgba(10, 30, 48, 0.98)"]}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        style={styles.gradient}
      />
      <View pointerEvents="none" style={[styles.glow, { backgroundColor: colors.glow }]} />
      <DailyMassHeader date={date} onCalendarPress={onCalendarPress} />
      <View style={styles.copy}>
        <View style={styles.seasonRow}>
          <View style={[styles.accentLine, { backgroundColor: colors.accent }]} />
          <Text style={[styles.season, { color: colors.label }]}>{displaySeason(celebration.season)}</Text>
        </View>
        <Text accessibilityRole="header" style={styles.title}>
          {celebration.name}
        </Text>
        <View style={styles.gradeRow}>
          <MaterialCommunityIcons color={colors.accent} name="church-outline" size={16} />
          <Text style={styles.grade}>{displayGrade(celebration.grade)}</Text>
        </View>
        <Text style={styles.devotion}>Receive today&apos;s Word with a quiet and faithful heart.</Text>
      </View>
      <Image
        accessible={false}
        contentFit="contain"
        source={require("../../../assets/saints/blessed-virgin-mary.png")}
        style={styles.mary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  accentLine: { borderRadius: theme.radii.pill, height: 4, width: 28 },
  card: {
    backgroundColor: theme.colors.surface.navy,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.medium,
    elevation: 3,
    marginTop: theme.spacing[4],
    minHeight: 220,
    overflow: "hidden",
    padding: theme.spacing[5],
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
  },
  copy: { flex: 1, paddingRight: theme.spacing[16], zIndex: 1 },
  devotion: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    lineHeight: theme.lineHeights.md,
    marginTop: theme.spacing[4],
  },
  glow: { borderRadius: theme.radii.pill, height: 176, position: "absolute", right: -64, top: -56, width: 176 },
  gradient: { ...StyleSheet.absoluteFill },
  grade: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, marginLeft: theme.spacing[1.5] },
  gradeRow: { alignItems: "center", flexDirection: "row", marginTop: theme.spacing[3] },
  mary: { bottom: -12, height: 190, opacity: 0.82, position: "absolute", right: -18, width: 146 },
  season: { ...theme.typography.label, letterSpacing: theme.letterSpacing.widest, textTransform: "uppercase" },
  seasonRow: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2], marginBottom: theme.spacing[3] },
  title: {
    ...theme.typography.heading1,
    fontFamily: theme.fontFamilies.devotional,
    fontWeight: theme.fontWeights.bold,
    maxWidth: 260,
  },
});
