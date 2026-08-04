import { StyleSheet } from "react-native";

import { theme } from "@/theme/tokens";

import type { ArmorStatus } from "./armorOfGod.types";

export const statusStyle = {
  available: {
    badge: { backgroundColor: theme.colors.badge.infoBackground },
    iconColor: theme.colors.badge.infoText,
    label: { color: theme.colors.badge.infoText },
  },
  completed: {
    badge: { backgroundColor: theme.colors.badge.successBackground },
    iconColor: theme.colors.badge.successText,
    label: { color: theme.colors.badge.successText },
  },
  equipped: {
    badge: { backgroundColor: theme.colors.gold.dark },
    iconColor: theme.colors.gold.pale,
    label: { color: theme.colors.gold.pale },
  },
  locked: {
    badge: { backgroundColor: theme.colors.badge.neutralBackground },
    iconColor: theme.colors.text.muted,
    label: { color: theme.colors.text.muted },
  },
} as const satisfies Record<
  ArmorStatus,
  {
    badge: object;
    iconColor: string;
    label: object;
  }
>;

export const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: theme.radii.pill,
    flexDirection: "row",
    gap: theme.spacing[1],
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  label: {
    ...theme.typography.labelSmall,
  },
});
