import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { theme } from "@/theme/tokens";

const lilyArtwork = require("../../assets/flowers/whiteLily.png");

export function GardenMotivationCard() {
  const { width } = useWindowDimensions();
  const compact = width < theme.breakpoints.largePhone;
  return (
    <View style={styles.card}>
      <LinearGradient accessible={false} colors={["rgba(230, 186, 100, 0.26)", "transparent"]} style={styles.rays} />
      <View style={styles.flowerPot}>
        <Image accessible={false} contentFit="contain" source={lilyArtwork} style={styles.lily} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Plant Today’s Flower</Text>
        <Text style={styles.subtitle}>Pray your rosary and help{"\n"}Our Lady’s garden grow.</Text>
      </View>
      {!compact ? (
        <View style={styles.virtueCard}>
          <Feather
            accessible={false}
            color={theme.colors.brand.primaryLight}
            name="feather"
            size={theme.sizes.iconSmall}
          />
          <Text style={styles.virtueText}>Grow in faith.{"\n"}Bloom in virtue.</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#123D43",
    borderColor: "rgba(230, 186, 100, 0.36)",
    borderRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    flexDirection: "row",
    minHeight: 120,
    overflow: "hidden",
    padding: theme.spacing[3],
  },
  rays: { ...StyleSheet.absoluteFill, opacity: theme.opacity.secondary },
  flowerPot: {
    alignItems: "center",
    backgroundColor: "rgba(9, 31, 42, 0.42)",
    borderRadius: theme.radii.lg,
    height: theme.spacing[16],
    justifyContent: "center",
    width: theme.spacing[14],
    zIndex: theme.zIndex.card,
  },
  lily: { height: "100%", width: "100%" },
  copy: { flex: 1, minWidth: 0, paddingHorizontal: theme.spacing[3], zIndex: theme.zIndex.card },
  title: { ...theme.typography.heading3, color: theme.colors.text.white },
  subtitle: { ...theme.typography.bodySmall, color: "#D0E0D9", marginTop: theme.spacing[1] },
  virtueCard: {
    alignItems: "center",
    borderColor: theme.colors.brand.primaryLight,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    justifyContent: "center",
    minHeight: theme.spacing[16],
    paddingHorizontal: theme.spacing[2],
    zIndex: theme.zIndex.card,
  },
  virtueText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
});
