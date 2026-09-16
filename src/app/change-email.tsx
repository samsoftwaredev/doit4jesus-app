import { useRouter } from "expo-router";
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

/** Renders email-change controls with appearance-aware shared authentication styles. */
export default function ChangeEmailScreen() {
  const styles = useThemedStyles(authScreenStyles);
  const { t } = useTranslation();
  const router = useRouter();
  const { configurationError } = useAuth();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>();

  const changeEmail = async () => {
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser(
      { email: email.trim() },
      { emailRedirectTo: createAuthRedirectUrl("/") },
    );
    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage(t("auth.changeEmailSuccess"));
    }
    setIsSubmitting(false);
  };

  return (
    <AuthScreen title={t("auth.changeEmail")} subtitle={t("auth.changeEmailDescription")}>
      <AuthTextInput
        accessibilityLabel={t("auth.newEmail")}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        label={t("auth.newEmail")}
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
          onPress={() => void changeEmail()}
        >
          {t("auth.changeEmail")}
        </Button>
        <Button fullWidth onPress={() => router.back()} variant="ghost">
          {t("common.cancel")}
        </Button>
      </View>
    </AuthScreen>
  );
}
