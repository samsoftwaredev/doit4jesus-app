import { StyleSheet } from "react-native";

import { theme } from "@/theme/tokens";

const arenaMaxWidth = theme.spacing[24] * 5;
const demonButtonSize = theme.spacing[20];
const demonButtonHalf = demonButtonSize * 1.6;

export const styles = StyleSheet.create({
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
    height: 250,
    // backgroundColor: theme.colors.background.deep,
    // borderColor: theme.colors.border.strong,
    // borderRadius: theme.radii.pill,
    // borderWidth: theme.borderWidths.medium,
    justifyContent: "center",
    marginLeft: -demonButtonHalf,
    marginTop: -demonButtonHalf,
    overflow: "hidden",
    position: "absolute",
    width: 250,
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
});
