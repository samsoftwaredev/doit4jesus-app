import { StyleSheet } from "react-native";

import { createThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const arenaMaxWidth = theme.spacing[24] * 5;

export const styles = createThemedStyles((theme) => ({
  arena: {
    alignSelf: "center",
    aspectRatio: 1,
    borderColor: theme.colors.semantic.dangerBorder,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    maxWidth: arenaMaxWidth,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  background: {
    ...StyleSheet.absoluteFill,
  },
  demonButton: {
    alignItems: "center",
    // backgroundColor: theme.colors.background.deep,
    // borderColor: theme.colors.border.strong,
    // borderRadius: theme.radii.pill,
    // borderWidth: theme.borderWidths.medium,
    justifyContent: "center",
    overflow: "hidden",
    position: "absolute",
  },
  demonButtonSelected: {
    borderColor: theme.colors.semantic.danger,
    ...theme.shadows.focus,
  },
  demonButtonPressed: {
    opacity: theme.opacity.pressed,
  },
  demonImage: {
    height: "100%",
    width: "100%",
  },
}));
