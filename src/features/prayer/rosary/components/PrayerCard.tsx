import { useTranslation } from "react-i18next";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeInUp, useReducedMotion } from "react-native-reanimated";

import type { RosaryPrayer } from "@/features/prayer/rosary/types";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

interface PrayerCardProps {
  prayer?: RosaryPrayer;
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function PrayerCard({ prayer }: PrayerCardProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { fontScale } = useWindowDimensions();
  const hasText = Boolean(prayer?.text.trim());
  const shouldScroll = fontScale > 1.2;

  return (
    <Animated.View entering={reduceMotion ? undefined : FadeInUp.duration(210)} key={prayer?.id} style={styles.card}>
      <Text style={styles.label}>{prayer?.name?.toUpperCase() ?? t("rosary.cards.prayer").toUpperCase()}</Text>
      {hasText ? (
        <ScrollView
          accessibilityLabel={t("rosary.cards.prayerText", { prayer: prayer?.name ?? t("rosary.cards.prayer") })}
          contentContainerStyle={styles.prayerScrollContent}
          nestedScrollEnabled
          scrollEnabled={shouldScroll}
          style={[styles.prayerScroll, shouldScroll && styles.scrollablePrayer]}
          showsVerticalScrollIndicator={shouldScroll}
        >
          <Text style={styles.prayerText}>{prayer?.text}</Text>
        </ScrollView>
      ) : (
        <View accessibilityLabel={t("rosary.cards.prayerTextUnavailable")} style={styles.emptyPrayer}>
          <Text style={styles.emptyPrayerText}>{t("rosary.cards.prayerTextUnavailableCopy")}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.rosary.colors.immersiveCard,
    borderRadius: theme.radii.xl,
    padding: theme.spacing[4],
  },
  label: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.immersiveGold,
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
    color: theme.rosary.colors.immersivePrimary,
    lineHeight: theme.lineHeights.lg + theme.spacing[1],
    textAlign: "left",
  },
  emptyPrayer: {
    marginTop: theme.spacing[2],
  },
  emptyPrayerText: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.immersiveSecondary,
  },
}));
