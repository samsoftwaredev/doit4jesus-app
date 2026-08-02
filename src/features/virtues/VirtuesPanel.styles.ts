import { StyleSheet } from "react-native";

import { theme } from "@/theme/tokens";

export const styles = StyleSheet.create({
  header: {
    alignItems: "center",
  },
  title: {
    ...theme.typography.heading1,
    textAlign: "center",
  },
  divider: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[2],
    marginTop: theme.spacing[2],
    width: "100%",
  },
  dividerLine: {
    backgroundColor: theme.colors.border.strong,
    flex: 1,
    height: theme.borderWidths.hairline,
  },
  introduction: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[4],
    textAlign: "center",
  },
  virtueList: {
    gap: theme.spacing[4],
    marginTop: theme.spacing[6],
  },
  encouragement: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.sm,
    borderWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    marginTop: theme.spacing[6],
    padding: theme.spacing[3],
  },
  encouragementIcon: {
    marginRight: theme.spacing[2],
  },
  encouragementText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    flex: 1,
  },
});
