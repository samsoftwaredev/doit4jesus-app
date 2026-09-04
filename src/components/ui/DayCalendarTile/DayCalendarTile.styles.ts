import type { ViewStyle } from "react-native";

import { createThemedStyles, createThemedValue } from "@/theme/createThemedStyles";

import type { DayCalendarTileState } from "./DayCalendarTile.types";

type DayCalendarTileStateConfig = {
  accentColor: string;
  borderColor: string;
  shadow: ViewStyle;
  surfaceColor: string;
};

export const dayCalendarTileStateConfig = createThemedValue(
  (theme) =>
    ({
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
    }) as const satisfies Record<DayCalendarTileState, DayCalendarTileStateConfig>,
);

export const styles = createThemedStyles((theme) => ({
  tile: {
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
    padding: theme.spacing[1],
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
    left: theme.spacing[1],
    position: "absolute",
    right: theme.spacing[1],
    top: theme.spacing[0.5],
  },
  dayNumber: {
    ...theme.typography.label,
    alignSelf: "center",
    color: theme.colors.text.primary,
    zIndex: theme.zIndex.card,
  },
  reward: {
    alignItems: "center",
    bottom: theme.spacing[0.5],
    height: theme.sizes.iconSmall,
    justifyContent: "flex-end",
    left: theme.spacing[0.5],
    overflow: "hidden",
    position: "absolute",
    right: theme.spacing[0.5],
  },
  soil: {
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.sm,
    borderWidth: theme.borderWidths.hairline,
    bottom: theme.spacing[0],
    height: theme.spacing[2],
    left: theme.spacing[0],
    position: "absolute",
    right: theme.spacing[0],
  },
  rewardIcon: {
    height: theme.sizes.iconXs,
    width: theme.sizes.iconXs,
    zIndex: theme.zIndex.card,
  },
  checkBadge: {
    alignItems: "center",
    borderColor: theme.colors.surface.green,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    bottom: theme.spacing[0.5],
    height: theme.sizes.iconXs,
    justifyContent: "center",
    position: "absolute",
    right: theme.spacing[0.5],
    width: theme.sizes.iconXs,
    zIndex: theme.zIndex.dropdown,
  },
}));
