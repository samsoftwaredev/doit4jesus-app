import { createThemedStyles } from "@/theme/createThemedStyles";

export const styles = createThemedStyles((theme) => ({
  container: {
    gap: theme.spacing[2],
    marginTop: theme.spacing[4],
    width: "100%",
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  track: {
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    height: theme.spacing[3],
    overflow: "hidden",
  },
  fill: {
    backgroundColor: theme.colors.gold.primary,
    borderRadius: theme.radii.pill,
    height: "100%",
  },
}));
