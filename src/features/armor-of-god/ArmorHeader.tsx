import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { styles as styleSheet } from "./ArmorHeader.styles";

/** Renders this feature with colors from the currently resolved app appearance. */
export function ArmorHeader() {
  const { t } = useTranslation();
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
          {t("armor.title")}
        </Text>
        <MaterialCommunityIcons
          accessible={false}
          color={theme.colors.gold.primary}
          name="cross"
          size={theme.sizes.iconSmall}
        />
      </View>
      <Text style={styles.subtitle}>{t("armor.subtitle")}</Text>
    </View>
  );
}
