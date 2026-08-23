import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "@/features/auth";
import { theme } from "@/theme/tokens";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { isLoading, isPasswordRecovery, session } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.colors.brand.primaryLight} />
      </View>
    );
  }

  const isSignedIn = Boolean(session);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn && !isPasswordRecovery}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="battle" />
        <Stack.Screen name="change-email" />
        <Stack.Screen name="demonsCatalog" />
        <Stack.Screen name="friends" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="rosary-garden" />
        <Stack.Screen name="settings" />
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

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    backgroundColor: theme.colors.background.primary,
    flex: 1,
    justifyContent: "center",
  },
});
