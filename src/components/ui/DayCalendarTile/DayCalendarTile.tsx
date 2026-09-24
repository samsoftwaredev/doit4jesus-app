import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image, Text, View, type ImageSourcePropType } from "react-native";
import blueFlower from "../../../../assets/images/flowers/blueFlower.png";
import blueHydrangea from "../../../../assets/images/flowers/blueHydrangea.png";
import lavender from "../../../../assets/images/flowers/lavender.png";
import magentaOrchid from "../../../../assets/images/flowers/magentaOrchid.png";
import mixed from "../../../../assets/images/flowers/mixed.png";
import orangeHibiscus from "../../../../assets/images/flowers/orangeHibiscus.png";
import orangeMarigold from "../../../../assets/images/flowers/orangeMarigold.png";
import pinkPeony from "../../../../assets/images/flowers/pinkPeony.png";
import pinkRose from "../../../../assets/images/flowers/pinkRose.png";
import purpleTulip from "../../../../assets/images/flowers/purpleTulip.png";
import redPoppy from "../../../../assets/images/flowers/redPoppy.png";
import redRose from "../../../../assets/images/flowers/redRose.png";
import sunflower from "../../../../assets/images/flowers/sunflower.png";
import whiteDaisy from "../../../../assets/images/flowers/whiteDaisy.png";
import whiteLily from "../../../../assets/images/flowers/whiteLily.png";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { dayCalendarTileStateConfig, styles as styleSheet } from "./DayCalendarTile.styles";
import type { DayCalendarFlower, DayCalendarTileProps, DayCalendarTileState } from "./DayCalendarTile.types";

const completedFlowers: DayCalendarFlower[] = [
  "redRose",
  "pinkRose",
  "whiteLily",
  "blueFlower",
  "mixedFlowers",
  "purpleTulip",
  "sunflower",
  "orangeMarigold",
  "lavender",
  "whiteDaisy",
  "pinkPeony",
  "magentaOrchid",
  "redPoppy",
  "blueHydrangea",
  "orangeHibiscus",
];

const flowerImages = {
  blueHydrangea,
  blueFlower,
  lavender,
  magentaOrchid,
  mixed,
  mixedFlowers: mixed,
  orangeHibiscus,
  orangeMarigold,
  pinkPeony,
  pinkRose,
  purpleTulip,
  redPoppy,
  redRose,
  sunflower,
  whiteDaisy,
  whiteLily,
} as const satisfies Record<DayCalendarFlower, ImageSourcePropType>;

const stateAccessibilityLabels: Record<DayCalendarTileState, (day: number) => string> = {
  completed: (day) => `Day ${day}, rosary completed`,
  current: (day) => `Today, day ${day}, rosary available`,
  future: (day) => `Day ${day}, upcoming`,
  incomplete: (day) => `Day ${day}, rosary not yet completed`,
  unavailable: (day) => `Day ${day}, unavailable`,
};

/** Renders a calendar day with accessible state and full-bleed proportional completion artwork. */
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
      {isCompleted ? (
        <Image
          accessible={false}
          resizeMode="cover"
          source={flowerImages[flower]}
          style={styles.flowerImage}
          testID="day-calendar-flower"
        />
      ) : null}
      <Text style={[styles.dayNumber]}>{day}</Text>
      {!isCompleted ? (
        <View accessible={false} pointerEvents="none" style={styles.reward} testID="day-calendar-reward">
          <MaterialCommunityIcons
            color={stateConfig.accentColor}
            name={state === "current" ? "sprout" : "sprout-outline"}
            size={theme.sizes.iconXs}
            style={styles.sproutIcon}
            testID="day-calendar-sprout"
          />
        </View>
      ) : null}
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
