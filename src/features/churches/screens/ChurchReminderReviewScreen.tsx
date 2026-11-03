import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { CHURCH_SERVICE_TYPES, NOTIFICATION_WEEKDAYS, type ChurchSummary } from "../churches.types";
import { useChurchReminderSetup } from "../components";

/** Builds one readable address line without exposing blank optional fields. */
function formatChurchAddress(church: ChurchSummary): string {
  return [church.addressLine1, church.addressLine2, church.city, church.regionName, church.postalCode]
    .filter(Boolean)
    .join(", ");
}

/** Presents editable service and weekday preferences on the dedicated reminder route. */
export function ChurchReminderReviewScreen() {
  const router = useRouter();
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const setup = useChurchReminderSetup();

  /** Returns to discovery even when the review route was opened directly from Home. */
  function openDiscovery(): void {
    router.replace("/churches");
  }

  /** Saves all pending mutations and leaves the feature only after a fully successful result. */
  async function completeSetup(): Promise<void> {
    if (await setup.completeSetup()) router.replace("/home");
  }

  return (
    <ScreenShell
      backAccessibilityLabel={t("common.back")}
      contentContainerStyle={styles.content}
      description={t("churches.setup.description")}
      headerVariant="compact"
      onBack={() => (router.canGoBack() ? router.back() : openDiscovery())}
      testID="church-reminder-review-page"
      title={t("churches.setup.review")}
    >
      <View style={styles.screenStack}>
        {setup.isLoadingSubscriptions ? (
          <View accessibilityLabel={t("churches.setup.loading")} accessibilityRole="progressbar" style={styles.loading}>
            <ActivityIndicator color={theme.colors.brand.primaryLight} />
          </View>
        ) : null}

        {!setup.isLoadingSubscriptions && setup.drafts.length === 0 ? (
          <Card title={t("churches.setup.emptyTitle")}>
            <View style={styles.formStack}>
              <Text style={styles.muted}>{t("churches.setup.none")}</Text>
              <Button fullWidth onPress={openDiscovery} variant="outline">
                {t("churches.search.title")}
              </Button>
            </View>
          </Card>
        ) : null}

        {setup.drafts.length > 0 ? (
          <Card subtitle={t("churches.setup.description")} title={t("churches.setup.title")}>
            <View style={styles.screenStack}>
              {setup.drafts.map((draft) => (
                <View key={draft.church.id} style={styles.preferenceCard}>
                  <View style={styles.preferenceHeader}>
                    <View style={styles.resultCopy}>
                      <Text style={styles.resultName}>{draft.church.name}</Text>
                      <Text style={styles.muted}>{formatChurchAddress(draft.church)}</Text>
                    </View>
                    <Pressable
                      accessibilityLabel={`${t("churches.results.remove")} ${draft.church.name}`}
                      accessibilityRole="button"
                      hitSlop={theme.spacing[2]}
                      onPress={() => setup.toggleSelectedChurch(draft.church)}
                      style={styles.iconButton}
                    >
                      <Feather accessible={false} color={theme.colors.semantic.danger} name="trash-2" size={20} />
                    </Pressable>
                  </View>
                  {draft.church.scheduleStatus !== "verified" ? (
                    <Text style={styles.warningText}>{t("churches.setup.schedulePending")}</Text>
                  ) : null}
                  <Text style={styles.label}>{t("churches.setup.serviceTypes")}</Text>
                  <View style={styles.chips}>
                    {CHURCH_SERVICE_TYPES.map((serviceType) => (
                      <Pressable
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: draft.serviceTypes.includes(serviceType) }}
                        key={serviceType}
                        onPress={() => setup.toggleServiceType(draft.church.id, serviceType)}
                        style={[styles.chip, draft.serviceTypes.includes(serviceType) && styles.chipSelected]}
                      >
                        <Text style={styles.chipText}>{t(`churches.services.${serviceType}`)}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <Text style={styles.label}>{t("churches.setup.weekdays")}</Text>
                  <View style={styles.chips}>
                    {NOTIFICATION_WEEKDAYS.map((weekday) => (
                      <Pressable
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: draft.notificationWeekdays.includes(weekday) }}
                        key={weekday}
                        onPress={() => setup.toggleWeekday(draft.church.id, weekday)}
                        style={[styles.chip, draft.notificationWeekdays.includes(weekday) && styles.chipSelected]}
                      >
                        <Text style={styles.chipText}>{t(`churches.weekdays.${weekday}`)}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </Card>
        ) : null}

        {setup.errorMessage ? (
          <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.errorText}>
            {setup.errorMessage}
          </Text>
        ) : null}
        {setup.mutationFailures.map((failure) => (
          <Text
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            key={failure.churchId}
            style={styles.errorText}
          >
            {`${failure.name}: ${failure.message}`}
          </Text>
        ))}
        {!setup.isLoadingSubscriptions && (setup.drafts.length > 0 || setup.existingSubscriptions.length > 0) ? (
          <Button fullWidth loading={setup.isSaving} onPress={() => void completeSetup()}>
            {setup.isSaving
              ? t("churches.setup.saving")
              : setup.mutationFailures.length > 0
                ? t("churches.errors.retrySave")
                : t("churches.setup.complete")}
          </Button>
        ) : null}
      </View>
    </ScreenShell>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  chip: {
    alignItems: "center",
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  chipSelected: { backgroundColor: theme.colors.surface.green, borderColor: theme.colors.semantic.successBorder },
  chipText: { ...theme.typography.bodySmall, color: theme.colors.text.primary, textAlign: "center" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2] },
  content: { maxWidth: 760, paddingBottom: theme.spacing[8] },
  errorText: { ...theme.typography.bodySmall, color: theme.colors.semantic.danger },
  formStack: { gap: theme.spacing[3] },
  iconButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  label: { ...theme.typography.label, color: theme.colors.text.primary },
  loading: { alignItems: "center", padding: theme.spacing[4] },
  muted: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
  preferenceCard: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[3],
    padding: theme.spacing[3],
  },
  preferenceHeader: { alignItems: "flex-start", flexDirection: "row", gap: theme.spacing[2] },
  resultCopy: { flex: 1, gap: theme.spacing[1], minWidth: 0 },
  resultName: { ...theme.typography.body, color: theme.colors.text.primary, fontWeight: "700" },
  screenStack: { gap: theme.spacing[4] },
  warningText: { ...theme.typography.bodySmall, color: theme.colors.semantic.warning },
}));
