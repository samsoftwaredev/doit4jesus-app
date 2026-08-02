import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import { theme } from "@/theme/tokens";

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <ScreenShell
      title="Messages"
      subtitle="Conversations, invitations, and encouragement from your community."
      headerAccessory={
        <Button onPress={() => router.back()} size="sm" variant="ghost">
          Back
        </Button>
      }
    >
      <Card title="Your inbox">
        <View style={styles.emptyState}>
          <Feather color={theme.colors.icon.active} name="mail" size={theme.sizes.iconHero} />
          <Text style={styles.description}>
            Messages from friends and your prayer community will appear here.
          </Text>
        </View>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
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
