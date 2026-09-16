import Feather from "@expo/vector-icons/Feather";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import type { SupportedLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

export type LanguageSelectorProps = {
  accessibilityLabel?: string;
  language: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
};

const options: readonly { label: string; value: SupportedLanguage }[] = [
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
];

/** Renders the two supported languages as accessible, touch-friendly radio options. */
export function LanguageSelector({ accessibilityLabel, language, onChange }: LanguageSelectorProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? t("language.groupLabel")}
      accessibilityRole="radiogroup"
      style={styles.group}
    >
      {options.map((option) => {
        const selected = option.value === language;
        return (
          <Pressable
            accessibilityLabel={option.label}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.optionPressed]}
          >
            <View style={[styles.indicator, selected && styles.indicatorSelected]}>
              {selected ? <Feather accessible={false} color={styles.check.color} name="check" size={16} /> : null}
            </View>
            <Text style={styles.label}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  check: { color: theme.colors.icon.inverse },
  group: { gap: theme.spacing[3], width: "100%" },
  indicator: {
    alignItems: "center",
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.medium,
    height: theme.spacing[6],
    justifyContent: "center",
    width: theme.spacing[6],
  },
  indicatorSelected: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.border.focus,
  },
  label: { ...theme.typography.bodyMedium, color: theme.colors.text.primary },
  option: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  optionPressed: { opacity: theme.opacity.pressed },
  optionSelected: {
    backgroundColor: theme.colors.surface.green,
    borderColor: theme.colors.border.focus,
    borderWidth: theme.borderWidths.medium,
  },
}));
