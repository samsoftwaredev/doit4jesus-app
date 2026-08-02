import { StyleSheet } from "react-native";

import { theme } from "@/theme/tokens";

const devotionalImageAspectRatio = 1536 / 1024;

export const styles = StyleSheet.create({
  image: {
    alignSelf: "center",
    aspectRatio: devotionalImageAspectRatio,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.sm,
    borderWidth: theme.borderWidths.hairline,
    maxWidth: theme.spacing[20],
    width: "100%",
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[3],
  },
});
