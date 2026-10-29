import { useState } from "react";
import { Modal, ScrollView, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { reportContent, type SafetyReportReason, type SafetyTargetType } from "./community-safety.api";

const reasons: SafetyReportReason[] = [
  "harassment",
  "threats_hate",
  "sexual_exploitative",
  "privacy",
  "scam_impersonation",
  "infringement",
  "spam_manipulation",
  "other",
];

export function ReportContentModal({
  onDismiss,
  targetId,
  targetType,
  visible,
}: {
  onDismiss: (submitted?: boolean) => void;
  targetId: string;
  targetType: SafetyTargetType;
  visible: boolean;
}) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const [reason, setReason] = useState<SafetyReportReason>("harassment");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    setError(false);
    try {
      await reportContent({ targetId, targetType, reason, details: details.trim() || undefined });
      setDetails("");
      onDismiss(true);
    } catch (submitError) {
      logDevelopmentError("submitting a safety report", submitError);
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal animationType="fade" onRequestClose={() => onDismiss()} transparent visible={visible}>
      <View style={styles.backdrop}>
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text accessibilityRole="header" style={styles.title}>
            {t("safety.reportTitle")}
          </Text>
          <Text style={styles.copy}>{t("safety.reportDescription")}</Text>
          <ScrollView style={styles.reasons}>
            {reasons.map((item) => (
              <Button
                fullWidth
                key={item}
                onPress={() => setReason(item)}
                size="sm"
                variant={reason === item ? "primary" : "outline"}
              >
                {t(`safety.reasons.${item}`)}
              </Button>
            ))}
          </ScrollView>
          <TextInput
            accessibilityLabel={t("safety.details")}
            maxLength={2000}
            multiline
            onChangeText={setDetails}
            placeholder={t("safety.detailsPlaceholder")}
            placeholderTextColor={theme.colors.text.subtle}
            style={styles.input}
            value={details}
          />
          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {t("safety.reportError")}
            </Text>
          ) : null}
          <View style={styles.actions}>
            <Button disabled={submitting} onPress={() => onDismiss()} variant="ghost">
              {t("common.cancel")}
            </Button>
            <Button loading={submitting} onPress={() => void submit()}>
              {t("safety.submitReport")}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styleSheet = createThemedStyles((appTheme) => ({
  backdrop: {
    alignItems: "center",
    backgroundColor: appTheme.colors.background.overlay,
    flex: 1,
    justifyContent: "center",
    padding: appTheme.spacing[4],
  },
  dialog: {
    backgroundColor: appTheme.colors.surface.primary,
    borderRadius: appTheme.radii.xl,
    gap: appTheme.spacing[3],
    maxHeight: "90%",
    maxWidth: 520,
    padding: appTheme.spacing[5],
    width: "100%",
  },
  title: { ...appTheme.typography.heading3, color: appTheme.colors.text.primary },
  copy: { ...appTheme.typography.bodySmall, color: appTheme.colors.text.secondary },
  reasons: { maxHeight: 260 },
  input: {
    ...appTheme.typography.body,
    borderColor: appTheme.colors.border.default,
    borderRadius: appTheme.radii.md,
    borderWidth: 1,
    color: appTheme.colors.text.primary,
    minHeight: 90,
    padding: appTheme.spacing[3],
    textAlignVertical: "top",
  },
  error: { ...appTheme.typography.bodySmall, color: appTheme.colors.text.danger },
  actions: { flexDirection: "row", gap: appTheme.spacing[2], justifyContent: "flex-end" },
}));
