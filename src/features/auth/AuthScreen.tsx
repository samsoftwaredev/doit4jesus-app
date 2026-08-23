import type { ComponentProps } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Card } from "@/components/ui";
import { theme } from "@/theme/tokens";

type AuthScreenProps = {
  children: React.ReactNode;
  subtitle: string;
  title: string;
};

type AuthTextInputProps = ComponentProps<typeof TextInput> & {
  label: string;
};

export function AuthScreen({ children, subtitle, title }: AuthScreenProps) {
  return (
    <ScreenShell
      eyebrow="WELCOME"
      title={title}
      subtitle={subtitle}
      contentContainerStyle={styles.content}
    >
      <Card fullWidth>
        <View style={styles.form}>{children}</View>
      </Card>
    </ScreenShell>
  );
}

export function AuthTextInput({ label, ...inputProps }: AuthTextInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={theme.colors.text.subtle}
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

export function AuthMessage({
  children,
  tone = "error",
}: {
  children: string;
  tone?: "error" | "success";
}) {
  return (
    <Text style={[styles.message, tone === "error" ? styles.error : styles.success]}>
      {children}
    </Text>
  );
}

export const authScreenStyles = StyleSheet.create({
  actions: {
    gap: theme.spacing[3],
    marginTop: theme.spacing[5],
  },
  link: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.link,
    textAlign: "center",
  },
});

const styles = StyleSheet.create({
  content: {
    maxWidth: 480,
  },
  error: {
    color: theme.colors.text.danger,
  },
  field: {
    gap: theme.spacing[1.5],
  },
  form: {
    gap: theme.spacing[4],
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface.primary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.sm,
    borderWidth: theme.borderWidths.thin,
    color: theme.colors.text.primary,
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.text.secondary,
  },
  message: {
    ...theme.typography.body,
    marginTop: theme.spacing[4],
    textAlign: "center",
  },
  success: {
    color: theme.colors.text.success,
  },
});
