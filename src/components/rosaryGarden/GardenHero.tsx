import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { theme } from "@/theme/tokens";

const maryArtwork = require("../../assets/saints/blessed-virgin-mary.png");
const flowersArtwork = require("../../assets/flowers/whiteFlowerVase.png");

export function GardenHero() {
  const { width } = useWindowDimensions();
  const compact = width < theme.breakpoints.smallPhone;

  return (
    <LinearGradient
      colors={["#153F4C", "#0F3144", "#0A2338"]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[styles.card, compact && styles.compactCard]}
    >
      <View style={styles.copyArea}>
        <View style={styles.titleRow}>
          <View accessible={false} style={styles.rosaryIcon}>
            <Feather color={theme.rosary.colors.goldBright} name="circle" size={theme.sizes.iconSmall} />
            <Feather color={theme.rosary.colors.goldBright} name="plus" size={theme.sizes.iconSmall} />
          </View>
          <Text accessibilityRole="header" style={[styles.title, compact && styles.compactTitle]}>
            Rosary Garden
          </Text>
        </View>
        <Text style={[styles.subtitle, compact && styles.compactSubtitle]}>
          Complete a rosary each day{"\n"}to make the garden bloom.
        </Text>
      </View>
      <View accessibilityLabel="Devotional artwork of the Blessed Virgin Mary surrounded by flowers" style={styles.artworkArea}>
        <Image accessible={false} contentFit="contain" source={flowersArtwork} style={styles.flowerArtwork} />
        <Image accessible={false} contentFit="contain" source={maryArtwork} style={styles.maryArtwork} />
        <LinearGradient
          accessible={false}
          colors={["transparent", "rgba(10, 35, 56, 0.94)"]}
          end={{ x: 1, y: 0.5 }}
          start={{ x: 0.25, y: 0.5 }}
          style={styles.artworkFade}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: "rgba(230, 186, 100, 0.5)",
    borderRadius: theme.radii["2xl"],
    borderWidth: theme.rosary.borderWidths.goldHairline,
    flexDirection: "row",
    minHeight: 158,
    overflow: "hidden",
    paddingLeft: theme.spacing[5],
    ...theme.shadows.large,
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
});
