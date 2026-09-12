import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Card } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

/** Renders this feature with colors from the currently resolved app appearance. */
export default function NotificationsScreen() {
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();

  return (
    <ScreenShell
      contentContainerStyle={styles.content}
      description="Prayer reminders, community activity, and spiritual milestones."
      headerVariant="compact"
      onBack={() => router.back()}
      title="Notifications"
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

const styleSheet = createThemedStyles((theme) => ({
  content: { maxWidth: 700 },
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
}));
