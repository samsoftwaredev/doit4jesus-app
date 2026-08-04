import { StyleSheet } from "react-native";

import { theme } from "@/theme/tokens";

export const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[3],
  },
  iconFrame: {
    alignItems: "center",
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.gold.primary,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.iconHero + theme.spacing[4],
    justifyContent: "center",
    width: theme.sizes.iconHero + theme.spacing[4],
  },
  headerCopy: {
    flex: 1,
    gap: theme.spacing[2],
    minWidth: theme.spacing[0],
  },
  title: {
    ...theme.typography.heading3,
    color: theme.colors.gold.pale,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  challenge: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.sm,
    borderWidth: theme.borderWidths.hairline,
    marginTop: theme.spacing[4],
    padding: theme.spacing[3],
  },
  challengeLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
  },
  challengeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  xp: {
    ...theme.typography.label,
    color: theme.colors.text.success,
    marginTop: theme.spacing[2],
  },
});
