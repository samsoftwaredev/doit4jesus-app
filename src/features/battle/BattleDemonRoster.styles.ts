import { createThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const FADE_WIDTH = theme.spacing[8];

export const styles = createThemedStyles((theme) => ({
  container: {
    width: "100%",
  },
  scrollWrapper: {
    overflow: "hidden",
    position: "relative",
    marginBottom: 30,
  },
  fadeLeft: {
    bottom: 0,
    left: 0,
    position: "absolute",
    top: 0,
    width: FADE_WIDTH,
  },
  fadeRight: {
    bottom: 0,
    position: "absolute",
    right: 0,
    top: 0,
    width: FADE_WIDTH,
  },
  rosterContent: {
    gap: theme.spacing[3],
  },
  demonTile: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    flexShrink: 0,
    overflow: "hidden",
  },
  demonTileSelected: {
    backgroundColor: theme.colors.semantic.dangerSurface,
    borderColor: theme.colors.semantic.danger,
    ...theme.shadows.focus,
  },
  demonTilePressed: {
    opacity: theme.opacity.pressed,
  },
  imageFrame: {
    alignItems: "center",
    aspectRatio: 2 / 3,
    justifyContent: "center",
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  name: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1.5],
    textAlign: "center",
  },
}));
