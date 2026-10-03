import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { LanguageSelector } from "@/components";
import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import { useAuth } from "@/features/auth";
import { useCurrentProfile } from "@/features/profile";
import { getNotificationPreferences, updateNotificationPreferences } from "@/features/onboarding";
import type { NotificationPreferences } from "@/features/onboarding";
import { logDevelopmentError } from "@/lib/development-logger";
import { supabase } from "@/lib/supabase";
import { useAppLanguage } from "@/localization";
import { type ThemePreference, useAppTheme } from "@/theme/AppThemeProvider";
import { useAppVisualEffects } from "@/theme/AppVisualEffectsProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

/** Renders account controls plus device-local language and appearance preferences. */
export default function SettingsScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const router = useRouter();
  const { configurationError } = useAuth();
  const { notificationPreferences: cachedNotificationPreferences, replaceNotificationPreferences } =
    useCurrentProfile();
  const { language, setLanguage } = useAppLanguage();
  const { preference, setPreference, theme: appTheme } = useAppTheme();
  const { dustEnabled, lightingEnabled, setDustEnabled, setLightingEnabled } = useAppVisualEffects();
  const [signOutError, setSignOutError] = useState<string>();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState<string>();
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences | null>(
    cachedNotificationPreferences,
  );
  const appearanceOptions: readonly { description: string; label: string; value: ThemePreference }[] = [
    {
      description: t("settings.appearanceSystemDescription"),
      label: t("settings.appearanceSystem"),
      value: "system",
    },
    {
      description: t("settings.appearanceLightDescription"),
      label: t("settings.appearanceLight"),
      value: "light",
    },
    {
      description: t("settings.appearanceDarkDescription"),
      label: t("settings.appearanceDark"),
      value: "dark",
    },
  ];

  /** Enables or hides the decorative foreground dust across the app. */
  const handleDustEnabledChange = (enabled: boolean) => {
    void setDustEnabled(enabled);
  };

  /** Enables or hides the decorative sunlight, beams, and haze across the app. */
  const handleLightingEnabledChange = (enabled: boolean) => {
    void setLightingEnabled(enabled);
  };

  /** Loads the server-owned reminder preferences once Settings becomes available. */
  const loadNotificationPreferences = useCallback(async () => {
    setNotificationError(undefined);
    setIsLoadingNotifications(true);
    try {
      const preferences = await getNotificationPreferences();
      setNotificationPreferences(preferences);
      replaceNotificationPreferences(preferences);
    } catch (error) {
      logDevelopmentError("loading notification preferences", error);
      setNotificationError(t("settings.notificationsLoadError"));
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [replaceNotificationPreferences, t]);

  useEffect(() => {
    void loadNotificationPreferences();
  }, [loadNotificationPreferences]);

  /** Optimistically changes one reminder preference and restores the prior value when saving fails. */
  const handleNotificationPreferenceChange = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!notificationPreferences || isSavingNotifications) return;

    const previousPreferences = notificationPreferences;
    const nextPreferences = { ...previousPreferences, [key]: value };
    setNotificationError(undefined);
    setNotificationPreferences(nextPreferences);
    setIsSavingNotifications(true);
    try {
      const savedPreferences = await updateNotificationPreferences({ [key]: value });
      setNotificationPreferences(savedPreferences);
      replaceNotificationPreferences(savedPreferences);
    } catch (error) {
      logDevelopmentError("saving notification preferences", error);
      setNotificationPreferences(previousPreferences);
      setNotificationError(t("settings.notificationsSaveError"));
    } finally {
      setIsSavingNotifications(false);
    }
  };

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
      description={t("settings.description")}
      headerVariant="compact"
      onBack={() => router.back()}
      title={t("settings.title")}
      testID="settings-screen"
    >
      <View style={styles.cardList} testID="settings-card-list">
        <Card title={t("common.language")}>
          <Text style={styles.languageDescription}>{t("settings.languageDescription")}</Text>
          <LanguageSelector language={language} onChange={(nextLanguage) => void setLanguage(nextLanguage)} />
        </Card>
        <Card title={t("settings.appearance")}>
          <View
            accessibilityLabel={t("settings.appearance")}
            accessibilityRole="radiogroup"
            style={styles.appearanceGroup}
          >
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
        <Card title={t("settings.backgroundEffectsTitle")}>
          <Text style={styles.backgroundEffectsDescription}>{t("settings.backgroundEffectsDescription")}</Text>
          <View style={styles.backgroundEffectsList}>
            <View style={styles.effectRow}>
              <View style={styles.effectCopy}>
                <Text style={styles.effectLabel}>{t("settings.backgroundLighting")}</Text>
                <Text style={styles.effectDescription}>{t("settings.backgroundLightingDescription")}</Text>
              </View>
              <Switch
                accessibilityHint={t("settings.backgroundLightingDescription")}
                accessibilityLabel={t("settings.backgroundLighting")}
                accessibilityRole="switch"
                accessibilityState={{ checked: lightingEnabled }}
                onValueChange={handleLightingEnabledChange}
                thumbColor={appTheme.colors.text.inverse}
                trackColor={{ false: appTheme.colors.semantic.disabled, true: appTheme.colors.brand.primary }}
                value={lightingEnabled}
              />
            </View>
            <View style={styles.effectRow}>
              <View style={styles.effectCopy}>
                <Text style={styles.effectLabel}>{t("settings.backgroundDust")}</Text>
                <Text style={styles.effectDescription}>{t("settings.backgroundDustDescription")}</Text>
              </View>
              <Switch
                accessibilityHint={t("settings.backgroundDustDescription")}
                accessibilityLabel={t("settings.backgroundDust")}
                accessibilityRole="switch"
                accessibilityState={{ checked: dustEnabled }}
                onValueChange={handleDustEnabledChange}
                thumbColor={appTheme.colors.text.inverse}
                trackColor={{ false: appTheme.colors.semantic.disabled, true: appTheme.colors.brand.primary }}
                value={dustEnabled}
              />
            </View>
          </View>
        </Card>
        <Card title={t("settings.prayerTitle")}>
          <Text style={styles.notificationsDescription}>{t("settings.prayerCopy")}</Text>
          {isLoadingNotifications ? (
            <Text accessibilityLiveRegion="polite" style={styles.notificationsStatus}>
              {t("settings.notificationsLoading")}
            </Text>
          ) : null}
          {notificationError && !isLoadingNotifications ? (
            <View accessibilityRole="alert" style={styles.notificationsError}>
              <Text style={styles.error}>{notificationError}</Text>
              <Button onPress={() => void loadNotificationPreferences()} size="sm" variant="secondary">
                {t("common.retry")}
              </Button>
            </View>
          ) : null}
          {notificationPreferences && !isLoadingNotifications ? (
            <View style={styles.notificationsList}>
              <NotificationPreferenceRow
                copy={t("settings.dailyRosaryReminderDescription")}
                disabled={isSavingNotifications}
                label={t("settings.dailyRosaryReminder")}
                onValueChange={(value) => void handleNotificationPreferenceChange("dailyRosaryReminder", value)}
                value={notificationPreferences.dailyRosaryReminder}
              />
              <NotificationPreferenceRow
                copy={t("settings.confessionReminderDescription")}
                disabled={isSavingNotifications}
                label={t("settings.confessionReminder")}
                onValueChange={(value) => void handleNotificationPreferenceChange("confessionReminder", value)}
                value={notificationPreferences.confessionReminder}
              />
              <NotificationPreferenceRow
                copy={t("settings.eucharisticAdorationDescription")}
                disabled={isSavingNotifications}
                label={t("settings.eucharisticAdoration")}
                onValueChange={(value) => void handleNotificationPreferenceChange("eucharisticAdoration", value)}
                value={notificationPreferences.eucharisticAdoration}
              />
            </View>
          ) : null}
        </Card>
        <Card title={t("settings.accountTitle")}>
          <View style={styles.row}>
            <Feather color={theme.colors.icon.secondary} name="shield" size={theme.sizes.iconMedium} />
            <Text style={styles.description}>{t("settings.accountCopy")}</Text>
          </View>
          <View style={styles.accountActions}>
            <Button fullWidth onPress={() => router.push("/change-email")} variant="secondary">
              {t("settings.changeEmail")}
            </Button>
            <Button
              disabled={Boolean(configurationError)}
              fullWidth
              loading={isSigningOut}
              onPress={() => void signOut()}
              variant="ghost"
            >
              {t("settings.signOut")}
            </Button>
            {signOutError ? <Text style={styles.error}>{signOutError}</Text> : null}
          </View>
        </Card>
      </View>
    </ScreenShell>
  );
}

/** Renders one server-managed prayer reminder switch within Settings. */
function NotificationPreferenceRow({
  copy,
  disabled,
  label,
  onValueChange,
  value,
}: {
  copy: string;
  disabled: boolean;
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
}) {
  const styles = useThemedStyles(styleSheet);
  const { theme: appTheme } = useAppTheme();
  return (
    <View style={styles.notificationRow}>
      <View style={styles.notificationCopy}>
        <Text style={styles.notificationLabel}>{label}</Text>
        <Text style={styles.notificationRowDescription}>{copy}</Text>
      </View>
      <Switch
        accessibilityHint={copy}
        accessibilityLabel={label}
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        disabled={disabled}
        onValueChange={onValueChange}
        thumbColor={appTheme.colors.text.inverse}
        trackColor={{ false: appTheme.colors.semantic.disabled, true: appTheme.colors.brand.primary }}
        value={value}
      />
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  content: { maxWidth: 700 },
  cardList: { gap: theme.spacing[4] },
  appearanceCopy: {
    flex: 1,
    minWidth: 0,
  },
  backgroundEffectsDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
  },
  backgroundEffectsList: {
    gap: theme.spacing[3],
    marginTop: theme.spacing[3],
  },
  effectRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
  },
  effectCopy: {
    flex: 1,
    minWidth: 0,
  },
  effectLabel: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
  },
  effectDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0.5],
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
  languageDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing[3],
  },
  notificationCopy: { flex: 1, minWidth: 0 },
  notificationLabel: { ...theme.typography.bodyMedium, color: theme.colors.text.primary },
  notificationRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: theme.sizes.touchTarget + theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  notificationRowDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0.5],
  },
  notificationsDescription: { ...theme.typography.bodySmall, color: theme.colors.text.muted },
  notificationsError: { alignItems: "center", gap: theme.spacing[2], marginTop: theme.spacing[3] },
  notificationsList: { marginTop: theme.spacing[3] },
  notificationsStatus: { ...theme.typography.bodySmall, color: theme.colors.text.muted, marginTop: theme.spacing[3] },
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
