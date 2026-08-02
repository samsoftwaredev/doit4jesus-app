import type { StyleProp, ViewStyle } from "react-native";

export interface LevelsProgressionProps {
  currentLevel?: number;
  nextLevel?: number;
  checkpointCount?: number;
  completedCheckpoints?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
