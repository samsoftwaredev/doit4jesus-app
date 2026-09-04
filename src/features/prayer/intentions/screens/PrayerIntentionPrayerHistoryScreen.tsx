import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { BackHeader } from "@/components/navigation";
import { PrayerIntentionAvatar } from "@/features/prayer/intentions/components";
import { fetchPrayerIntentionPrayerSummary, getPrayerIntentionTheme } from "@/features/prayer/intentions";
import type { PrayerIntentionPrayerSummary } from "@/features/prayer/intentions";
import { theme } from "@/theme/tokens";

function firstString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** Renders the prayer history for one intention within the shared atmosphere. */
export function PrayerIntentionPrayerHistoryScreen() {
  const router = useRouter();
  const { intentionId: rawIntentionId } = useLocalSearchParams<{ intentionId?: string | string[] }>();
  const intentionId = firstString(rawIntentionId);
  const [summary, setSummary] = useState<PrayerIntentionPrayerSummary>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const load = useCallback(async () => {
    if (!intentionId) {
      setError("A prayer intention could not be found.");
      setIsLoading(false);
      return;
    }
    setError(undefined);
    setIsLoading(true);
    try {
      setSummary(await fetchPrayerIntentionPrayerSummary(intentionId));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Couldn’t load prayer activity.");
    } finally {
      setIsLoading(false);
    }
  }, [intentionId]);
  useEffect(() => {
    void load();
  }, [load]);
  const intentionTheme = getPrayerIntentionTheme(summary?.symbol);

  return (
    <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <BackHeader onBack={() => router.back()} title="Prayer Activity" />
      {isLoading ? (
        <View style={styles.state}>
          <ActivityIndicator color={theme.rosary.colors.gold} />
        </View>
      ) : null}
      {!isLoading && error ? (
        <View accessibilityRole="alert" style={styles.state}>
          <Text style={styles.error}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => void load()} style={styles.retry}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : null}
      {summary ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <PrayerIntentionAvatar
            countryCode={summary.creator.countryCode}
            displayName={summary.creator.displayName}
            size={68}
            source={summary.creator.avatarUrl}
          />
          <Text style={styles.createdBy}>PRAYER ACTIVITY</Text>
          <Text style={styles.creator}>{summary.creator.displayName}</Text>
          <View style={[styles.icon, { backgroundColor: intentionTheme.surface }]}>
            <Feather
              accessible={false}
              color={theme.rosary.colors.goldBright}
              name={intentionTheme.icon}
              size={theme.sizes.iconLarge}
            />
          </View>
          <Text accessibilityRole="header" style={styles.title}>
            {summary.title}
          </Text>
          <Text style={styles.description}>{summary.description}</Text>
          <Text style={styles.count}>
            {summary.prayerCount} {summary.prayerCount === 1 ? "prayer offered" : "prayers offered"}
          </Text>
          <Text style={styles.note}>Prayer records are only shown when the protected endpoint provides them.</Text>
        </ScrollView>
      ) : null}
    </AtmosphericSafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", gap: theme.spacing[3], padding: theme.spacing[5] },
  count: {
    ...theme.typography.heading2,
    color: theme.rosary.colors.goldBright,
    marginTop: theme.spacing[3],
    textAlign: "center",
  },
  createdBy: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
  },
  creator: { ...theme.typography.bodyMedium, color: theme.colors.text.white },
  description: { ...theme.typography.body, color: theme.colors.text.secondary, textAlign: "center" },
  error: { ...theme.typography.bodyMedium, color: theme.colors.text.white, textAlign: "center" },
  icon: {
    alignItems: "center",
    borderRadius: theme.radii.pill,
    height: theme.spacing[12],
    justifyContent: "center",
    marginTop: theme.spacing[2],
    width: theme.spacing[12],
  },
  note: {
    ...theme.typography.caption,
    color: theme.colors.text.subtle,
    marginTop: theme.spacing[3],
    textAlign: "center",
  },
  retry: {
    alignItems: "center",
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    justifyContent: "center",
    marginTop: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  retryText: { ...theme.typography.labelSmall, color: theme.rosary.colors.goldBright },
  safeArea: { backgroundColor: theme.colors.background.primary, flex: 1 },
  state: { alignItems: "center", flex: 1, justifyContent: "center", padding: theme.spacing[5] },
  title: {
    ...theme.typography.heading2,
    color: theme.colors.text.white,
    fontFamily: theme.fontFamilies.display,
    textAlign: "center",
  },
});
