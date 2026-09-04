import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, Text, View } from "react-native";

import { Button, Card } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

type FriendsStateProps = {
  actionLabel?: string;
  message: string;
  onAction?: () => void;
  title: string;
  type: "empty" | "error" | "loading";
};

/** Renders this feature with colors from the currently resolved app appearance. */
export function FriendsState({ actionLabel, message, onAction, title, type }: FriendsStateProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Card accessibilityLabel={title} fullWidth padding="lg" variant={type === "error" ? "danger" : "outlined"}>
      <View style={styles.content}>
        {type === "loading" ? <ActivityIndicator color={theme.colors.brand.primaryLight} /> : null}
        {type === "empty" ? (
          <Feather color={theme.colors.icon.secondary} name="users" size={theme.sizes.iconLarge} />
        ) : null}
        {type === "error" ? (
          <Feather color={theme.colors.semantic.danger} name="alert-circle" size={theme.sizes.iconLarge} />
        ) : null}
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.message}>{message}</Text>
        {actionLabel && onAction ? (
          <Button onPress={onAction} size="sm" variant={type === "error" ? "secondary" : "outline"}>
            {actionLabel}
          </Button>
        ) : null}
      </View>
    </Card>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  content: {
    alignItems: "center",
    gap: theme.spacing[3],
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    textAlign: "center",
  },
  title: {
    ...theme.typography.heading3,
    textAlign: "center",
  },
}));
