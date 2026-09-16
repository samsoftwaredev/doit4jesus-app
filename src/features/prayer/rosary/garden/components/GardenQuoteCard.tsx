import { Image } from "expo-image";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

const rosaryArtwork = require("../../../../../assets/icons/rosary.png");

/** Renders this feature with colors from the currently resolved app appearance. */
export function GardenQuoteCard() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  return (
    <View accessibilityLabel={t("rosary.garden.quoteLabel")} style={styles.card}>
      <Image accessible={false} contentFit="contain" source={rosaryArtwork} style={styles.rosary} />
      <Text style={styles.quote}>{t("rosary.garden.quote")}</Text>
      <Text style={styles.attribution}>{t("rosary.garden.quoteAttribution")}</Text>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: "rgba(20, 57, 70, 0.8)",
    borderColor: "rgba(230, 186, 100, 0.35)",
    borderRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    justifyContent: "center",
    minHeight: 150,
    overflow: "hidden",
    padding: theme.spacing[4],
  },
  rosary: {
    bottom: -theme.spacing[4],
    height: theme.spacing[16],
    opacity: 0.24,
    position: "absolute",
    right: -theme.spacing[4],
    width: theme.spacing[16],
  },
  quote: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontStyle: "italic",
    lineHeight: theme.lineHeights.lg + theme.spacing[1],
  },
  attribution: { ...theme.typography.labelSmall, color: theme.rosary.colors.gold, marginTop: theme.spacing[3] },
}));
