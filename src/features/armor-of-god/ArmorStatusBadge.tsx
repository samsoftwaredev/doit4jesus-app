import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { theme } from "@/theme/tokens";

import { styles, statusStyle } from "./ArmorStatusBadge.styles";
import type { ArmorStatus } from "./armorOfGod.types";
import { getArmorStatusLabel } from "./armorOfGod.utils";

interface ArmorStatusBadgeProps {
  status: ArmorStatus;
}

const statusIcon = {
  available: "shield-outline",
  completed: "star-four-points",
  equipped: "check",
  locked: "lock",
} as const;

export function ArmorStatusBadge({ status }: ArmorStatusBadgeProps) {
  const visualStyle = statusStyle[status];

  return (
    <View style={[styles.badge, visualStyle.badge]}>
      <MaterialCommunityIcons
        accessible={false}
        color={visualStyle.iconColor}
        name={statusIcon[status]}
        size={theme.sizes.iconXs}
      />
      <Text style={[styles.label, visualStyle.label]}>{getArmorStatusLabel(status)}</Text>
    </View>
  );
}
