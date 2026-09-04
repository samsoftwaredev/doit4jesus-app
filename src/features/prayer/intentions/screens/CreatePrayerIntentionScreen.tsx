import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { Button } from "@/components/ui";
import { BackHeader } from "@/components/navigation";
import { ProfileToast } from "@/features/profile/components/ProfileToast";
import {
  createPrayerIntention,
  invalidateMyPrayerIntentions,
  prayerIntentionSymbols,
  getPrayerIntentionTheme,
} from "@/features/prayer/intentions";
import type { PrayerIntentionSymbol } from "@/features/prayer/intentions";
import { theme } from "@/theme/tokens";

/** Renders the authenticated form for creating a prayer intention. */
export function CreatePrayerIntentionScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol] = useState<PrayerIntentionSymbol>("candle");
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setError(undefined);
    setSuccess(undefined);
    setIsSubmitting(true);
    try {
      await createPrayerIntention({ description, symbol, title });
      invalidateMyPrayerIntentions();
      setTitle("");
      setDescription("");
      setSymbol("candle");
      setSuccess("Prayer intention submitted for review. It will be public after approval.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Couldn’t submit your prayer intention.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader onBack={() => router.back()} title="Share an Intention" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Share a prayer intention with the community. It will be reviewed before it becomes public.
        </Text>
        <Field label="Title" value={title} onChangeText={setTitle} maxLength={120} placeholder="Praying for…" />
        <Field
          label="Description"
          value={description}
          onChangeText={setDescription}
          maxLength={250}
          multiline
          placeholder="How can the community pray with you?"
        />
        <Text style={styles.label}>SYMBOL</Text>
        <View style={styles.symbols}>
          {prayerIntentionSymbols.map((option) => {
            const optionTheme = getPrayerIntentionTheme(option);
            const selected = symbol === option;
            return (
              <Pressable
                accessibilityLabel={`Use ${option.replace("_", " ")} symbol`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={option}
                onPress={() => setSymbol(option)}
                style={[
                  styles.symbol,
                  {
                    borderColor: selected ? theme.rosary.colors.gold : optionTheme.surfaceLight,
                    backgroundColor: optionTheme.surface,
                  },
                ]}
              >
                <Feather
                  accessible={false}
                  color={theme.rosary.colors.goldBright}
                  name={optionTheme.icon}
                  size={theme.sizes.iconMedium}
                />
                <Text style={styles.symbolText}>{option.replace("_", " ")}</Text>
              </Pressable>
            );
          })}
        </View>
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
        <Button fullWidth loading={isSubmitting} onPress={() => void submit()} variant="warning">
          Submit for Review
        </Button>
        <ProfileToast message={success} onDismiss={() => setSuccess(undefined)} />
      </ScrollView>
    </AtmosphericSafeAreaView>
  );
}

function Field({
  label,
  maxLength,
  multiline = false,
  onChangeText,
  placeholder,
  value,
}: {
  label: string;
  maxLength: number;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <View>
      <View style={styles.fieldHeader}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <Text style={styles.count}>
          {value.length}/{maxLength}
        </Text>
      </View>
      <TextInput
        accessibilityLabel={label}
        maxLength={maxLength}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.subtle}
        style={[styles.input, multiline && styles.textArea]}
        textAlignVertical={multiline ? "top" : "center"}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: theme.spacing[4], padding: theme.spacing[4], paddingBottom: theme.spacing[7] },
  count: { ...theme.typography.caption, color: theme.colors.text.subtle },
  error: { ...theme.typography.bodySmall, color: theme.colors.text.danger },
  fieldHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing[1],
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    color: theme.colors.text.white,
    minHeight: theme.sizes.inputHeight,
    paddingHorizontal: theme.spacing[3],
  },
  intro: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
  label: { ...theme.typography.labelSmall, color: theme.rosary.colors.gold, letterSpacing: theme.letterSpacing.wider },
  safeArea: { backgroundColor: theme.colors.background.primary, flex: 1 },
  symbol: {
    alignItems: "center",
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[1],
    justifyContent: "center",
    minHeight: theme.sizes.buttonHeightLarge,
    paddingHorizontal: theme.spacing[2],
    width: "47%",
  },
  symbolText: { ...theme.typography.caption, color: theme.colors.text.white, textTransform: "capitalize" },
  symbols: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2], justifyContent: "space-between" },
  textArea: { minHeight: 120, paddingTop: theme.spacing[3] },
});
