import { createThemedStyles } from "@/theme/createThemedStyles";

const knightPortraitAspectRatio = 1024 / 1536;

export const styles = createThemedStyles((theme) => ({
  portraitFrame: {
    alignSelf: "center",
    aspectRatio: knightPortraitAspectRatio,
    borderColor: theme.colors.border.strong,
    maxWidth: theme.sizes.cardMinWidth,
    overflow: "hidden",
    width: "100%",
  },
  portrait: {
    height: "100%",
    width: "100%",
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[4],
    textAlign: "center",
  },
}));
