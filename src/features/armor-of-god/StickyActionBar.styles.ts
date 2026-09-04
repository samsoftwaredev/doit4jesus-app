import { createThemedStyles } from "@/theme/createThemedStyles";

export const styles = createThemedStyles((theme) => ({
  safeArea: {
    backgroundColor: theme.colors.background.deep,
    borderColor: theme.colors.gold.strong,
    borderTopWidth: theme.borderWidths.thin,
    marginTop: theme.spacing[5],
    paddingHorizontal: theme.spacing[3],
    paddingTop: theme.spacing[3],
  },
  actions: {
    gap: theme.spacing[2],
  },
}));
