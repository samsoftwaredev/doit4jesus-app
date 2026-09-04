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
import { useThemedStyles } from "@/theme/createThemedStyles";

/** Renders account creation controls with appearance-aware shared authentication styles. */
export default function SignUpScreen() {
  const styles = useThemedStyles(authScreenStyles);
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
      setSuccessMessage("Check your email to confirm your account.");
    }
    setIsSubmitting(false);
  };

  return (
    <AuthScreen title="Create account" subtitle="Begin your prayer journey.">
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
      <AuthTextInput
        accessibilityLabel="Password"
        autoCapitalize="none"
        autoComplete="new-password"
        label="Password"
        onChangeText={setPassword}
        placeholder="Password"
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
          Create account
        </Button>
      </View>
      <Link href="/sign-in" style={styles.link}>
        Already have an account? Sign in
      </Link>
    </AuthScreen>
  );
}
