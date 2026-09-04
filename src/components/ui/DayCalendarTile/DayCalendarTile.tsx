import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image, Text, View } from "react-native";
import blueFlower from "../../../assets/flowers/blueFlower.png";
import mixed from "../../../assets/flowers/mixed.png";
import pinkRose from "../../../assets/flowers/pinkRose.png";
import redRose from "../../../assets/flowers/redRose.png";
import whiteLily from "../../../assets/flowers/whiteLily.png";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { dayCalendarTileStateConfig, styles as styleSheet } from "./DayCalendarTile.styles";
import type { DayCalendarFlower, DayCalendarTileProps, DayCalendarTileState } from "./DayCalendarTile.types";

const completedFlowers: DayCalendarFlower[] = ["redRose", "pinkRose", "whiteLily", "blueFlower", "mixed"];

const flowerImages = {
  redRose,
  pinkRose,
  whiteLily,
  blueFlower,
  mixed,
  mixedFlowers: mixed,
} as const;

const stateAccessibilityLabels: Record<DayCalendarTileState, (day: number) => string> = {
  completed: (day) => `Day ${day}, rosary completed`,
  current: (day) => `Today, day ${day}, rosary available`,
  future: (day) => `Day ${day}, upcoming`,
  incomplete: (day) => `Day ${day}, rosary not yet completed`,
  unavailable: (day) => `Day ${day}, unavailable`,
};

/** Renders this feature with colors from the currently resolved app appearance. */
export function DayCalendarTile({
  day,
  state = "incomplete",
  flowerVariant,
  style,
  accessibilityLabel,
  testID,
}: DayCalendarTileProps) {
  const styles = useThemedStyles(styleSheet);
  const stateConfig = dayCalendarTileStateConfig[state];
  const isCompleted = state === "completed";
  const isUnavailable = state === "unavailable";
  const flower = flowerVariant ?? completedFlowers[Math.abs(day) % completedFlowers.length];

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? stateAccessibilityLabels[state](day)}
      style={[
        styles.tile,
        {
          backgroundColor: stateConfig.surfaceColor,
          borderColor: stateConfig.borderColor,
        },
        stateConfig.shadow,
        isUnavailable && styles.unavailable,
        state === "future" && styles.future,
        style,
      ]}
      testID={testID}
    >
      {isCompleted ? <View style={[styles.completionAccent, { backgroundColor: stateConfig.accentColor }]} /> : null}
      <Text style={[styles.dayNumber, { color: stateConfig.accentColor }]}>{day}</Text>
      <View accessible={false} pointerEvents="none" style={styles.reward} testID="day-calendar-reward">
        <View style={styles.soil} />
        {isCompleted ? (
          <Image accessible={false} resizeMode="contain" source={flowerImages[flower]} style={styles.rewardIcon} />
        ) : (
          <MaterialCommunityIcons
            color={stateConfig.accentColor}
            name={state === "current" ? "sprout" : "sprout-outline"}
            size={theme.sizes.iconXs}
            style={styles.rewardIcon}
          />
        )}
      </View>
      {isCompleted ? (
        <View
          accessible={false}
          pointerEvents="none"
          style={[styles.checkBadge, { backgroundColor: theme.colors.semantic.success }]}
          testID="day-calendar-completion-check"
        >
          <MaterialCommunityIcons color={theme.colors.text.white} name="check" size={theme.spacing[2.5]} />
        </View>
      ) : null}
    </View>
  );
}
