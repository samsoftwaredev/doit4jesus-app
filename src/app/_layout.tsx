import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Button } from "@/components/ui";
import { AuthProvider, useAuth } from "@/features/auth";
import { getProfileAccessState, ProfileProvider, useCurrentProfile } from "@/features/profile";
import { theme } from "@/theme/tokens";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AuthProvider>
          <ProfileProvider>
            <RootNavigator />
          </ProfileProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { isLoading, isPasswordRecovery, session } = useAuth();
  const profileState = useCurrentProfile();

  if (isLoading || (session && !isPasswordRecovery && profileState.isLoading)) return <AppLoadingScreen />;

  const isSignedIn = Boolean(session);
  const profileAccess = getProfileAccessState(profileState);
  const hasCompleteProfile = profileAccess === "complete";
  const needsProfileSetup = profileAccess === "onboarding";

  if (isSignedIn && !isPasswordRecovery && profileAccess === "error") {
    return (
      <View style={styles.profileError}>
        <Text accessibilityRole="header" style={styles.errorTitle}>
          We couldn't load your profile.
        </Text>
        <Text style={styles.errorCopy}>Check your connection and try again. Your dashboard remains protected.</Text>
        <Button loading={profileState.isLoading} onPress={() => void profileState.refreshProfile()}>
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn && !isPasswordRecovery && hasCompleteProfile}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="about" />
        <Stack.Screen name="battle" />
        <Stack.Screen name="change-email" />
        <Stack.Screen name="demonsCatalog" />
        <Stack.Screen name="friends" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="prayer-intentions" />
        <Stack.Screen name="prayer-intention-prayers" />
        <Stack.Screen name="intention-rosary" />
        <Stack.Screen name="create-prayer-intention" />
        <Stack.Screen name="my-prayer-intentions" />
        <Stack.Screen name="rosary" />
        <Stack.Screen name="rosary-garden" />
        <Stack.Screen name="settings" />
      </Stack.Protected>

      <Stack.Protected guard={isSignedIn && !isPasswordRecovery && needsProfileSetup}>
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn && !isPasswordRecovery}>
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack.Protected>

      <Stack.Protected guard={isSignedIn && isPasswordRecovery}>
        <Stack.Screen name="reset-password" />
      </Stack.Protected>
    </Stack>
  );
}

function AppLoadingScreen() {
  return (
    <View accessibilityLabel="Loading your account" style={styles.loading}>
      <ActivityIndicator color={theme.colors.brand.primaryLight} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    backgroundColor: theme.colors.background.primary,
    flex: 1,
    justifyContent: "center",
  },
  profileError: {
    alignItems: "center",
    backgroundColor: theme.colors.background.primary,
    flex: 1,
    gap: theme.spacing[3],
    justifyContent: "center",
    padding: theme.spacing[6],
  },
  errorTitle: { ...theme.typography.heading3, color: theme.colors.text.primary, textAlign: "center" },
  errorCopy: { ...theme.typography.body, color: theme.colors.text.muted, maxWidth: 420, textAlign: "center" },
});
