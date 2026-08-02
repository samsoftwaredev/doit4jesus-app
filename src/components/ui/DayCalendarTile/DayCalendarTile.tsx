import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image, Text, View } from "react-native";
import blueFlower from "../../../assets/flowers/blueFlower.png";
import mixed from "../../../assets/flowers/mixed.png";
import pinkRose from "../../../assets/flowers/pinkRose.png";
import redRose from "../../../assets/flowers/redRose.png";
import whiteLily from "../../../assets/flowers/whiteLily.png";

import { theme } from "@/theme/tokens";

import { dayCalendarTileStateConfig, styles } from "./DayCalendarTile.styles";
import type {
  DayCalendarFlower,
  DayCalendarTileProps,
  DayCalendarTileState,
} from "./DayCalendarTile.types";

const completedFlowers: DayCalendarFlower[] = [
  "redRose",
  "pinkRose",
  "whiteLily",
  "blueFlower",
  "mixed",
];

const flowerConfig = {
  redRose: { color: theme.colors.accent.red, image: redRose },
  pinkRose: { color: theme.colors.accent.purpleLight, image: pinkRose },
  whiteLily: { color: theme.colors.text.white, image: whiteLily },
  blueFlower: { color: theme.colors.accent.blueLight, image: blueFlower },
  mixed: { color: theme.colors.accent.amber, image: mixed },
} as const;

const stateAccessibilityLabels: Record<
  DayCalendarTileState,
  (day: number) => string
> = {
  completed: (day) => `Day ${day}, rosary completed`,
  current: (day) => `Today, day ${day}, rosary available`,
  future: (day) => `Day ${day}, upcoming`,
  incomplete: (day) => `Day ${day}, rosary not yet completed`,
  unavailable: (day) => `Day ${day}, unavailable`,
};

export function DayCalendarTile({
  day,
  state = "incomplete",
  flowerVariant,
  style,
  accessibilityLabel,
  testID,
}: DayCalendarTileProps) {
  const stateConfig = dayCalendarTileStateConfig[state];
  const isCompleted = state === "completed";
  const isUnavailable = state === "unavailable";
  const flower =
    flowerVariant ?? completedFlowers[Math.abs(day) % completedFlowers.length];
  const flowerStyle = flowerConfig[flower];

  return (
    <View
      accessible
      accessibilityLabel={
        accessibilityLabel ?? stateAccessibilityLabels[state](day)
      }
      style={[
        styles.tile,
        {
          backgroundColor: stateConfig.surfaceColor,
          borderColor: stateConfig.borderColor,
        },
        stateConfig.shadow,
        isUnavailable && styles.unavailable,
        style,
      ]}
      testID={testID}
    >
      {isCompleted ? (
        <View
          style={[
            styles.completionAccent,
            { backgroundColor: stateConfig.accentColor },
          ]}
        />
      ) : null}
      <Text style={[styles.dayNumber, { color: stateConfig.accentColor }]}>
        {day}
      </Text>
      <View style={styles.garden}>
        <View style={styles.soil} />
        {isCompleted ? (
          flower === "mixed" ? (
            <View style={styles.mixedFlowers}>
              <MaterialCommunityIcons
                color={theme.colors.accent.red}
                name="flower-poppy"
                size={theme.sizes.iconSmall}
              />
              <MaterialCommunityIcons
                color={theme.colors.accent.amber}
                name="flower"
                size={theme.sizes.iconMedium}
              />
              <MaterialCommunityIcons
                color={theme.colors.accent.blueLight}
                name="flower-tulip"
                size={theme.sizes.iconSmall}
              />
            </View>
          ) : (
            <Image
              source={flowerStyle.image}
              style={[styles.gardenIcon, { width: 100, height: "100%" }]}
            />
          )
        ) : (
          <MaterialCommunityIcons
            color={stateConfig.accentColor}
            name={state === "current" ? "sprout" : "sprout-outline"}
            size={theme.sizes.iconMedium}
            style={styles.gardenIcon}
          />
        )}
      </View>
      {isCompleted ? (
        <View
          style={[
            styles.checkBadge,
            { backgroundColor: theme.colors.semantic.success },
          ]}
        >
          <MaterialCommunityIcons
            color={theme.colors.text.white}
            name="check"
            size={theme.sizes.iconXs}
          />
        </View>
      ) : null}
    </View>
  );
}
