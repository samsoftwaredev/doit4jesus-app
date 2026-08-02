import type { ImageProps, ImageStyle } from "expo-image";
import type { ImageSourcePropType, StyleProp } from "react-native";

export type ResponsiveImageSource = ImageSourcePropType;

export interface ResponsiveImageProps
  extends Omit<ImageProps, "source" | "style"> {
  mobileSource: ResponsiveImageSource;
  tabletSource?: ResponsiveImageSource;
  desktopSource?: ResponsiveImageSource;
  preserveAspectRatio?: boolean;
  style?: StyleProp<ImageStyle>;
}
