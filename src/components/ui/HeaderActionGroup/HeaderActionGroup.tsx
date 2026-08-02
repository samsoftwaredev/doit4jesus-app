import { View } from "react-native";

import { MessageAction } from "./MessageAction";
import { NotificationAction } from "./NotificationAction";
import { SettingsAction } from "./SettingsAction";
import { styles } from "./HeaderActionGroup.styles";
import type { HeaderActionGroupProps } from "./HeaderActionGroup.types";

export function HeaderActionGroup({
  notificationUnreadCount = 0,
  messageUnreadCount = 0,
  onNotificationsPress,
  onMessagesPress,
  onSettingsPress,
  loading = false,
  disabled = false,
  notificationsDisabled = false,
  messagesDisabled = false,
  settingsDisabled = false,
  style,
  testID,
}: HeaderActionGroupProps) {
  return (
    <View style={[styles.group, style]} testID={testID}>
      <NotificationAction
        disabled={disabled || notificationsDisabled}
        loading={loading}
        onPress={onNotificationsPress}
        testID={testID ? `${testID}-notifications` : undefined}
        unreadCount={notificationUnreadCount}
      />
      <MessageAction
        disabled={disabled || messagesDisabled}
        loading={loading}
        onPress={onMessagesPress}
        testID={testID ? `${testID}-messages` : undefined}
        unreadCount={messageUnreadCount}
      />
      <SettingsAction
        disabled={disabled || settingsDisabled}
        loading={loading}
        onPress={onSettingsPress}
        testID={testID ? `${testID}-settings` : undefined}
      />
    </View>
  );
}
