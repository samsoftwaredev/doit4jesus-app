import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Card } from "@/components/ui";
import { theme } from "@/theme/tokens";

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <ScreenShell
      title="Notifications"
      subtitle="Prayer reminders, community activity, and spiritual milestones."
      headerAccessory={
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={theme.spacing[2]}
          onPress={() => router.back()}
          style={styles.headerBackButton}
        >
          <Feather
            accessible={false}
            color={theme.colors.icon.primary}
            name="chevron-left"
            size={theme.sizes.iconMedium}
          />
        </Pressable>
      }
    >
      <Card title="All caught up">
        <View style={styles.emptyState}>
          <Feather color={theme.colors.icon.active} name="bell" size={theme.sizes.iconHero} />
          <Text style={styles.description}>New prayer reminders and community updates will appear here.</Text>
        </View>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  headerBackButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  emptyState: {
    alignItems: "center",
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[4],
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
});
