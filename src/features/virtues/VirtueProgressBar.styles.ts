import { StyleSheet } from "react-native";

import { theme } from "@/theme/tokens";

import type { VirtueTone } from "./virtues.types";

export const virtueToneColors = {
  faith: theme.colors.accent.blueLight,
  discipline: theme.colors.semantic.success,
  courage: theme.colors.accent.red,
  wisdom: theme.colors.accent.purpleLight,
  charity: theme.colors.accent.redLight,
  purity: theme.colors.text.white,
} as const satisfies Record<VirtueTone, string>;

export const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[1],
  },
  identity: {
    alignItems: "center",
    flexBasis: theme.spacing[0],
    flexDirection: "row",
    flexGrow: 1,
    minWidth: theme.spacing[0],
  },
  iconFrame: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    height: theme.sizes.iconXL + theme.spacing[2],
    width: theme.sizes.iconXL + theme.spacing[2],
  },
  iconImage: {
    height: "100%",
    width: "100%",
  },
  label: {
    ...theme.typography.bodyMedium,
    flexShrink: 1,
    marginLeft: theme.spacing[2],
  },
  progressTrack: {
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.xs,
    borderWidth: theme.borderWidths.hairline,
    flex: 1,
    height: theme.spacing[5],
    minWidth: theme.spacing[0],
    overflow: "hidden",
  },
  progressFill: {
    borderRadius: theme.radii.xs,
    height: "100%",
  },
  progressHighlight: {
    backgroundColor: theme.colors.text.white,
    height: theme.borderWidths.hairline,
    left: theme.spacing[1],
    opacity: theme.opacity.secondary,
    position: "absolute",
    right: theme.spacing[1],
    top: theme.spacing[0],
  },
  score: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.secondary,
    textAlign: "right",
    width: theme.spacing[14],
  },
});
