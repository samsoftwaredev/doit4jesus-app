import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const maryArtwork = require("../../../../../assets/saints/blessed-virgin-mary.png");
const flowersArtwork = require("../../../../../assets/flowers/whiteFlowerVase.png");

/** Renders the illustrated, borderless header for the unified Rosary Garden card. */
export function GardenHero() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { isLargeText, isNarrowPhone } = useResponsiveLayout();
  const compact = isNarrowPhone;

  return (
    <LinearGradient
      colors={theme.colors.gradients.gardenHero}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[styles.card, compact && styles.compactCard]}
      testID="garden-hero"
    >
      <View style={[styles.copyArea, isLargeText && styles.copyAreaLargeText]}>
        <View style={styles.titleRow}>
          <View accessible={false} style={styles.rosaryIcon}>
            <Feather color={theme.rosary.colors.goldBright} name="circle" size={theme.sizes.iconSmall} />
            <Feather color={theme.rosary.colors.goldBright} name="plus" size={theme.sizes.iconSmall} />
          </View>
          <Text accessibilityRole="header" style={[styles.title, compact && styles.compactTitle]}>
            {t("rosary.garden.title")}
          </Text>
        </View>
        <Text style={[styles.subtitle, compact && styles.compactSubtitle]}>{t("rosary.garden.subtitle")}</Text>
      </View>
      <View
        accessibilityLabel={t("rosary.garden.artworkLabel")}
        style={[styles.artworkArea, isLargeText && styles.artworkAreaLargeText]}
      >
        <Image accessible={false} contentFit="contain" source={flowersArtwork} style={styles.flowerArtwork} />
        <Image accessible={false} contentFit="contain" source={maryArtwork} style={styles.maryArtwork} />
        <LinearGradient
          accessible={false}
          colors={theme.colors.gradients.gardenHeroImage}
          end={{ x: 1, y: 0.5 }}
          start={{ x: 0.25, y: 0.5 }}
          style={styles.artworkFade}
        />
      </View>
    </LinearGradient>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    borderRadius: theme.spacing[0],
    borderWidth: theme.spacing[0],
    flexDirection: "row",
    minHeight: 158,
    overflow: "hidden",
    paddingLeft: theme.spacing[5],
  },
  compactCard: {
    minHeight: 138,
    paddingLeft: theme.spacing[3],
  },
  copyArea: {
    flex: 1.25,
    justifyContent: "center",
    minWidth: 0,
    paddingVertical: theme.spacing[4],
    zIndex: theme.zIndex.card,
  },
  copyAreaLargeText: { flex: 3 },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
  },
  rosaryIcon: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.14)",
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.gold,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    position: "relative",
    width: theme.sizes.touchTarget,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.text.white,
    flexShrink: 1,
    fontFamily: theme.fontFamilies.devotional,
  },
  compactTitle: {
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.lineHeights.xl,
  },
  subtitle: {
    ...theme.typography.body,
    color: "#D3E2DD",
    marginTop: theme.spacing[2],
  },
  compactSubtitle: {
    ...theme.typography.bodySmall,
    marginTop: theme.spacing[1],
  },
  artworkArea: {
    alignSelf: "stretch",
    flex: 0.85,
    minWidth: 92,
    overflow: "hidden",
    position: "relative",
  },
  artworkAreaLargeText: { flex: 0.35, opacity: 0.18 },
  maryArtwork: {
    bottom: -theme.spacing[2],
    height: "108%",
    position: "absolute",
    right: -theme.spacing[2],
    width: "116%",
  },
  flowerArtwork: {
    bottom: -theme.spacing[2],
    height: "50%",
    left: -theme.spacing[3],
    position: "absolute",
    width: "88%",
    zIndex: theme.zIndex.card,
  },
  artworkFade: {
    ...StyleSheet.absoluteFill,
  },
}));
