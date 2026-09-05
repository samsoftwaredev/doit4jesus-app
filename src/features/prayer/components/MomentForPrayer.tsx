import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { OrnateCard } from "./OrnateCard";

type MomentForPrayerProps = {
  mysteryTitle: string;
  onOpenGarden: () => void;
  onPrayToday: () => void;
  weekday: string;
};

/** Renders the prayer-home introduction and today's Rosary call to action. */
export function MomentForPrayer({ mysteryTitle, onOpenGarden, onPrayToday, weekday }: MomentForPrayerProps) {
  const styles = useThemedStyles(styleSheet);

  return (
    <View style={styles.section}>
      <View style={styles.brandRow}>
        <View>
          <Text style={styles.brandEyebrow}>A MOMENT OF PRAYER</Text>
          <Text accessibilityRole="header" style={styles.brand}>
            Rosary
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Open Rosary Garden"
          accessibilityRole="button"
          onPress={onOpenGarden}
          style={styles.gardenButton}
        >
          <Feather
            accessible={false}
            color={theme.rosary.colors.goldBright}
            name="calendar"
            size={theme.sizes.iconMedium}
          />
        </Pressable>
      </View>
      <TodayRosaryCard mysteryTitle={mysteryTitle} onPress={onPrayToday} weekday={weekday} />
    </View>
  );
}

/** Renders the illustrated card that begins today's scheduled Rosary. */
function TodayRosaryCard({
  mysteryTitle,
  onPress,
  weekday,
}: Omit<MomentForPrayerProps, "onOpenGarden" | "onPrayToday"> & {
  onPress: () => void;
}) {
  const styles = useThemedStyles(styleSheet);

  return (
    <OrnateCard style={styles.todayCard}>
      <Image
        accessible={false}
        contentFit="cover"
        source={require("../../../assets/saints/blessed-virgin-mary.png")}
        style={styles.todayImage}
      />
      <LinearGradient colors={theme.colors.gradients.prayerImage} style={StyleSheet.absoluteFill} />
      <View style={styles.todayContent}>
        <View style={styles.todayLabel}>
          <Feather accessible={false} color={theme.rosary.colors.gold} name="calendar" size={theme.sizes.iconSmall} />
          <Text style={styles.sectionLabel}>TODAY&apos;S ROSARY</Text>
        </View>
        <Text style={styles.todayTitle}>{mysteryTitle}</Text>
        <Text style={styles.weekday}>{weekday}</Text>
        <Pressable
          accessibilityLabel={`Pray today's ${mysteryTitle}`}
          accessibilityRole="button"
          onPress={onPress}
          style={({ pressed }) => [styles.todayAction, pressed && styles.pressed]}
        >
          <Text style={styles.todayActionText}>Pray Today&apos;s Rosary</Text>
          <Feather
            accessible={false}
            color={theme.colors.text.inverse}
            name="chevron-right"
            size={theme.sizes.iconSmall}
          />
        </Pressable>
      </View>
    </OrnateCard>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  brand: {
    ...theme.typography.heading2,
    color: theme.colors.text.white,
    fontFamily: theme.fontFamilies.display,
    marginTop: theme.spacing[0.5],
  },
  brandEyebrow: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gardenButton: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.12)",
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  pressed: { opacity: theme.opacity.pressed },
  section: { gap: theme.spacing[4] },
  sectionLabel: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
  },
  todayAction: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    flexDirection: "row",
    gap: theme.spacing[1],
    marginTop: theme.spacing[4],
    minHeight: theme.sizes.buttonHeight,
    paddingHorizontal: theme.spacing[3],
  },
  todayActionText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
  todayCard: { backgroundColor: theme.rosary.colors.cardInset, minHeight: 272 },
  todayContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: theme.spacing[4],
  },
  todayImage: { height: "100%", position: "absolute", right: 0, width: "100%" },
  todayLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[1],
  },
  todayTitle: {
    ...theme.typography.heading1,
    color: theme.colors.text.white,
    fontFamily: theme.fontFamilies.display,
    marginTop: theme.spacing[2],
    maxWidth: "72%",
  },
  weekday: {
    ...theme.typography.bodyMedium,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[1],
  },
}));
