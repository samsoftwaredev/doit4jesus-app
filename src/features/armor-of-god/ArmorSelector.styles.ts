import { createThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const selectorItemSize = theme.sizes.touchTarget + theme.spacing[4];

export const styles = createThemedStyles((theme) => ({
  content: {
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[4],
  },
  item: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: selectorItemSize,
    justifyContent: "center",
    position: "relative",
    width: selectorItemSize,
  },
  itemSelected: {
    borderColor: theme.colors.gold.pale,
    ...theme.shadows.goldGlow,
  },
  itemLocked: {
    opacity: theme.opacity.muted,
  },
  itemPressed: {
    opacity: theme.opacity.pressed,
  },
  lockBadge: {
    alignItems: "center",
    backgroundColor: theme.colors.semantic.disabled,
    borderRadius: theme.radii.pill,
    bottom: -theme.spacing[1],
    height: theme.sizes.badge,
    justifyContent: "center",
    position: "absolute",
    right: -theme.spacing[1],
    width: theme.sizes.badge,
  },
  statusBadge: {
    alignItems: "center",
    backgroundColor: theme.colors.semantic.success,
    borderRadius: theme.radii.pill,
    bottom: -theme.spacing[1],
    height: theme.sizes.badge,
    justifyContent: "center",
    position: "absolute",
    right: -theme.spacing[1],
    width: theme.sizes.badge,
  },
}));
