import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { APP_CONFIG } from "@/config/app-config";
import { useAppLanguage } from "@/localization";

import { CELEBRATION_COLORS } from "./celebrationTheme";
import { CelebrationFireworks } from "./CelebrationFireworks";
import { RosaryShareImage } from "./RosaryShareImage";
import { shareRosaryAchievement } from "./shareRosaryAchievement";
import { StarField } from "./StarField";
import { StreakEmblem } from "./StreakEmblem";
import type { RosaryCelebrationStats } from "./types";

export interface RosaryCelebrationViewProps {
  children?: ReactNode;
  dateLabel: string;
  isLoadingStats: boolean;
  onNext: () => void;
  onPrayAgain: () => void;
  stats: RosaryCelebrationStats | null;
}

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

/** Builds the caption that accompanies the shared picture. */
export function buildRosaryShareMessage(t: TranslateFn, stats: RosaryCelebrationStats | null): string {
  const lines = [t("rosary.celebration.shareIntro")];
  if (stats?.currentStreak) lines.push(t("rosary.celebration.shareStreak", { count: stats.currentStreak }));
  if (stats?.isNewRecord) lines.push(t("rosary.celebration.shareRecord"));
  lines.push(t("rosary.celebration.shareInvite", { url: APP_CONFIG.inviteUrl }));
  return lines.join("\n");
}

/** One icon-and-number stat; the full label is spoken by screen readers. */
function Stat({ emoji, label, testID, value }: { emoji: string; label: string; testID: string; value: string }) {
  return (
    <View accessibilityLabel={`${label}: ${value}`} accessible style={styles.stat} testID={testID}>
      <Text accessible={false} style={styles.statEmoji}>
        {emoji}
      </Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

/**
 * Full-screen Rosary celebration: starry gradient, a turning rosary ring with the logo as its pendant, the streak
 * as the hero, minimal stats, a Next action at the top, and a Share button that posts a generated poster image.
 */
export function RosaryCelebrationView({
  children,
  dateLabel,
  isLoadingStats,
  onNext,
  onPrayAgain,
  stats,
}: RosaryCelebrationViewProps) {
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const { width } = useWindowDimensions();
  const shareImageRef = useRef<View>(null);
  const number = (value: number | null) => (value === null ? "—" : new Intl.NumberFormat(locale).format(value));
  const isRecord = stats?.isNewRecord === true;
  const streak = stats?.currentStreak ?? null;
  const streakCaption = t("rosary.celebration.dayStreak", { count: streak ?? 0 }).toUpperCase();
  const emblemSize = Math.min(width * 0.82, 340);

  const highlights = [
    stats?.rosariesPrayed ? `🙏 ${number(stats.rosariesPrayed)} ${t("rosary.celebration.rosaries")}` : null,
    stats?.levelNumber != null
      ? `✨ ${t("rosary.celebration.level")} ${stats.levelNumber}${stats.levelName ? ` · ${stats.levelName}` : ""}`
      : null,
    stats?.longestStreak ? `🏆 ${t("rosary.celebration.highScore")} ${number(stats.longestStreak)}` : null,
  ].filter((line): line is string => Boolean(line));

  return (
    <View style={styles.root} testID="rosary-celebration">
      <LinearGradient colors={CELEBRATION_COLORS.background} style={StyleSheet.absoluteFill} />
      <StarField count={44} />
      {isRecord ? <CelebrationFireworks testID="rosary-celebration-fireworks" /> : null}

      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <Text accessibilityRole="header" style={styles.title}>
            {t("rosary.completion.title").toUpperCase()}
          </Text>
          <Pressable
            accessibilityLabel={t("rosary.celebration.nextLabel")}
            accessibilityRole="button"
            hitSlop={8}
            onPress={onNext}
            style={({ pressed }) => [styles.next, pressed && styles.pressed]}
            testID="rosary-celebration-next"
          >
            <Text style={styles.nextText}>{t("rosary.celebration.next")} ›</Text>
          </Pressable>
        </View>

        <View style={styles.hero} testID="rosary-celebration-streak">
          {isLoadingStats && !stats ? (
            <ActivityIndicator
              accessibilityLabel={t("rosary.celebration.loading")}
              color={CELEBRATION_COLORS.goldBright}
            />
          ) : (
            <View
              accessibilityLabel={t("rosary.celebration.streakLabel", { count: streak ?? 0 })}
              accessible
              style={styles.emblem}
            >
              <StreakEmblem caption={streakCaption} size={emblemSize} streak={number(streak)} />
            </View>
          )}
          {isRecord ? (
            <View style={styles.record} testID="rosary-celebration-record">
              <Text style={styles.recordText}>✦ {t("rosary.celebration.newRecord")} ✦</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.stats}>
          <Stat
            emoji="🙏"
            label={t("rosary.celebration.rosaries")}
            testID="celebration-stat-rosaries"
            value={number(stats?.rosariesPrayed ?? null)}
          />
          <Stat
            emoji="✨"
            label={t("rosary.celebration.level")}
            testID="celebration-stat-level"
            value={stats?.levelNumber != null ? String(stats.levelNumber) : "—"}
          />
          <Stat
            emoji="🏆"
            label={t("rosary.celebration.highScore")}
            testID="celebration-stat-best"
            value={number(stats?.longestStreak ?? null)}
          />
        </View>

        {children}

        <View style={styles.actions}>
          <Pressable
            accessibilityLabel={t("rosary.celebration.shareLabel")}
            accessibilityRole="button"
            onPress={() =>
              void shareRosaryAchievement(
                shareImageRef,
                buildRosaryShareMessage(t as TranslateFn, stats),
                t("rosary.celebration.shareLabel"),
              )
            }
            style={({ pressed }) => [styles.share, pressed && styles.pressed]}
            testID="rosary-celebration-share"
          >
            <Text style={styles.shareText}>{t("rosary.celebration.share")}</Text>
          </Pressable>
          <Pressable
            accessibilityLabel={t("rosary.completion.prayAgainLabel")}
            accessibilityRole="button"
            onPress={onPrayAgain}
            style={({ pressed }) => [styles.again, pressed && styles.pressed]}
          >
            <Text style={styles.againText}>{t("rosary.completion.prayAgain")}</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <View pointerEvents="none" style={styles.offscreen} testID="rosary-share-image-host">
        <RosaryShareImage
          callToAction={t("rosary.celebration.shareCta")}
          dateLabel={dateLabel}
          highlights={highlights}
          isNewRecord={isRecord}
          recordLabel={t("rosary.celebration.newRecord")}
          ref={shareImageRef}
          site={APP_CONFIG.inviteUrl.replace(/^https?:\/\//, "")}
          streak={number(streak)}
          streakCaption={streakCaption}
          title={t("rosary.completion.title").toUpperCase()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { gap: 4, paddingBottom: 12, paddingHorizontal: 24 },
  again: { alignItems: "center", justifyContent: "center", minHeight: 44 },
  againText: { color: CELEBRATION_COLORS.textSoft, fontSize: 15, fontWeight: "600" },
  emblem: { alignItems: "center" },
  hero: { alignItems: "center", flex: 1, justifyContent: "center" },
  next: { alignItems: "center", justifyContent: "center", minHeight: 44, minWidth: 64 },
  nextText: { color: CELEBRATION_COLORS.goldBright, fontSize: 18, fontWeight: "700" },
  offscreen: { left: -2000, position: "absolute", top: 0 },
  pressed: { opacity: 0.7 },
  record: {
    backgroundColor: "rgba(255, 224, 154, 0.16)",
    borderColor: CELEBRATION_COLORS.goldBright,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  recordText: { color: CELEBRATION_COLORS.goldBright, fontSize: 13, fontWeight: "800", letterSpacing: 2 },
  root: { backgroundColor: CELEBRATION_COLORS.background[0], flex: 1 },
  safe: { alignSelf: "center", flex: 1, maxWidth: 700, width: "100%" },
  share: {
    alignItems: "center",
    backgroundColor: CELEBRATION_COLORS.gold,
    borderRadius: 999,
    justifyContent: "center",
    minHeight: 54,
  },
  shareText: { color: "#1A1205", fontSize: 17, fontWeight: "800" },
  stat: { alignItems: "center", flexDirection: "row", gap: 6 },
  statEmoji: { fontSize: 22 },
  statValue: { color: CELEBRATION_COLORS.text, fontSize: 22, fontWeight: "800" },
  stats: { flexDirection: "row", justifyContent: "space-evenly", paddingHorizontal: 16, paddingVertical: 12 },
  title: { color: CELEBRATION_COLORS.gold, fontSize: 13, fontWeight: "800", letterSpacing: 3 },
  topBar: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 24 },
});
