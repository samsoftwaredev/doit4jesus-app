import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { LanguageSelector } from "@/components";
import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import { useAuth } from "@/features/auth";
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
  const { language, setLanguage } = useAppLanguage();
  const { preference, setPreference, theme: appTheme } = useAppTheme();
  const { dustEnabled, lightingEnabled, setDustEnabled, setLightingEnabled } = useAppVisualEffects();
  const [signOutError, setSignOutError] = useState<string>();
  const [isSigningOut, setIsSigningOut] = useState(false);
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
          <View style={styles.row}>
            <Feather color={theme.colors.icon.active} name="bell" size={theme.sizes.iconMedium} />
            <Text style={styles.description}>{t("settings.prayerCopy")}</Text>
          </View>
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
