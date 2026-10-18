import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import {
  AuthMessage,
  AuthScreen,
  AuthTextInput,
  authScreenStyles,
  createAuthRedirectUrl,
  startGoogleOAuth,
  useAuth,
} from "@/features/auth";
import { isWeakPassword } from "@/features/auth/password-validation";
import { supabase } from "@/lib/supabase";
import { useThemedStyles } from "@/theme/createThemedStyles";

type SignUpValues = {
  email: string;
  password: string;
};

/** Renders account creation controls with appearance-aware shared authentication styles. */
export default function SignUpScreen() {
  const styles = useThemedStyles(authScreenStyles);
  const { t } = useTranslation();
  const { configurationError } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>();
  const { control, handleSubmit } = useForm<SignUpValues>({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  /** Returns a localized email validation result after trimming user-entered whitespace. */
  function validateEmail(email: string): string | true {
    if (!email.trim()) return t("auth.validation.emailRequired");
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email.trim()) || t("auth.validation.emailInvalid");
  }

  /** Returns required or predictable-password guidance for the account creation password. */
  function validatePassword(password: string): string | true {
    if (!password) return t("auth.validation.passwordRequired");
    return !isWeakPassword(password) || t("auth.validation.weakPassword");
  }

  /** Creates an account with validated credentials and reports the authentication service result. */
  async function signUp({ email, password }: SignUpValues): Promise<void> {
    if (isSubmitting) return;
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      options: {
        emailRedirectTo: createAuthRedirectUrl("/"),
      },
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else if (!data.session) {
      setSuccessMessage(t("auth.checkEmail"));
    }
    setIsSubmitting(false);
  }

  /** Runs client-side form validation before attempting account creation. */
  function handleSignUpPress(): void {
    void handleSubmit(signUp)();
  }

  /** Opens Google authentication and reports provider or browser failures on this screen. */
  async function handleGoogleAuth(): Promise<void> {
    if (isGoogleSubmitting) return;
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    setIsGoogleSubmitting(true);

    try {
      await startGoogleOAuth();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t("auth.googleError"));
    } finally {
      setIsGoogleSubmitting(false);
    }
  }

  /** Starts Google authentication without leaving an unhandled promise. */
  function handleGoogleAuthPress(): void {
    void handleGoogleAuth();
  }

  return (
    <AuthScreen
      googleAuthDisabled={Boolean(configurationError) || isSubmitting}
      googleAuthLoading={isGoogleSubmitting}
      onGoogleAuth={handleGoogleAuthPress}
      title={t("auth.createAccount")}
      subtitle={t("auth.createAccountDescription")}
    >
      <Controller
        control={control}
        name="email"
        rules={{ validate: validateEmail }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <AuthTextInput
            accessibilityLabel={t("auth.email")}
            autoCapitalize="none"
            autoComplete="email"
            errorMessage={error?.message}
            keyboardType="email-address"
            label={t("auth.email")}
            onChangeText={onChange}
            placeholder={t("auth.emailPlaceholder")}
            textContentType="emailAddress"
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{ validate: validatePassword }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <AuthTextInput
            accessibilityLabel={t("auth.password")}
            autoCapitalize="none"
            autoComplete="new-password"
            errorMessage={error?.message}
            label={t("auth.password")}
            onChangeText={onChange}
            placeholder={t("auth.password")}
            secureTextEntry
            textContentType="newPassword"
            value={value}
          />
        )}
      />
      {configurationError || errorMessage ? (
        <AuthMessage>{configurationError ?? errorMessage ?? ""}</AuthMessage>
      ) : null}
      {successMessage ? <AuthMessage tone="success">{successMessage}</AuthMessage> : null}
      <View style={styles.actions}>
        <Button
          disabled={Boolean(configurationError) || isGoogleSubmitting}
          fullWidth
          loading={isSubmitting}
          onPress={handleSignUpPress}
        >
          {t("auth.createAccount")}
        </Button>
      </View>
      <Link href="/login" style={styles.link}>
        {t("auth.alreadyHaveAccount")}
      </Link>
    </AuthScreen>
  );
}
