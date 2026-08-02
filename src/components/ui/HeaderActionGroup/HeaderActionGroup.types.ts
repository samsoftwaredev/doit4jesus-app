import type { StyleProp, ViewStyle } from "react-native";

export interface HeaderActionProps {
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  testID?: string;
}

export interface UnreadHeaderActionProps extends HeaderActionProps {
  unreadCount?: number;
}

export interface HeaderActionGroupProps {
  notificationUnreadCount?: number;
  messageUnreadCount?: number;
  onNotificationsPress: () => void;
  onMessagesPress: () => void;
  onSettingsPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  notificationsDisabled?: boolean;
  messagesDisabled?: boolean;
  settingsDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
