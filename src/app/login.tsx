import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  AuthMessage,
  AuthScreen,
  AuthTextInput,
  authScreenStyles,
  startAppleSignIn,
  startGoogleOAuth,
  useAuth,
} from "@/features/auth";
import { Button } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useThemedStyles } from "@/theme/createThemedStyles";

type SignInValues = {
  email: string;
  password: string;
};

/** Renders sign-in controls with appearance-aware shared authentication styles. */
export default function SignInScreen() {
  const styles = useThemedStyles(authScreenStyles);
  const { t } = useTranslation();
  const { configurationError } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isAppleSubmitting, setIsAppleSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit } = useForm<SignInValues>({
    defaultValues: { email: "", password: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  /** Returns a localized email validation result after trimming user-entered whitespace. */
  function validateEmail(email: string): string | true {
    if (!email.trim()) return t("auth.validation.emailRequired");
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email.trim()) || t("auth.validation.emailInvalid");
  }

  /** Sends validated sign-in credentials to Supabase and displays its response error when present. */
  async function signIn({ email, password }: SignInValues): Promise<void> {
    if (isSubmitting) return;
    setErrorMessage(undefined);
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) setErrorMessage(error.message);
    setIsSubmitting(false);
  }

  /** Runs client-side form validation before attempting to sign in. */
  function handleSignInPress(): void {
    void handleSubmit(signIn)();
  }

  /** Opens Google authentication and reports provider or browser failures on this screen. */
  async function handleGoogleAuth(): Promise<void> {
    if (isGoogleSubmitting) return;
    setErrorMessage(undefined);
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

  async function handleAppleAuth(): Promise<void> {
    if (isAppleSubmitting) return;
    setErrorMessage(undefined);
    setIsAppleSubmitting(true);
    try {
      await startAppleSignIn();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t("auth.appleError"));
    } finally {
      setIsAppleSubmitting(false);
    }
  }

  return (
    <AuthScreen
      appleAuthDisabled={Boolean(configurationError) || isSubmitting || isGoogleSubmitting}
      appleAuthLoading={isAppleSubmitting}
      googleAuthDisabled={Boolean(configurationError) || isSubmitting}
      googleAuthLoading={isGoogleSubmitting}
      onGoogleAuth={handleGoogleAuthPress}
      onAppleAuth={() => void handleAppleAuth()}
      title={t("auth.signIn")}
      subtitle={t("auth.signInDescription")}
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
        rules={{ required: t("auth.validation.passwordRequired") }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <AuthTextInput
            accessibilityLabel={t("auth.password")}
            autoCapitalize="none"
            autoComplete="current-password"
            errorMessage={error?.message}
            label={t("auth.password")}
            onChangeText={onChange}
            placeholder={t("auth.password")}
            secureTextEntry
            textContentType="password"
            value={value}
          />
        )}
      />
      {configurationError || errorMessage ? (
        <AuthMessage>{configurationError ?? errorMessage ?? ""}</AuthMessage>
      ) : null}
      <View style={styles.actions}>
        <Button
          disabled={Boolean(configurationError) || isGoogleSubmitting}
          fullWidth
          loading={isSubmitting}
          onPress={handleSignInPress}
        >
          {t("auth.signIn")}
        </Button>
      </View>
      <Link href="/forgot-password" style={styles.link}>
        {t("auth.forgotPassword")}
      </Link>
      <Link href="/sign-up" style={styles.link}>
        {t("auth.createAccount")}
      </Link>
    </AuthScreen>
  );
}
