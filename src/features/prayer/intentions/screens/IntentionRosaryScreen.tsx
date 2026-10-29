import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { SacredAtmosphere } from "@/components/ui";
import { BackHeader } from "@/components/navigation";
import { OrnateCard } from "@/features/prayer/components";
import { blockAccount, ReportContentModal } from "@/features/community-safety";
import { PrayerIntentionAvatar } from "@/features/prayer/intentions/components";
import { getPrayerIntentionTheme, getCachedApprovedPrayerIntention } from "@/features/prayer/intentions";
import { useAppTheme } from "@/theme/AppThemeProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

function firstString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** Renders a rosary invitation for one prayer intention within the shared atmosphere. */
export function IntentionRosaryScreen() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();
  const router = useRouter();
  const { intentionId: rawIntentionId } = useLocalSearchParams<{ intentionId?: string | string[] }>();
  const intentionId = firstString(rawIntentionId);
  const intention = getCachedApprovedPrayerIntention(intentionId);
  const intentionTheme = getPrayerIntentionTheme(intention?.symbol, colorScheme);
  const [reportVisible, setReportVisible] = useState(false);

  if (!intention) {
    return (
      <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <BackHeader
          description={t("intentions.offer.description")}
          onBack={() => router.back()}
          title={t("intentions.offer.title")}
        />
        <View style={styles.unavailable}>
          <Text style={styles.unavailableTitle}>{t("intentions.offer.unavailable")}</Text>
          <Text style={styles.unavailableCopy}>{t("intentions.offer.unavailableCopy")}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/prayer-intentions")}
            style={styles.action}
          >
            <Text style={styles.actionText}>{t("intentions.offer.view")}</Text>
          </Pressable>
        </View>
      </AtmosphericSafeAreaView>
    );
  }

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} includeAtmosphere={false} style={styles.safeArea}>
      <LinearGradient
        colors={[intentionTheme.surface, theme.rosary.colors.canvasLight, theme.rosary.colors.canvas]}
        style={styles.background}
      >
        <SacredAtmosphere />
        <View style={styles.atmosphereContent}>
          <BackHeader
            description={t("intentions.offer.description")}
            onBack={() => router.back()}
            title={t("intentions.offer.title")}
          />
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.creatorBlock}>
              <PrayerIntentionAvatar
                countryCode={intention.creator.countryCode}
                displayName={intention.creator.displayName}
                size={68}
                source={intention.creator.avatarUrl}
              />
              <Text style={styles.createdBy}>{t("intentions.offer.createdBy")}</Text>
              <Text style={styles.creatorName}>{intention.creator.displayName}</Text>
            </View>
            <Text accessibilityRole="header" numberOfLines={3} style={styles.title}>
              {intention.title}
            </Text>
            <Text style={styles.description}>{intention.description}</Text>
            <View style={styles.artFrame}>
              <Image
                accessible={false}
                contentFit="cover"
                source={require("../../../../../assets/images/saints/blessed-virgin-mary.png")}
                style={styles.art}
              />
              <LinearGradient colors={theme.colors.gradients.intentionImage} style={StyleSheet.absoluteFill} />
              <View style={styles.artSymbol}>
                <Feather
                  accessible={false}
                  color={theme.rosary.colors.goldBright}
                  name={intentionTheme.icon}
                  size={theme.sizes.iconLarge}
                />
              </View>
            </View>
            <OrnateCard style={styles.prayerCard}>
              <Feather accessible={false} color={theme.rosary.colors.gold} name="plus" size={theme.sizes.iconMedium} />
              <Text style={styles.prayerLabel}>{t("intentions.offer.label")}</Text>
              <Text style={styles.prayerCopy}>{t("intentions.offer.copy")}</Text>
            </OrnateCard>
            <Pressable
              accessibilityLabel={t("intentions.offer.actionLabel")}
              accessibilityRole="button"
              onPress={() =>
                router.push({ pathname: "/rosary", params: { intentionId: intention.id, source: "prayer-intention" } })
              }
              style={styles.action}
            >
              <Feather accessible={false} color={theme.colors.text.inverse} name="plus" size={theme.sizes.iconSmall} />
              <Text style={styles.actionText}>{t("intentions.offer.action")}</Text>
            </Pressable>
            <View style={styles.safetyActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setReportVisible(true)}
                style={styles.secondaryAction}
              >
                <Text style={styles.secondaryActionText}>{t("safety.reportIntention")}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  Alert.alert(t("safety.blockTitle"), t("safety.blockDescription"), [
                    { text: t("common.cancel"), style: "cancel" },
                    {
                      text: t("safety.block"),
                      style: "destructive",
                      onPress: () =>
                        void blockAccount(intention.creator.userId).then(() => router.replace("/prayer-intentions")),
                    },
                  ])
                }
                style={styles.secondaryAction}
              >
                <Text style={styles.secondaryActionText}>{t("safety.blockCreator")}</Text>
              </Pressable>
            </View>
          </ScrollView>
          <ReportContentModal
            onDismiss={() => setReportVisible(false)}
            targetId={intention.id}
            targetType="prayer_intention"
            visible={reportVisible}
          />
        </View>
      </LinearGradient>
    </AtmosphericSafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  action: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    flexDirection: "row",
    gap: theme.spacing[2],
    justifyContent: "center",
    minHeight: theme.sizes.buttonHeightLarge,
    paddingHorizontal: theme.spacing[4],
  },
  actionText: { ...theme.typography.button, color: theme.colors.text.inverse },
  safetyActions: { gap: theme.spacing[2] },
  secondaryAction: {
    alignItems: "center",
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    minHeight: theme.sizes.buttonHeightLarge,
    justifyContent: "center",
    paddingHorizontal: theme.spacing[4],
  },
  secondaryActionText: { ...theme.typography.button, color: theme.colors.text.primary },
  art: { height: "100%", width: "100%" },
  atmosphereContent: { flex: 1, zIndex: theme.zIndex.card },
  artFrame: {
    aspectRatio: 1.26,
    borderColor: "rgba(230, 186, 100, 0.62)",
    borderRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    overflow: "hidden",
    position: "relative",
  },
  artSymbol: {
    alignItems: "center",
    backgroundColor: "rgba(7, 26, 42, 0.62)",
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    bottom: theme.spacing[3],
    height: theme.spacing[10],
    justifyContent: "center",
    position: "absolute",
    right: theme.spacing[3],
    width: theme.spacing[10],
  },
  background: { flex: 1, position: "relative" },
  content: {
    alignSelf: "center",
    gap: theme.spacing[4],
    maxWidth: 620,
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[7],
    width: "100%",
  },
  createdBy: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
    marginTop: theme.spacing[2],
  },
  creatorBlock: { alignItems: "center" },
  creatorName: { ...theme.typography.bodyMedium, color: theme.colors.text.white, marginTop: theme.spacing[0.5] },
  description: { ...theme.typography.body, color: theme.rosary.colors.scripture, textAlign: "center" },
  prayerCard: { alignItems: "center", backgroundColor: "rgba(7, 26, 42, 0.76)", padding: theme.spacing[4] },
  prayerCopy: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[2],
    textAlign: "center",
  },
  prayerLabel: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
    marginTop: theme.spacing[2],
  },
  safeArea: { backgroundColor: theme.rosary.colors.canvas, flex: 1 },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.text.white,
    fontFamily: theme.fontFamilies.display,
    textAlign: "center",
  },
  unavailable: { alignItems: "center", flex: 1, justifyContent: "center", padding: theme.spacing[5] },
  unavailableCopy: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[2],
    textAlign: "center",
  },
  unavailableTitle: { ...theme.typography.heading3, color: theme.colors.text.white, textAlign: "center" },
}));
