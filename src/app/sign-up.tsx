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

/** Renders account creation controls with appearance-aware shared authentication styles. */
export default function SignUpScreen() {
  const styles = useThemedStyles(authScreenStyles);
  const { t } = useTranslation();
  const { configurationError } = useAuth();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string>();

  const signUp = async () => {
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
  };

  return (
    <AuthScreen title={t("auth.createAccount")} subtitle={t("auth.createAccountDescription")}>
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
      <AuthTextInput
        accessibilityLabel={t("auth.password")}
        autoCapitalize="none"
        autoComplete="new-password"
        label={t("auth.password")}
        onChangeText={setPassword}
        placeholder={t("auth.password")}
        secureTextEntry
        textContentType="newPassword"
        value={password}
      />
      {configurationError || errorMessage ? (
        <AuthMessage>{configurationError ?? errorMessage ?? ""}</AuthMessage>
      ) : null}
      {successMessage ? <AuthMessage tone="success">{successMessage}</AuthMessage> : null}
      <View style={styles.actions}>
        <Button
          disabled={!email.trim() || !password || Boolean(configurationError)}
          fullWidth
          loading={isSubmitting}
          onPress={() => void signUp()}
        >
          {t("auth.createAccount")}
        </Button>
      </View>
      <Link href="/sign-in" style={styles.link}>
        {t("auth.alreadyHaveAccount")}
      </Link>
    </AuthScreen>
  );
}
