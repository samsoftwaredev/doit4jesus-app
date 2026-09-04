import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { Button } from "@/components/ui";
import { AuthMessage, AuthScreen, AuthTextInput, authScreenStyles, useAuth } from "@/features/auth";
import { supabase } from "@/lib/supabase";
import { useThemedStyles } from "@/theme/createThemedStyles";

/** Renders password-reset controls with appearance-aware shared authentication styles. */
export default function ResetPasswordScreen() {
  const styles = useThemedStyles(authScreenStyles);
  const router = useRouter();
  const { configurationError, finishPasswordRecovery } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");

  const updatePassword = async () => {
    setErrorMessage(undefined);
    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    finishPasswordRecovery();
    router.replace("/");
  };

  return (
    <AuthScreen title="Choose a new password" subtitle="Your reset link has been verified.">
      <AuthTextInput
        accessibilityLabel="New password"
        autoCapitalize="none"
        autoComplete="new-password"
        label="New password"
        onChangeText={setPassword}
        placeholder="New password"
        secureTextEntry
        textContentType="newPassword"
        value={password}
      />
      {configurationError || errorMessage ? (
        <AuthMessage>{configurationError ?? errorMessage ?? ""}</AuthMessage>
      ) : null}
      <View style={styles.actions}>
        <Button
          disabled={!password || Boolean(configurationError)}
          fullWidth
          loading={isSubmitting}
          onPress={() => void updatePassword()}
        >
          Save new password
        </Button>
      </View>
    </AuthScreen>
  );
}
