import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

export type SpriteSheetAnimationHandle = {
  play: () => void;
  pause: () => void;
  reset: () => void;
  restart: () => void;
  getCurrentFrame: () => number;
};

export interface SpriteSheetAnimationProps {
  /** A local `require(...)` asset or React Native image source. */
  source?: ImageSourcePropType;
  /** Dimensions of one frame, not the whole sheet. */
  frameWidth?: number;
  frameHeight?: number;
  totalFrames?: number;
  fps?: number;
  loop?: boolean;
  autoplay?: boolean;
  style?: StyleProp<ViewStyle>;
  onComplete?: () => void;
}
