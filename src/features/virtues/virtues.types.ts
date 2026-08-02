import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

export type VirtueId = "faith" | "discipline" | "courage" | "wisdom" | "charity" | "purity";

export type VirtueTone = VirtueId;

export interface VirtueScore {
  id: VirtueId;
  label: string;
  value: number;
  tone: VirtueTone;
  icon: ImageSourcePropType;
}

export interface VirtueProgressBarProps extends VirtueScore {
  maxValue: number;
}

export interface VirtuesPanelProps {
  virtues?: ReadonlyArray<VirtueScore>;
  maxValue?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
