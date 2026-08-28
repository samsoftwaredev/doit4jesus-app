import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import { useAuth } from "@/features/auth";
import { supabase } from "@/lib/supabase";
import { theme } from "@/theme/tokens";

export default function SettingsScreen() {
  const router = useRouter();
  const { configurationError } = useAuth();
  const [signOutError, setSignOutError] = useState<string>();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = async () => {
    setSignOutError(undefined);
    setIsSigningOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setSignOutError(error.message);
    }
    setIsSigningOut(false);
  };

  return (
    <ScreenShell
      title="Settings"
      subtitle="Shape the app around your life of prayer."
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
        <View style={styles.accountActions}>
          <Button fullWidth onPress={() => router.push("/change-email")} variant="secondary">
            Change email
          </Button>
          <Button
            disabled={Boolean(configurationError)}
            fullWidth
            loading={isSigningOut}
            onPress={() => void signOut()}
            variant="ghost"
          >
            Sign out
          </Button>
          {signOutError ? <Text style={styles.error}>{signOutError}</Text> : null}
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
  accountActions: {
    gap: theme.spacing[2],
    marginTop: theme.spacing[4],
  },
  error: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.danger,
    textAlign: "center",
  },
});
