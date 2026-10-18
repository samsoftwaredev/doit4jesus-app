import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppLoadingScreen } from "@/components";
import { Button } from "@/components/ui";
import { AuthProvider, useAuth } from "@/features/auth";
import { AchievementProvider, AchievementToastHost, BadgeAwardSubscription } from "@/features/achievements";
import { getProfileAccessState, ProfileProvider, useCurrentProfile } from "@/features/profile";
import { logDevelopmentError } from "@/lib/development-logger";
import { supabase } from "@/lib/supabase";
import { AccountLanguagePreferenceSync } from "@/localization/AccountLanguagePreferenceSync";
import { AppLanguageProvider, useAppLanguage } from "@/localization";
import { AppThemeProvider, getStatusBarStyle, useAppTheme } from "@/theme/AppThemeProvider";
import { AppVisualEffectsProvider, useAppVisualEffects } from "@/theme/AppVisualEffectsProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

void SplashScreen.preventAutoHideAsync().catch((error) => logDevelopmentError("preventing splash auto-hide", error));

/** Installs language, appearance, and visual-effect providers before authentication so preferences apply app-wide. */
export default function RootLayout() {
  return (
    <AppLanguageProvider>
      <AppThemeProvider>
        <AppVisualEffectsProvider>
          <AchievementProvider>
            <ThemedRoot />
          </AchievementProvider>
        </AppVisualEffectsProvider>
      </AppThemeProvider>
    </AppLanguageProvider>
  );
}

/** Holds routed content behind the native splash until language, appearance, and visual-effect hydration finish. */
function ThemedRoot() {
  const { isHydrated: isLanguageHydrated } = useAppLanguage();
  const { colorScheme, isHydrated: isThemeHydrated, theme: appTheme } = useAppTheme();
  const { isHydrated: isVisualEffectsHydrated } = useAppVisualEffects();

  useEffect(() => {
    if (isLanguageHydrated && isThemeHydrated && isVisualEffectsHydrated) {
      void SplashScreen.hideAsync().catch((error) => logDevelopmentError("hiding the splash screen", error));
    }
  }, [isLanguageHydrated, isThemeHydrated, isVisualEffectsHydrated]);

  if (!isLanguageHydrated || !isThemeHydrated || !isVisualEffectsHydrated) return null;

  const baseNavigationTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseNavigationTheme,
    colors: {
      ...baseNavigationTheme.colors,
      background: appTheme.colors.background.primary,
      border: appTheme.colors.border.default,
      card: appTheme.colors.surface.navigation,
      notification: appTheme.colors.semantic.danger,
      primary: appTheme.colors.brand.primary,
      text: appTheme.colors.text.primary,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, position: "relative" }}>
      <SafeAreaProvider>
        <ThemeProvider value={navigationTheme}>
          <StatusBar style={getStatusBarStyle(colorScheme)} />
          <AuthProvider>
            <BadgeAwardSubscription />
            <ProfileProvider>
              <AccountLanguagePreferenceSync>
                <RootNavigator />
              </AccountLanguagePreferenceSync>
            </ProfileProvider>
          </AuthProvider>
          <AchievementToastHost />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/** Selects protected routes after authentication and profile access resolve. */
export function RootNavigator() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
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
          {t("profile.errors.load")}
        </Text>
        <Text style={styles.errorCopy}>{t("app.profileErrorCopy")}</Text>
        <View style={styles.profileErrorActions}>
          <Button
            loading={profileState.isLoading}
            onPress={() => void profileState.refreshProfile()}
            style={styles.profileErrorAction}
          >
            {t("common.retry")}
          </Button>
          <Button onPress={() => void supabase.auth.signOut()} style={styles.profileErrorAction} variant="outline">
            {t("profile.signOut")}
          </Button>
        </View>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.colors.background.primary },
        headerShown: false,
      }}
    >
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
        <Stack.Screen name="settings" />
      </Stack.Protected>

      <Stack.Protected guard={isSignedIn && !isPasswordRecovery && needsProfileSetup}>
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn && !isPasswordRecovery}>
        <Stack.Screen name="index" options={{ animation: "fade" }} />
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

const styleSheet = createThemedStyles((theme) => ({
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
  profileErrorActions: {
    flexDirection: "row",
    gap: theme.spacing[2],
    maxWidth: 420,
    width: "100%",
  },
  profileErrorAction: { flex: 1, minWidth: 0 },
}));
