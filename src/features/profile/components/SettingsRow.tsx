import Feather from "@expo/vector-icons/Feather";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

type FeatherIconName = ComponentProps<typeof Feather>["name"];

type SettingsRowProps = {
  destructive?: boolean;
  external?: boolean;
  icon: FeatherIconName;
  isLast?: boolean;
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
  value?: string;
};

export function SettingsRow({
  destructive = false,
  external = false,
  icon,
  isLast = false,
  label,
  onPress,
  showChevron = Boolean(onPress),
  value,
}: SettingsRowProps) {
  const iconColor = destructive
    ? theme.colors.text.danger
    : theme.colors.gold.pale;
  const rightAccessory = external ? "external-link" : "chevron-right";
  const content = (
    <>
      <View style={[styles.iconCircle, destructive && styles.destructiveIcon]}>
        <Feather accessible={false} color={iconColor} name={icon} size={theme.sizes.iconSmall} />
      </View>
      <Text style={[styles.label, destructive && styles.destructiveText]}>{label}</Text>
      {value ? (
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.value}>
          {value}
        </Text>
      ) : null}
      {showChevron || external ? (
        <Feather
          accessible={false}
          color={destructive ? theme.colors.text.danger : theme.colors.text.subtle}
          name={rightAccessory}
          size={theme.sizes.iconSmall}
          style={styles.accessory}
        />
      ) : null}
    </>
  );

  if (!onPress) {
    return (
      <View style={[styles.row, isLast && styles.lastRow, destructive && styles.destructiveRow]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        isLast && styles.lastRow,
        destructive && styles.destructiveRow,
        pressed && styles.pressed,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  accessory: {
    marginLeft: theme.spacing[2],
  },
  destructiveIcon: {
    backgroundColor: "rgba(197, 94, 101, 0.14)",
  },
  destructiveRow: {
    backgroundColor: "rgba(86, 45, 56, 0.36)",
  },
  destructiveText: {
    color: theme.colors.text.danger,
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.12)",
    borderRadius: theme.radii.pill,
    height: theme.spacing[8],
    justifyContent: "center",
    marginRight: theme.spacing[3],
    width: theme.spacing[8],
  },
  label: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
    flexShrink: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  pressed: {
    backgroundColor: theme.colors.surface.tertiary,
  },
  row: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    minHeight: 64,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  value: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    flex: 1,
    marginLeft: theme.spacing[3],
    textAlign: "right",
  },
});
