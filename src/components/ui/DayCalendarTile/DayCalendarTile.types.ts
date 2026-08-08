import type { StyleProp, ViewStyle } from "react-native";

export type DayCalendarTileState =
  | "completed"
  | "current"
  | "future"
  | "incomplete"
  | "unavailable";

export type DayCalendarFlower =
  | "redRose"
  | "pinkRose"
  | "whiteLily"
  | "blueFlower"
  | "mixed"
  | "mixedFlowers";

export interface DayCalendarTileProps {
  day: number;
  state?: DayCalendarTileState;
  flowerVariant?: DayCalendarFlower;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}
