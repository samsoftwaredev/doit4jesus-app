import { StyleSheet } from "react-native";

import { theme } from "@/theme/tokens";

export const styles = StyleSheet.create({
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
});
