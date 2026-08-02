import type { StyleProp, ViewStyle } from "react-native";

export interface DailyPracticeCardProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
