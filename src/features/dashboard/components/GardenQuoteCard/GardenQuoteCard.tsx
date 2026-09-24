import { Image } from "expo-image";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

const rosaryArtwork = require("../../../../../assets/images/icons/rosary.png");

/** Presents the localized Fatima quotation as a borderless devotional footer. */
export function GardenQuoteCard() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();

  return (
    <View accessibilityLabel={t("rosary.garden.quoteLabel")} style={styles.card} testID="garden-quote-card">
      <Image
        accessible={false}
        contentFit="contain"
        source={rosaryArtwork}
        style={styles.rosary}
        testID="garden-quote-artwork"
      />
      <Text style={styles.quote}>{t("rosary.garden.quote")}</Text>
      <Text style={styles.attribution}>{t("rosary.garden.quoteAttribution")}</Text>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.transparent,
    borderWidth: 0,
    justifyContent: "center",
    minHeight: 130,
    minWidth: theme.spacing[0],
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
