import Feather from "@expo/vector-icons/Feather";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { RosaryMystery } from "@/features/prayer/rosary/types";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

export interface MysteryScriptureCardProps {
  mystery?: RosaryMystery;
  scriptureQuotation?: string;
  scriptureReference?: string;
}

/** Presents the current mystery and active Scripture excerpt within one devotional card. */
export function MysteryScriptureCard({ mystery, scriptureQuotation, scriptureReference }: MysteryScriptureCardProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const visibleReference = scriptureReference || t("rosary.cards.scriptureReferenceUnavailable");

  return (
    <View style={styles.card} testID="mystery-scripture-card">
      {mystery ? (
        <View key={mystery.id}>
          <Text style={styles.label}>{t("rosary.cards.currentMystery")}</Text>
          <Text accessibilityRole="header" style={styles.title}>
            {mystery.title}
          </Text>
          <Text style={styles.category}>{mystery.category}</Text>
        </View>
      ) : (
        <View accessibilityLabel={t("rosary.cards.noMysteryLabel")}>
          <Text style={styles.emptyTitle}>{t("rosary.cards.noMystery")}</Text>
          <Text style={styles.emptyCopy}>{t("rosary.cards.noMysteryCopy")}</Text>
        </View>
      )}

      <View style={styles.sectionDivider} />

      <View accessibilityLabel={t("rosary.cards.scriptureLabel", { reference: visibleReference })}>
        <View style={styles.labelRow}>
          <Feather
            accessible={false}
            color={theme.rosary.colors.immersiveGold}
            name="book-open"
            size={theme.sizes.iconSmall}
          />
          <Text style={styles.label}>{t("rosary.cards.scripture")}</Text>
        </View>
        <Text style={styles.reference}>{visibleReference}</Text>
        <View style={styles.scriptureDivider} />
        <Text style={styles.quotation}>{scriptureQuotation || t("rosary.cards.scriptureQuotationUnavailable")}</Text>
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.rosary.colors.immersiveCard,
    borderRadius: theme.radii.xl,
    minWidth: 0,
    overflow: "hidden",
    padding: theme.spacing[4],
    ...theme.shadows.medium,
  },
  label: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.immersiveGold,
    flexShrink: 1,
    letterSpacing: theme.letterSpacing.widest,
  },
  title: {
    ...theme.typography.heading2,
    color: theme.rosary.colors.immersivePrimary,
    marginTop: theme.spacing[1],
  },
  category: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.immersiveSecondary,
    marginTop: theme.spacing[0.5],
  },
  emptyTitle: {
    ...theme.typography.heading3,
    color: theme.rosary.colors.immersivePrimary,
  },
  emptyCopy: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.immersiveSecondary,
    marginTop: theme.spacing[1],
  },
  sectionDivider: {
    backgroundColor: theme.rosary.colors.goldMuted,
    height: theme.rosary.borderWidths.goldHairline,
    marginVertical: theme.spacing[4],
    opacity: theme.opacity.secondary,
    width: "100%",
  },
  labelRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
  },
  reference: {
    ...theme.typography.bodyMedium,
    color: theme.rosary.colors.immersivePrimary,
    marginTop: theme.spacing[2],
  },
  scriptureDivider: {
    backgroundColor: theme.rosary.colors.goldMuted,
    height: theme.rosary.borderWidths.goldHairline,
    marginVertical: theme.spacing[2],
    opacity: theme.opacity.secondary,
    width: "100%",
  },
  quotation: {
    ...theme.typography.body,
    color: theme.rosary.colors.immersiveSecondary,
    fontStyle: "italic",
    lineHeight: theme.lineHeights.lg + theme.spacing[1],
  },
}));
