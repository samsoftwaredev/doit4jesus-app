import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { theme } from "@/theme/tokens";

import { styles } from "./ScriptureReference.styles";

interface ScriptureReferenceProps {
  reference: string;
}

export function ScriptureReference({ reference }: ScriptureReferenceProps) {
  return (
    <View accessibilityLabel={`Scripture reference: ${reference}`} style={styles.container}>
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
