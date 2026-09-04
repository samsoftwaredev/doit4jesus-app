import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { styles as styleSheet } from "./ArmorHeader.styles";

/** Renders this feature with colors from the currently resolved app appearance. */
export function ArmorHeader() {
  const styles = useThemedStyles(styleSheet);
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
      <Text style={styles.subtitle}>Put on the full armor, stand firm, and win the battle!</Text>
    </View>
  );
}
