import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { ArmorStatusBadge } from "./ArmorStatusBadge";
import { styles as styleSheet } from "./ArmorItemCard.styles";
import type { ArmorItem } from "./armorOfGod.types";

interface ArmorItemCardProps {
  item: ArmorItem;
  onPress: () => void;
  selected: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function ArmorItemCard({ item, onPress, selected, style }: ArmorItemCardProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Pressable
      accessibilityLabel={`${item.order}. ${item.name}. ${item.status}.`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        style,
        selected && styles.cardSelected,
        item.status === "locked" && styles.cardLocked,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.iconFrame}>
        <MaterialCommunityIcons
          accessible={false}
          color={theme.colors.gold.pale}
          name={item.icon}
          size={theme.sizes.iconLarge}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{`${item.order}. ${item.name}`}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <ArmorStatusBadge status={item.status} />
      </View>
    </Pressable>
  );
}
