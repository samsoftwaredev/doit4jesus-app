import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { AuthMessage, AuthScreen, AuthTextInput, authScreenStyles, useAuth } from "@/features/auth";
import { Button } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useThemedStyles } from "@/theme/createThemedStyles";

/** Renders sign-in controls with appearance-aware shared authentication styles. */
export default function SignInScreen() {
  const styles = useThemedStyles(authScreenStyles);
  const { t } = useTranslation();
  const { configurationError } = useAuth();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");

  const signIn = async () => {
    setErrorMessage(undefined);
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) setErrorMessage(error.message);
    setIsSubmitting(false);
  };

  return (
    <AuthScreen title={t("auth.signIn")} subtitle={t("auth.signInDescription")}>
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
        autoComplete="current-password"
        label={t("auth.password")}
        onChangeText={setPassword}
        placeholder={t("auth.password")}
        secureTextEntry
        textContentType="password"
        value={password}
      />
      {configurationError || errorMessage ? (
        <AuthMessage>{configurationError ?? errorMessage ?? ""}</AuthMessage>
      ) : null}
      <View style={styles.actions}>
        <Button
          disabled={!email.trim() || !password || Boolean(configurationError)}
          fullWidth
          loading={isSubmitting}
          onPress={() => void signIn()}
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
