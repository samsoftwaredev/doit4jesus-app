import { createThemedStyles } from "@/theme/createThemedStyles";

export const styles = createThemedStyles((theme) => ({
  group: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: theme.colors.surface.navigation,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    gap: theme.spacing[1],
    padding: theme.spacing[0.5],
    ...theme.shadows.small,
  },
  action: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  pressed: {
    opacity: theme.opacity.pressed,
    transform: [{ scale: 0.98 }],
  },
  focused: {
    borderColor: theme.colors.border.focus,
    ...theme.shadows.focus,
  },
  disabled: {
    opacity: theme.opacity.disabled,
  },
  icon: {
    borderRadius: theme.radii.xs,
    height: theme.sizes.iconMedium,
    width: theme.sizes.iconMedium,
  },
  badge: {
    alignItems: "center",
    backgroundColor: theme.colors.badge.dangerBackground,
    borderColor: theme.colors.background.deep,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.badge,
    justifyContent: "center",
    minWidth: theme.sizes.badge,
    paddingHorizontal: theme.spacing[1],
    position: "absolute",
    right: theme.spacing[0],
    top: theme.spacing[0],
    zIndex: theme.zIndex.card,
  },
  badgeText: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.white,
    textAlign: "center",
  },
}));
