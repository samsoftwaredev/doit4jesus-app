import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

type OrnateCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

/** Renders this feature with colors from the currently resolved app appearance. */
export function OrnateCard({ children, style }: OrnateCardProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <View style={[styles.card, style]}>
      <View pointerEvents="none" style={[styles.corner, styles.topLeft]} />
      <View pointerEvents="none" style={[styles.corner, styles.topRight]} />
      <View pointerEvents="none" style={[styles.corner, styles.bottomLeft]} />
      <View pointerEvents="none" style={[styles.corner, styles.bottomRight]} />
      {children}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  bottomLeft: { borderRightWidth: 0, borderTopWidth: 0, bottom: theme.spacing[2], left: theme.spacing[2] },
  bottomRight: { borderLeftWidth: 0, borderTopWidth: 0, bottom: theme.spacing[2], right: theme.spacing[2] },
  card: {
    borderColor: "rgba(230, 186, 100, 0.62)",
    borderRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    overflow: "hidden",
    position: "relative",
  },
  corner: {
    borderColor: "rgba(255, 224, 154, 0.85)",
    borderWidth: theme.rosary.borderWidths.gold,
    height: theme.spacing[3],
    position: "absolute",
    width: theme.spacing[3],
    zIndex: 1,
  },
  topLeft: { borderBottomWidth: 0, borderRightWidth: 0, left: theme.spacing[2], top: theme.spacing[2] },
  topRight: { borderBottomWidth: 0, borderLeftWidth: 0, right: theme.spacing[2], top: theme.spacing[2] },
}));
