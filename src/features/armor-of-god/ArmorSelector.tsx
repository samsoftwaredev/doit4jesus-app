import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRef } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { styles as styleSheet } from "./ArmorSelector.styles";
import type { ArmorItem } from "./armorOfGod.types";

interface ArmorSelectorProps {
  items: readonly ArmorItem[];
  onSelect: (id: string) => void;
  selectedId: string;
}

const selectorItemSize = theme.sizes.touchTarget + theme.spacing[4];
const selectorStep = selectorItemSize + theme.spacing[2];

/** Renders this feature with colors from the currently resolved app appearance. */
export function ArmorSelector({ items, onSelect, selectedId }: ArmorSelectorProps) {
  const styles = useThemedStyles(styleSheet);
  const scrollViewRef = useRef<ScrollView>(null);

  function selectItem(id: string, index: number) {
    scrollViewRef.current?.scrollTo({
      animated: false,
      x: Math.max(0, index * selectorStep - theme.spacing[6]),
    });
    onSelect(id);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      nestedScrollEnabled
      ref={scrollViewRef}
      showsHorizontalScrollIndicator={false}
    >
      {items.map((item, index) => {
        const selected = item.id === selectedId;

        return (
          <Pressable
            accessibilityLabel={`${item.order}. ${item.name}. ${item.status}.`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={item.id}
            onPress={() => selectItem(item.id, index)}
            style={({ pressed }) => [
              styles.item,
              selected && styles.itemSelected,
              item.status === "locked" && styles.itemLocked,
              pressed && styles.itemPressed,
            ]}
          >
            <MaterialCommunityIcons
              accessible={false}
              color={selected ? theme.colors.gold.pale : theme.colors.icon.secondary}
              name={item.icon}
              size={theme.sizes.iconMedium}
            />
            {item.status === "locked" ? (
              <View style={styles.lockBadge}>
                <MaterialCommunityIcons
                  accessible={false}
                  color={theme.colors.text.primary}
                  name="lock"
                  size={theme.sizes.iconXs}
                />
              </View>
            ) : null}
            {item.status === "equipped" || item.status === "completed" ? (
              <View style={styles.statusBadge}>
                <MaterialCommunityIcons
                  accessible={false}
                  color={theme.colors.text.inverse}
                  name="check"
                  size={theme.sizes.iconXs}
                />
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
