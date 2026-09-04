import { createThemedStyles } from "@/theme/createThemedStyles";

export const styles = createThemedStyles((theme) => ({
  artworkFrame: {
    alignItems: "center",
    alignSelf: "center",
    aspectRatio: 2 / 3,
    marginBottom: theme.spacing[4],
    maxWidth: 240,
    width: "50%",
  },
  artwork: {
    height: "100%",
    width: "100%",
  },
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[2],
  },
  categoryBadge: {
    backgroundColor: theme.colors.badge.warningBackground,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  healthBadge: {
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
  personality: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    fontStyle: "italic",
    marginTop: theme.spacing[2],
  },
  section: {
    gap: theme.spacing[2],
    marginTop: theme.spacing[5],
  },
  sectionTitle: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
  },
  listItem: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.sm,
    borderWidth: theme.borderWidths.hairline,
    padding: theme.spacing[3],
  },
  itemTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
  },
  itemDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  itemMeta: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.info,
    marginTop: theme.spacing[2],
  },
  reward: {
    backgroundColor: theme.colors.badge.successBackground,
    borderColor: theme.colors.semantic.successBorder,
    borderRadius: theme.radii.sm,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[1],
    marginTop: theme.spacing[5],
    padding: theme.spacing[3],
  },
  rewardTitle: {
    ...theme.typography.heading3,
    color: theme.colors.text.success,
  },
  rewardText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
  },
  safetyNote: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.warning,
    marginTop: theme.spacing[4],
  },
}));
