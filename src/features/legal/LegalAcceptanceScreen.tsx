import { useState } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import { getLocalizedLegalUrls } from "@/config/app-config";
import { acceptLegalDocuments, useCurrentProfile } from "@/features/profile";
import { supabase } from "@/lib/supabase";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

export function LegalAcceptanceScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { language } = useAppLanguage();
  const { refreshProfile } = useCurrentProfile();
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const urls = getLocalizedLegalUrls(language);

  async function submit() {
    if (!confirmed || isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await acceptLegalDocuments(language);
      await refreshProfile();
    } catch {
      setError(t("legalAcceptance.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.title}>
            {t("legalAcceptance.title")}
          </Text>
          <Text style={styles.description}>{t("legalAcceptance.description")}</Text>

          <Pressable
            accessibilityLabel={t("legalAcceptance.confirmation")}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: confirmed }}
            onPress={() => setConfirmed((value) => !value)}
            style={({ pressed }) => [
              styles.confirmation,
              confirmed && styles.confirmationSelected,
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.checkbox, confirmed && styles.checkboxSelected]}>
              {confirmed ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.confirmationText}>{t("legalAcceptance.confirmation")}</Text>
          </Pressable>

          <Text style={styles.policyCopy}>
            {t("legalAcceptance.agreementPrefix")}
            <Text accessibilityRole="link" onPress={() => void Linking.openURL(urls.terms)} style={styles.link}>
              {t("legalAcceptance.terms")}
            </Text>
            {t("legalAcceptance.agreementMiddle")}
            <Text
              accessibilityRole="link"
              onPress={() => void Linking.openURL(urls.communityGuidelines)}
              style={styles.link}
            >
              {t("legalAcceptance.guidelines")}
            </Text>
            {t("legalAcceptance.privacyPrefix")}
            <Text accessibilityRole="link" onPress={() => void Linking.openURL(urls.privacy)} style={styles.link}>
              {t("legalAcceptance.privacy")}
            </Text>
            {t("legalAcceptance.privacySuffix")}
          </Text>

          {error ? (
            <Text accessibilityLiveRegion="polite" style={styles.error}>
              {error}
            </Text>
          ) : null}

          <Button disabled={!confirmed} fullWidth loading={isSubmitting} onPress={() => void submit()}>
            {t("legalAcceptance.continue")}
          </Button>
          <Button disabled={isSubmitting} fullWidth onPress={() => void supabase.auth.signOut()} variant="outline">
            {t("profile.signOut")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  safeArea: { backgroundColor: theme.colors.background.primary, flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", padding: theme.spacing[5] },
  card: {
    backgroundColor: theme.colors.surface.primary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[4],
    padding: theme.spacing[5],
  },
  title: { ...theme.typography.heading2, color: theme.colors.text.primary, textAlign: "center" },
  description: { ...theme.typography.body, color: theme.colors.text.secondary, textAlign: "center" },
  confirmation: {
    alignItems: "flex-start",
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
    padding: theme.spacing[3],
  },
  confirmationSelected: { borderColor: theme.colors.brand.primaryLight },
  checkbox: {
    alignItems: "center",
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.sm,
    borderWidth: theme.borderWidths.medium,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  checkboxSelected: { backgroundColor: theme.colors.brand.primary, borderColor: theme.colors.brand.primaryLight },
  checkmark: { color: theme.colors.text.white, fontSize: 16, fontWeight: "700" },
  confirmationText: { ...theme.typography.body, color: theme.colors.text.primary, flex: 1 },
  policyCopy: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, lineHeight: 22 },
  link: { color: theme.colors.text.link, textDecorationLine: "underline" },
  error: { ...theme.typography.bodySmall, color: theme.colors.text.danger, textAlign: "center" },
  pressed: { opacity: 0.8 },
}));
