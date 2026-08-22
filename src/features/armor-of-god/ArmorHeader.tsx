import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { theme } from "@/theme/tokens";

import { styles } from "./ArmorHeader.styles";

export function ArmorHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons
          accessible={false}
          color={theme.colors.gold.primary}
          name="cross"
          size={theme.sizes.iconSmall}
        />
        <Text accessibilityRole="header" style={styles.title}>
          ARMOR OF GOD
        </Text>
        <MaterialCommunityIcons
          accessible={false}
          color={theme.colors.gold.primary}
          name="cross"
          size={theme.sizes.iconSmall}
        />
      </View>
      <Text style={styles.subtitle}>
        Put on the full armor, stand firm, and win the battle!
      </Text>
    </View>
  );
}
