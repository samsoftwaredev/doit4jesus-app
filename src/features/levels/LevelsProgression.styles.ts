import { createThemedStyles } from "@/theme/createThemedStyles";

export const styles = createThemedStyles((theme) => ({
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
  },
  title: {
    ...theme.typography.heading3,
    color: theme.colors.gold.pale,
  },
  progression: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: theme.spacing[2],
    marginTop: theme.spacing[5],
  },
  levelColumn: {
    alignItems: "center",
    flexBasis: theme.spacing[14],
    flexShrink: 0,
  },
  shield: {
    alignItems: "center",
    height: theme.sizes.buttonHeight + theme.spacing[2],
    justifyContent: "center",
    position: "relative",
    width: theme.sizes.buttonHeight + theme.spacing[2],
  },
  shieldIcon: {
    position: "absolute",
  },
  levelNumber: {
    ...theme.typography.heading3,
    color: theme.colors.text.white,
    zIndex: theme.zIndex.card,
  },
  levelLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[2],
    textAlign: "center",
  },
  progressArea: {
    alignItems: "center",
    flex: 1,
    minWidth: theme.spacing[0],
  },
  guardianMarker: {
    alignItems: "center",
    marginBottom: theme.spacing[3],
  },
  guardianAvatar: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.gold.primary,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.buttonHeight,
    overflow: "hidden",
    width: theme.sizes.buttonHeight,
    ...theme.shadows.goldGlow,
  },
  guardianImage: {
    height: "100%",
    width: "100%",
  },
  guardianIdentity: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[1],
    marginTop: theme.spacing[1],
  },
  guardianLabel: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  progressPath: {
    position: "relative",
    width: "100%",
  },
  track: {
    backgroundColor: theme.colors.border.strong,
    height: theme.borderWidths.thin,
    left: theme.spacing[1],
    position: "absolute",
    right: theme.spacing[1],
    top: "50%",
    transform: [{ translateY: -theme.borderWidths.thin }],
  },
  completedTrack: {
    backgroundColor: theme.colors.accent.blue,
    height: theme.borderWidths.medium,
    left: theme.spacing[1],
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -theme.borderWidths.thin }],
  },
  checkpointRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkpoint: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.iconSmall,
    justifyContent: "center",
    width: theme.sizes.iconSmall,
  },
  checkpointCompleted: {
    backgroundColor: theme.colors.accent.blue,
    borderColor: theme.colors.accent.blueLight,
  },
  pathSummary: {
    ...theme.typography.caption,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[2],
    textAlign: "center",
  },
}));
