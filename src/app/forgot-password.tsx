import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import {
  AuthMessage,
  AuthScreen,
  AuthTextInput,
  authScreenStyles,
  createAuthRedirectUrl,
  useAuth,
} from "@/features/auth";
import { supabase } from "@/lib/supabase";
import { useThemedStyles } from "@/theme/createThemedStyles";

/** Renders password-recovery controls with appearance-aware shared authentication styles. */
export default function ForgotPasswordScreen() {
  const styles = useThemedStyles(authScreenStyles);
  const { t } = useTranslation();
  const { configurationError } = useAuth();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>();

  const requestPasswordReset = async () => {
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    setIsSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: createAuthRedirectUrl("/reset-password"),
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      // This wording intentionally does not reveal whether an account exists.
      setSuccessMessage(t("auth.resetNeutralSuccess"));
    }
    setIsSubmitting(false);
  };

  return (
    <AuthScreen title={t("auth.resetPassword")} subtitle={t("auth.resetDescription")}>
      <AuthTextInput
        accessibilityLabel={t("auth.email")}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        label={t("auth.email")}
        onChangeText={setEmail}
        placeholder={t("auth.emailPlaceholder")}
        textContentType="emailAddress"
        value={email}
      />
      {configurationError || errorMessage ? (
        <AuthMessage>{configurationError ?? errorMessage ?? ""}</AuthMessage>
      ) : null}
      {successMessage ? <AuthMessage tone="success">{successMessage}</AuthMessage> : null}
      <View style={styles.actions}>
        <Button
          disabled={!email.trim() || Boolean(configurationError)}
          fullWidth
          loading={isSubmitting}
          onPress={() => void requestPasswordReset()}
        >
          {t("auth.emailResetLink")}
        </Button>
      </View>
      <Link href="/login" style={styles.link}>
        {t("auth.backToSignIn")}
      </Link>
    </AuthScreen>
  );
}
