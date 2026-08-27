import { useWindowDimensions } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp, useReducedMotion } from "react-native-reanimated";

import { theme } from "@/theme/tokens";
import type { RosaryPrayer } from "@/features/prayer/rosary/types";

interface PrayerCardProps {
  prayer?: RosaryPrayer;
}

export function PrayerCard({ prayer }: PrayerCardProps) {
  const reduceMotion = useReducedMotion();
  const { fontScale } = useWindowDimensions();
  const hasText = Boolean(prayer?.text.trim());
  const shouldScroll = fontScale > 1.2;

  return (
    <Animated.View entering={reduceMotion ? undefined : FadeInUp.duration(210)} key={prayer?.id} style={styles.card}>
      <Text style={styles.label}>{prayer?.name?.toUpperCase() ?? "PRAYER"}</Text>
      {hasText ? (
        <ScrollView
          accessibilityLabel={`${prayer?.name ?? "Prayer"} text`}
          contentContainerStyle={styles.prayerScrollContent}
          nestedScrollEnabled
          scrollEnabled={shouldScroll}
          style={[styles.prayerScroll, shouldScroll && styles.scrollablePrayer]}
          showsVerticalScrollIndicator={shouldScroll}
        >
          <Text style={styles.prayerText}>{prayer?.text}</Text>
        </ScrollView>
      ) : (
        <View accessibilityLabel="Prayer text unavailable" style={styles.emptyPrayer}>
          <Text style={styles.emptyPrayerText}>Prayer text will appear here when it is available.</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.rosary.colors.card,
    borderColor: "rgba(230, 186, 100, 0.32)",
    borderRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    padding: theme.spacing[4],
  },
  label: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
  },
  prayerScroll: {
    marginTop: theme.spacing[2],
  },
  scrollablePrayer: {
    maxHeight: 230,
  },
  prayerScrollContent: {
    paddingRight: theme.spacing[2],
  },
  prayerText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    lineHeight: theme.lineHeights.lg + theme.spacing[1],
    textAlign: "left",
  },
  emptyPrayer: {
    marginTop: theme.spacing[2],
  },
  emptyPrayerText: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.scripture,
  },
});
