import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import {
  AuthMessage,
  AuthScreen,
  AuthTextInput,
  authScreenStyles,
  useAuth,
} from "@/features/auth";
import { Button } from "@/components/ui";
import { supabase } from "@/lib/supabase";

export default function SignInScreen() {
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
    <AuthScreen title="Sign in" subtitle="Continue your life of prayer.">
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
        autoComplete="current-password"
        label="Password"
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        textContentType="password"
        value={password}
      />
      {configurationError || errorMessage ? (
        <AuthMessage>{configurationError ?? errorMessage ?? ""}</AuthMessage>
      ) : null}
      <View style={authScreenStyles.actions}>
        <Button
          disabled={!email.trim() || !password || Boolean(configurationError)}
          fullWidth
          loading={isSubmitting}
          onPress={() => void signIn()}
        >
          Sign in
        </Button>
      </View>
      <Link href="/forgot-password" style={authScreenStyles.link}>
        Forgot password?
      </Link>
      <Link href="/sign-up" style={authScreenStyles.link}>
        Create an account
      </Link>
    </AuthScreen>
  );
}
