import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import { theme } from "@/theme/tokens";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScreenShell
      title="Settings"
      subtitle="Shape the app around your life of prayer."
      headerAccessory={
        <Button onPress={() => router.back()} size="sm" variant="ghost">
          Back
        </Button>
      }
    >
      <Card title="Prayer and reminders">
        <View style={styles.row}>
          <Feather color={theme.colors.icon.active} name="bell" size={theme.sizes.iconMedium} />
          <Text style={styles.description}>
            Choose when you would like prayer reminders and spiritual encouragement.
          </Text>
        </View>
      </Card>
      <Card title="Account and privacy">
        <View style={styles.row}>
          <Feather color={theme.colors.icon.secondary} name="shield" size={theme.sizes.iconMedium} />
          <Text style={styles.description}>
            Manage your profile, privacy choices, accessibility, and display preferences.
          </Text>
        </View>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.spacing[3],
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    flex: 1,
  },
});
