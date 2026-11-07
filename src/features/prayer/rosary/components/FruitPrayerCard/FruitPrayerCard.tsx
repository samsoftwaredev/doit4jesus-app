import Feather from "@expo/vector-icons/Feather";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { RosaryPrayer } from "@/features/prayer/rosary/types";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

export interface FruitPrayerCardProps {
  fruit?: string;
  fruitDescription?: string;
  hidePrayerWhenEmpty?: boolean;
  prayer?: RosaryPrayer;
  showFruit?: boolean;
}

/** Presents the active prayer and conditionally reveals its mystery fruit within one card. */
export function FruitPrayerCard({
  fruit,
  fruitDescription,
  hidePrayerWhenEmpty = false,
  prayer,
  showFruit = false,
}: FruitPrayerCardProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const hasPrayerText = Boolean(prayer?.text.trim());
  const showPrayer = !hidePrayerWhenEmpty || hasPrayerText;
  const visibleFruit = fruit?.trim() || t("rosary.cards.fruitUnavailable");
  const visibleDescription = fruitDescription?.trim() || t("rosary.cards.reflectionUnavailable");

  if (!showFruit && !showPrayer) return null;

  return (
    <View style={styles.card} testID="fruit-prayer-card">
      {showFruit ? (
        <View
          accessibilityLabel={t("rosary.cards.fruitAccessibilityLabel", {
            description: visibleDescription,
            fruit: visibleFruit,
          })}
        >
          <View style={styles.labelRow}>
            <Feather
              accessible={false}
              color={theme.rosary.colors.immersiveGold}
              name="heart"
              size={theme.sizes.iconSmall}
            />
            <Text style={styles.label}>{t("rosary.cards.fruitLabel")}</Text>
          </View>
          <Text accessibilityRole="header" style={styles.fruit}>
            {visibleFruit}
          </Text>
          <Text style={styles.description}>{visibleDescription}</Text>
        </View>
      ) : null}

      {showFruit && showPrayer ? <View style={styles.sectionDivider} /> : null}

      {showPrayer ? (
        <View key={prayer?.id}>
          <Text style={styles.label}>{prayer?.name?.toUpperCase() ?? t("rosary.cards.prayer").toUpperCase()}</Text>
          {hasPrayerText ? (
            <View
              accessibilityLabel={t("rosary.cards.prayerText", {
                prayer: prayer?.name ?? t("rosary.cards.prayer"),
              })}
              style={styles.prayerBody}
            >
              <Text style={styles.prayerText}>{prayer?.text}</Text>
            </View>
          ) : (
            <View accessibilityLabel={t("rosary.cards.prayerTextUnavailable")} style={styles.emptyPrayer}>
              <Text style={styles.emptyPrayerText}>{t("rosary.cards.prayerTextUnavailableCopy")}</Text>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.rosary.colors.immersiveCard,
    borderRadius: theme.radii.xl,
    minWidth: 0,
    padding: theme.spacing[4],
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
  },
  label: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.immersiveGold,
    flexShrink: 1,
    letterSpacing: theme.letterSpacing.widest,
  },
  fruit: {
    ...theme.typography.heading3,
    color: theme.rosary.colors.immersivePrimary,
    marginTop: theme.spacing[2],
  },
  description: {
    ...theme.typography.body,
    color: theme.rosary.colors.immersiveSecondary,
    lineHeight: theme.lineHeights.lg + theme.spacing[1],
    marginTop: theme.spacing[2],
  },
  sectionDivider: {
    backgroundColor: theme.rosary.colors.goldMuted,
    height: theme.rosary.borderWidths.goldHairline,
    marginVertical: theme.spacing[4],
    opacity: theme.opacity.secondary,
    width: "100%",
  },
  prayerBody: {
    marginTop: theme.spacing[2],
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
