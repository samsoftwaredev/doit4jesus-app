import { StyleSheet } from "react-native";

import { theme } from "@/theme/tokens";

const halfFocusMarker = theme.sizes.touchTarget / 2;

export const styles = StyleSheet.create({
  stage: {
    alignSelf: "center",
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    maxWidth: theme.spacing[24] * 4,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  platform: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    bottom: theme.spacing[3],
    height: theme.spacing[6],
    left: "15%",
    position: "absolute",
    right: "15%",
  },
  knight: {
    height: "100%",
    width: "100%",
  },
  focusMarker: {
    alignItems: "center",
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.gold.pale,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.medium,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    marginLeft: -halfFocusMarker,
    marginTop: -halfFocusMarker,
    position: "absolute",
    width: theme.sizes.touchTarget,
    ...theme.shadows.goldGlow,
  },
});
