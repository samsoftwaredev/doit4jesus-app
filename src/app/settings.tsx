import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import { useAuth } from "@/features/auth";
import { supabase } from "@/lib/supabase";
import { type ThemePreference, useAppTheme } from "@/theme/AppThemeProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const appearanceOptions: readonly { description: string; label: string; value: ThemePreference }[] = [
  { description: "Match this device and update automatically.", label: "System", value: "system" },
  { description: "Use the warm ivory devotional palette.", label: "Light", value: "light" },
  { description: "Use the original deep navy palette.", label: "Dark", value: "dark" },
];

/** Renders account controls and the device-local appearance preference. */
export default function SettingsScreen() {
  const styles = useThemedStyles(styleSheet);
  const router = useRouter();
  const { configurationError } = useAuth();
  const { preference, setPreference, theme: appTheme } = useAppTheme();
  const [signOutError, setSignOutError] = useState<string>();
  const [isSigningOut, setIsSigningOut] = useState(false);

  /** Signs out the current account while exposing any recoverable error. */
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
      contentContainerStyle={styles.content}
      title="Settings"
      subtitle="Shape the app around your life of prayer."
      testID="settings-screen"
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
      <Card title="Appearance">
        <View accessibilityLabel="Appearance" accessibilityRole="radiogroup" style={styles.appearanceGroup}>
          {appearanceOptions.map((option) => {
            const isSelected = preference === option.value;
            return (
              <Pressable
                accessibilityLabel={option.label}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                key={option.value}
                onPress={() => void setPreference(option.value)}
                style={({ pressed }) => [
                  styles.appearanceOption,
                  { borderColor: isSelected ? appTheme.colors.border.focus : appTheme.colors.border.default },
                  isSelected && styles.appearanceOptionSelected,
                  pressed && styles.appearanceOptionPressed,
                ]}
              >
                <View
                  accessible={false}
                  style={[
                    styles.radioIndicator,
                    {
                      backgroundColor: isSelected ? appTheme.colors.brand.primary : appTheme.colors.transparent,
                      borderColor: isSelected ? appTheme.colors.border.focus : appTheme.colors.border.interactive,
                    },
                  ]}
                >
                  {isSelected ? <Feather color={appTheme.colors.icon.inverse} name="check" size={14} /> : null}
                </View>
                <View style={styles.appearanceCopy}>
                  <Text style={styles.appearanceLabel}>{option.label}</Text>
                  <Text style={styles.appearanceDescription}>{option.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </Card>
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

const styleSheet = createThemedStyles((theme) => ({
  content: { maxWidth: 700 },
  appearanceCopy: {
    flex: 1,
    minWidth: 0,
  },
  appearanceDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0.5],
  },
  appearanceGroup: {
    gap: theme.spacing[2],
  },
  appearanceLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
  },
  appearanceOption: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  appearanceOptionPressed: {
    opacity: theme.opacity.pressed,
  },
  appearanceOptionSelected: {
    backgroundColor: theme.colors.surface.green,
    borderWidth: theme.borderWidths.medium,
  },
  radioIndicator: {
    alignItems: "center",
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.medium,
    height: theme.spacing[6],
    justifyContent: "center",
    marginRight: theme.spacing[3],
    width: theme.spacing[6],
  },
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
}));
