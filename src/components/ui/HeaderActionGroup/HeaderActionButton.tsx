import { useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

import { styles } from "./HeaderActionGroup.styles";
import type { HeaderActionProps } from "./HeaderActionGroup.types";

type HeaderActionIconName = "bell" | "mail" | "settings";

const headerActionIconSources = {
  bell: require("../../../assets/icons/bell.png"),
  mail: require("../../../assets/icons/envelop.png"),
  settings: require("../../../assets/icons/settings.png"),
} as const satisfies Record<HeaderActionIconName, number>;

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

export function HeaderActionButton({
  iconName,
  label,
  unreadCount = 0,
  loading = false,
  disabled = false,
  onPress,
  testID,
}: HeaderActionButtonProps) {
  const [focused, setFocused] = useState(false);
  const normalizedUnreadCount = Math.max(0, Math.floor(unreadCount));
  const badgeText = getUnreadBadgeText(normalizedUnreadCount);
  const unavailable = disabled || loading;
  const accessibilityLabel = badgeText
    ? `${label}, ${normalizedUnreadCount} unread`
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
        <Image
          accessible={false}
          resizeMode="cover"
          source={headerActionIconSources[iconName]}
          style={styles.icon}
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
