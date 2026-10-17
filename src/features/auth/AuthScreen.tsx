import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

type AuthScreenProps = {
  children: React.ReactNode;
  googleAuthDisabled?: boolean;
  googleAuthLoading?: boolean;
  onGoogleAuth?: () => void;
  subtitle: string;
  title: string;
};

type AuthTextInputProps = ComponentProps<typeof TextInput> & {
  errorMessage?: string;
  label: string;
};

/** Renders the shared themed frame and optional Google action used by authentication screens. */
export function AuthScreen({
  children,
  googleAuthDisabled = false,
  googleAuthLoading = false,
  onGoogleAuth,
  subtitle,
  title,
}: AuthScreenProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ScreenShell
      contentContainerStyle={styles.content}
      description={subtitle}
      eyebrow={t("auth.eyebrow")}
      onBack={() => router.back()}
      title={title}
    >
      <Card fullWidth>
        <View style={styles.form}>
          {onGoogleAuth ? (
            <>
              <Button
                disabled={googleAuthDisabled}
                fullWidth
                leftIcon={
                  <MaterialCommunityIcons
                    accessible={false}
                    color={theme.colors.icon.primary}
                    name="google"
                    size={theme.sizes.iconMedium}
                  />
                }
                loading={googleAuthLoading}
                onPress={onGoogleAuth}
                variant="secondary"
              >
                {t("auth.continueWithGoogle")}
              </Button>
              <View accessible={false} style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerLabel}>{t("auth.or")}</Text>
                <View style={styles.dividerLine} />
              </View>
            </>
          ) : null}
          {children}
        </View>
      </Card>
    </ScreenShell>
  );
}

/** Renders a labeled authentication input and announces an optional validation error. */
export function AuthTextInput({ errorMessage, label, accessibilityHint, style, ...inputProps }: AuthTextInputProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        accessibilityHint={errorMessage ?? accessibilityHint}
        placeholderTextColor={theme.colors.text.subtle}
        style={[styles.input, errorMessage ? styles.inputError : undefined, style]}
      />
      {errorMessage ? (
        <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.fieldError}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

/** Renders an announced success or error message for an authentication flow. */
export function AuthMessage({ children, tone = "error" }: { children: string; tone?: "error" | "success" }) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Text
      accessibilityLiveRegion="polite"
      accessibilityRole={tone === "error" ? "alert" : undefined}
      style={[styles.message, tone === "error" ? styles.error : styles.success]}
    >
      {children}
    </Text>
  );
}

export const authScreenStyles = createThemedStyles((theme) => ({
  actions: {
    gap: theme.spacing[3],
    marginTop: theme.spacing[5],
  },
  link: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.link,
    textAlign: "center",
  },
}));

const styleSheet = createThemedStyles((theme) => ({
  content: {
    maxWidth: 480,
  },
  error: {
    color: theme.colors.text.danger,
  },
  divider: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[3],
  },
  dividerLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
  },
  dividerLine: {
    backgroundColor: theme.colors.border.subtle,
    flex: 1,
    height: theme.borderWidths.hairline,
  },
  field: {
    gap: theme.spacing[1.5],
  },
  fieldError: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.danger,
  },
  form: {
    gap: theme.spacing[4],
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface.primary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.sm,
    borderWidth: theme.borderWidths.thin,
    color: theme.colors.text.primary,
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  inputError: {
    borderColor: theme.colors.text.danger,
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.text.secondary,
  },
  message: {
    ...theme.typography.body,
    marginTop: theme.spacing[4],
    textAlign: "center",
  },
  success: {
    color: theme.colors.text.success,
  },
}));
