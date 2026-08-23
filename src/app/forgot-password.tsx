import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

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

export default function ForgotPasswordScreen() {
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
      setSuccessMessage("If an account uses this email, check your inbox for a reset link.");
    }
    setIsSubmitting(false);
  };

  return (
    <AuthScreen title="Reset password" subtitle="We will email you a secure reset link.">
      <AuthTextInput
        accessibilityLabel="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="you@example.com"
        textContentType="emailAddress"
        value={email}
      />
      {configurationError || errorMessage ? (
        <AuthMessage>{configurationError ?? errorMessage ?? ""}</AuthMessage>
      ) : null}
      {successMessage ? <AuthMessage tone="success">{successMessage}</AuthMessage> : null}
      <View style={authScreenStyles.actions}>
        <Button
          disabled={!email.trim() || Boolean(configurationError)}
          fullWidth
          loading={isSubmitting}
          onPress={() => void requestPasswordReset()}
        >
          Email reset link
        </Button>
      </View>
      <Link href="/sign-in" style={authScreenStyles.link}>
        Back to sign in
      </Link>
    </AuthScreen>
  );
}
