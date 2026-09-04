import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Card } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

/** Renders this feature with colors from the currently resolved app appearance. */
export default function MessagesScreen() {
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();

  return (
    <ScreenShell
      contentContainerStyle={styles.content}
      title="Messages"
      subtitle="Conversations, invitations, and encouragement from your community."
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
      <Card title="Your inbox">
        <View style={styles.emptyState}>
          <Feather color={theme.colors.icon.active} name="mail" size={theme.sizes.iconHero} />
          <Text style={styles.description}>Messages from friends and your prayer community will appear here.</Text>
        </View>
      </Card>
    </ScreenShell>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  content: { maxWidth: 700 },
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
}));
