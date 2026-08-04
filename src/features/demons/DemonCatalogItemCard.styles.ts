import { StyleSheet } from "react-native";

import { theme } from "@/theme/tokens";

export const styles = StyleSheet.create({
  title: {
    ...theme.typography.displayMedium,
    color: theme.colors.text.primary,
    width: "100%",
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    width: "100%",
  },
  content: {
    alignItems: "stretch",
    flexDirection: "column",
    gap: theme.spacing[4],
  },
  artworkFrame: {
    alignSelf: "stretch",
    aspectRatio: 2 / 3,
    overflow: "hidden",
    width: "100%",
  },
  artwork: {
    height: "100%",
    width: "100%",
  },
  details: {
    minWidth: theme.spacing[0],
    width: "100%",
  },
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[2],
    minWidth: theme.spacing[0],
  },
  metadataBadge: {
    backgroundColor: theme.colors.badge.warningBackground,
    borderRadius: theme.radii.pill,
    flexShrink: 1,
    maxWidth: "100%",
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  hpBadge: {
    backgroundColor: theme.colors.badge.dangerBackground,
  },
  badgeText: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.primary,
    flexShrink: 1,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[4],
    minWidth: theme.spacing[0],
  },
  affinitySection: {
    marginTop: theme.spacing[4],
    minWidth: theme.spacing[0],
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
    minWidth: theme.spacing[0],
  },
  affinityBadge: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    flexShrink: 1,
    maxWidth: "100%",
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  primaryAffinity: {
    borderColor: theme.colors.semantic.successBorder,
  },
  affinityText: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.secondary,
    flexShrink: 1,
  },
  primaryAffinityText: {
    color: theme.colors.text.success,
  },
});
