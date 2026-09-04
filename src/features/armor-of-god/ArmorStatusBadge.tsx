import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { styles as styleSheet, statusStyle } from "./ArmorStatusBadge.styles";
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

/** Renders this feature with colors from the currently resolved app appearance. */
export function ArmorStatusBadge({ status }: ArmorStatusBadgeProps) {
  const styles = useThemedStyles(styleSheet);
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
