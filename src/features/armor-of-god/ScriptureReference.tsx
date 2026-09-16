import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { styles as styleSheet } from "./ScriptureReference.styles";

interface ScriptureReferenceProps {
  reference: string;
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function ScriptureReference({ reference }: ScriptureReferenceProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <View accessibilityLabel={t("armor.scriptureReference", { reference })} style={styles.container}>
      <MaterialCommunityIcons
        accessible={false}
        color={theme.colors.gold.pale}
        name="book-cross"
        size={theme.sizes.iconSmall}
      />
      <Text style={styles.reference}>{reference}</Text>
    </View>
  );
}
