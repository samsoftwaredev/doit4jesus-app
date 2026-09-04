import { createThemedStyles } from "@/theme/createThemedStyles";

export const styles = createThemedStyles((theme) => ({
  card: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.surface.navyDeep,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    gap: theme.spacing[3],
    minWidth: theme.spacing[0],
    padding: theme.spacing[3],
  },
  cardSelected: {
    borderColor: theme.colors.gold.pale,
    ...theme.shadows.goldGlow,
  },
  cardLocked: {
    opacity: theme.opacity.muted,
  },
  cardPressed: {
    opacity: theme.opacity.pressed,
  },
  iconFrame: {
    alignItems: "center",
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    flexShrink: 0,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  content: {
    flex: 1,
    gap: theme.spacing[2],
    minWidth: theme.spacing[0],
  },
  title: {
    ...theme.typography.label,
    color: theme.colors.text.primary,
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
  },
}));
