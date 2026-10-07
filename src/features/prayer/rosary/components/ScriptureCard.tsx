import Feather from "@expo/vector-icons/Feather";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

interface ScriptureCardProps {
  reference?: string;
  quotation?: string;
}

/** Renders Scripture in a devotional card with readable colors for the active appearance. */
export function ScriptureCard({ reference, quotation }: ScriptureCardProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const visibleReference = reference || t("rosary.cards.scriptureReferenceUnavailable");
  return (
    <View accessibilityLabel={t("rosary.cards.scriptureLabel", { reference: visibleReference })} style={styles.card}>
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
      <View style={styles.divider} />
      <Text style={styles.quotation}>{quotation || t("rosary.cards.scriptureQuotationUnavailable")}</Text>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.rosary.colors.immersiveCard,
    borderRadius: theme.radii.xl,
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
    letterSpacing: theme.letterSpacing.widest,
  },
  reference: {
    ...theme.typography.bodyMedium,
    color: theme.rosary.colors.immersivePrimary,
    marginTop: theme.spacing[2],
  },
  divider: {
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
