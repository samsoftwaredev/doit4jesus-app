import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { styles as styleSheet } from "./HeaderActionGroup.styles";
import type { HeaderActionProps } from "./HeaderActionGroup.types";

type HeaderActionIconName = "bell" | "mail" | "settings";

interface HeaderActionButtonProps extends HeaderActionProps {
  iconName: HeaderActionIconName;
  label: string;
  unreadCount?: number;
}

function getUnreadBadgeText(unreadCount: number): string | undefined {
  if (unreadCount <= 0) {
    return undefined;
  }

  return unreadCount > 99 ? "99+" : String(unreadCount);
}

/** Renders an accessible Home header action with a decorative vector icon and optional unread badge. */
export function HeaderActionButton({
  iconName,
  label,
  unreadCount = 0,
  loading = false,
  disabled = false,
  onPress,
  testID,
}: HeaderActionButtonProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const normalizedUnreadCount = Math.max(0, Math.floor(unreadCount));
  const badgeText = getUnreadBadgeText(normalizedUnreadCount);
  const unavailable = disabled || loading;
  const accessibilityLabel = badgeText
    ? `${label}, ${t("headerActions.unread", { count: normalizedUnreadCount })}`
    : label;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: unavailable }}
      disabled={unavailable}
      onBlur={() => setFocused(false)}
      onFocus={() => setFocused(true)}
      onPress={unavailable ? undefined : onPress}
      style={({ pressed }) => [
        styles.action,
        focused && styles.focused,
        unavailable && styles.disabled,
        pressed && !unavailable && styles.pressed,
      ]}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.gold.pale} size="small" />
      ) : (
        <Feather
          accessible={false}
          color={styles.icon.color}
          name={iconName}
          size={theme.sizes.iconMedium}
          testID={testID ? `${testID}-icon` : undefined}
        />
      )}
      {badgeText ? (
        <View accessible={false} style={styles.badge} testID={testID ? `${testID}-badge` : undefined}>
          <Text numberOfLines={1} style={styles.badgeText}>
            {badgeText}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
