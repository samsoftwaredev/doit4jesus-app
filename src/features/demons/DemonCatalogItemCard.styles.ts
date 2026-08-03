import { StyleSheet } from "react-native";

import { theme } from "@/theme/tokens";

export const styles = StyleSheet.create({
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[2],
  },
  metadataBadge: {
    backgroundColor: theme.colors.badge.warningBackground,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  hpBadge: {
    backgroundColor: theme.colors.badge.dangerBackground,
  },
  badgeText: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.primary,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[4],
  },
  affinitySection: {
    marginTop: theme.spacing[4],
  },
  affinityHeading: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
  },
  affinityList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
  },
  affinityBadge: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  primaryAffinity: {
    borderColor: theme.colors.semantic.successBorder,
  },
  affinityText: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.secondary,
  },
  primaryAffinityText: {
    color: theme.colors.text.success,
  },
});
