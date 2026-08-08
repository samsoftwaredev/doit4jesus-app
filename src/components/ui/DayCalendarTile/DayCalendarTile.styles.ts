import type { ViewStyle } from "react-native";
import { StyleSheet } from "react-native";

import { theme } from "@/theme/tokens";

import type { DayCalendarTileState } from "./DayCalendarTile.types";

type DayCalendarTileStateConfig = {
  accentColor: string;
  borderColor: string;
  shadow: ViewStyle;
  surfaceColor: string;
};

export const dayCalendarTileStateConfig = {
  completed: {
    accentColor: theme.colors.semantic.success,
    borderColor: theme.colors.semantic.successBorder,
    shadow: theme.shadows.none,
    surfaceColor: theme.colors.surface.green,
  },
  current: {
    accentColor: theme.colors.brand.primaryLight,
    borderColor: theme.colors.border.focus,
    shadow: theme.shadows.focus,
    surfaceColor: theme.colors.surface.secondary,
  },
  future: {
    accentColor: theme.colors.icon.muted,
    borderColor: theme.colors.border.info,
    shadow: theme.shadows.none,
    surfaceColor: theme.colors.surface.navyDeep,
  },
  incomplete: {
    accentColor: theme.colors.icon.secondary,
    borderColor: theme.colors.border.info,
    shadow: theme.shadows.none,
    surfaceColor: theme.colors.surface.navyDeep,
  },
  unavailable: {
    accentColor: theme.colors.text.disabled,
    borderColor: theme.colors.border.subtle,
    shadow: theme.shadows.none,
    surfaceColor: theme.colors.background.deep,
  },
} as const satisfies Record<DayCalendarTileState, DayCalendarTileStateConfig>;

export const styles = StyleSheet.create({
  tile: {
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    flex: 1,
    flexBasis: theme.sizes.touchTarget,
    flexGrow: 1,
    flexShrink: 1,
    minHeight: theme.sizes.touchTarget + theme.spacing[8],
    minWidth: theme.spacing[0],
    overflow: "hidden",
    padding: theme.spacing[2],
    position: "relative",
  },
  unavailable: {
    opacity: theme.opacity.muted,
  },
  future: {
    opacity: theme.opacity.secondary,
  },
  completionAccent: {
    height: theme.borderWidths.thin,
    left: theme.spacing[2],
    position: "absolute",
    right: theme.spacing[2],
    top: theme.spacing[1],
  },
  dayNumber: {
    ...theme.typography.label,
    alignSelf: "center",
    color: theme.colors.text.primary,
  },
  garden: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: theme.spacing[1],
    minHeight: theme.sizes.iconHero + theme.spacing[2],
    overflow: "hidden",
    position: "relative",
  },
  soil: {
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.sm,
    borderWidth: theme.borderWidths.hairline,
    bottom: theme.spacing[0],
    height: theme.sizes.iconMedium,
    left: theme.spacing[0],
    position: "absolute",
    right: theme.spacing[0],
  },
  gardenIcon: {
    alignSelf: "center",
    marginBottom: theme.spacing[0],
    zIndex: theme.zIndex.card,
  },
  mixedFlowers: {
    alignItems: "flex-end",
    alignSelf: "center",
    flexDirection: "row",
    gap: theme.spacing[0.5],
    marginBottom: theme.spacing[1],
    zIndex: theme.zIndex.card,
  },
  checkBadge: {
    alignItems: "center",
    borderColor: theme.colors.surface.green,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.badge,
    justifyContent: "center",
    position: "absolute",
    bottom: theme.spacing[1],
    right: theme.spacing[1],
    width: theme.sizes.badge,
    zIndex: theme.zIndex.dropdown,
  },
});
