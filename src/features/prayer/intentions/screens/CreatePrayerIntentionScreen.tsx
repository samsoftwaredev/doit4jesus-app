import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { Button } from "@/components/ui";
import { BackHeader } from "@/components/navigation";
import {
  createPrayerIntention,
  invalidateMyPrayerIntentions,
  prayerIntentionSymbols,
  getPrayerIntentionTheme,
} from "@/features/prayer/intentions";
import type { PrayerIntentionSymbol } from "@/features/prayer/intentions";
import { logDevelopmentError } from "@/lib/development-logger";
import { useAppTheme } from "@/theme/AppThemeProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

/** Renders the authenticated form for creating a prayer intention. */
export function CreatePrayerIntentionScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol] = useState<PrayerIntentionSymbol>("candle");
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Submits the selected intention and replaces this completed form with the user's intentions list. */
  const handleSubmit = async () => {
    setError(undefined);
    setIsSubmitting(true);
    try {
      await createPrayerIntention({ description, symbol, title });
      invalidateMyPrayerIntentions();
      router.replace("/my-prayer-intentions");
    } catch (requestError) {
      logDevelopmentError("creating a prayer intention", requestError);
      setError(requestError instanceof Error ? requestError.message : t("intentions.create.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader
        description={t("intentions.create.description")}
        onBack={() => router.back()}
        title={t("intentions.create.title")}
      />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Field
          label={t("intentions.create.titleField")}
          value={title}
          onChangeText={setTitle}
          maxLength={120}
          placeholder={t("intentions.create.titlePlaceholder")}
        />
        <Field
          label={t("intentions.create.descriptionField")}
          value={description}
          onChangeText={setDescription}
          maxLength={250}
          multiline
          placeholder={t("intentions.create.descriptionPlaceholder")}
        />
        <Text style={styles.label}>{t("intentions.create.symbol")}</Text>
        <View style={styles.symbols}>
          {prayerIntentionSymbols.map((option) => {
            const optionTheme = getPrayerIntentionTheme(option, colorScheme);
            const selected = symbol === option;
            const symbolDescription = t(`intentions.create.symbolDescriptions.${option}`);
            return (
              <Pressable
                accessibilityLabel={symbolDescription}
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
                <Text style={styles.symbolText}>{symbolDescription}</Text>
              </Pressable>
            );
          })}
        </View>
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
        <Button fullWidth loading={isSubmitting} onPress={() => void handleSubmit()} variant="warning">
          {t("intentions.create.submit")}
        </Button>
      </ScrollView>
    </AtmosphericSafeAreaView>
  );
}

/** Renders Field with styles resolved from the active appearance. */
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
  const styles = useThemedStyles(styleSheet);
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

const styleSheet = createThemedStyles((theme) => ({
  content: {
    alignSelf: "center",
    gap: theme.spacing[4],
    maxWidth: 700,
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[7],
    width: "100%",
  },
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
}));
