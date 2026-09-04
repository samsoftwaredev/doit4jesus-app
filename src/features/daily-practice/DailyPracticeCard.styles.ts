import { createThemedStyles } from "@/theme/createThemedStyles";

const devotionalImageAspectRatio = 1536 / 1024;

export const styles = createThemedStyles((theme) => ({
  image: {
    alignSelf: "center",
    aspectRatio: devotionalImageAspectRatio,
    maxWidth: theme.spacing[20],
    width: "100%",
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[3],
  },
}));
