import { createThemedStyles } from "@/theme/createThemedStyles";

export const styles = createThemedStyles((theme) => ({
  container: {
    alignItems: "center",
    marginTop: theme.spacing[10],
  },
  brandRow: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: theme.spacing[2],
  },
  brandIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  brand: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
    marginTop: theme.spacing[4],
  },
  title: {
    ...theme.typography.heading2,
    color: theme.colors.gold.pale,
    textAlign: "center",
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[2],
    textAlign: "center",
  },
}));
