import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ListRenderItemInfo,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { resolveBadgeArtwork } from "../../badge-assets";
import type { BadgeCatalogEntry } from "../../progress.types";

export type BadgeCatalogModalProps = {
  badges: BadgeCatalogEntry[];
  onClose: () => void;
  visible: boolean;
};

type BadgeState = "earned" | "inProgress" | "locked";

/** Clamps progress values before they are exposed visually or to accessibility services. */
function clampProgress(value: number, maximum = 100): number {
  return Math.min(Math.max(Math.round(value), 0), Math.max(maximum, 0));
}

/** Returns the latest valid award date for a badge definition. */
function getLatestEarnedAt(badge: BadgeCatalogEntry): string | null {
  return badge.earned.reduce<string | null>((latest, instance) => {
    if (!latest) return instance.earnedAt;
    return Date.parse(instance.earnedAt) > Date.parse(latest) ? instance.earnedAt : latest;
  }, null);
}

/** Derives a badge's presentation state from awards and any recorded progress. */
function getBadgeState(badge: BadgeCatalogEntry): BadgeState {
  if (badge.earned.length > 0) return "earned";
  if (
    (badge.progress?.currentValue ?? 0) > 0 ||
    badge.requirements.some((requirement) => requirement.currentValue > 0)
  ) {
    return "inProgress";
  }
  return "locked";
}

/** Computes one accessible percentage from aggregate or compound requirement progress. */
function getBadgePercentage(badge: BadgeCatalogEntry): number {
  if (badge.earned.length > 0) return 100;
  if (badge.progress) return clampProgress(badge.progress.percentage);

  const totals = badge.requirements.reduce(
    (result, requirement) => ({
      current: result.current + requirement.currentValue,
      required: result.required + requirement.requiredValue,
    }),
    { current: 0, required: 0 },
  );
  return totals.required > 0 ? clampProgress((totals.current / totals.required) * 100) : 0;
}

/** Orders achievements first, active progress second, and untouched badges last. */
function orderBadges(badges: BadgeCatalogEntry[]): BadgeCatalogEntry[] {
  const stateOrder: Record<BadgeState, number> = { earned: 0, inProgress: 1, locked: 2 };
  return [...badges].sort((first, second) => {
    const stateDifference = stateOrder[getBadgeState(first)] - stateOrder[getBadgeState(second)];
    return stateDifference || first.name.localeCompare(second.name) || first.id.localeCompare(second.id);
  });
}

/** Converts an API enum value into readable fallback copy for future categories and rarities. */
function humanizeValue(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(" ");
}

/** Formats an award date for the active locale without exposing an invalid timestamp. */
function formatEarnedDate(earnedAt: string | null, locale: string, unavailable: string): string {
  if (!earnedAt) return unavailable;
  const date = new Date(earnedAt);
  if (Number.isNaN(date.getTime())) return unavailable;
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

/** Presents all badge definitions and authenticated progress in an accessible responsive dialog. */
export function BadgeCatalogModal({ badges, onClose, visible }: BadgeCatalogModalProps) {
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const reduceMotion = useReducedMotion();
  const { height, width } = useWindowDimensions();
  const styles = useThemedStyles(styleSheet);
  const [failedArtwork, setFailedArtwork] = useState<Record<string, string>>({});
  const orderedBadges = useMemo(() => orderBadges(badges), [badges]);
  const earnedCount = badges.filter((badge) => badge.earned.length > 0).length;
  const isTablet = width >= theme.breakpoints.tablet;

  /** Renders one complete badge summary, including the most specific progress available. */
  const renderBadge = useCallback(
    ({ item: badge }: ListRenderItemInfo<BadgeCatalogEntry>) => {
      const badgeState = getBadgeState(badge);
      const isEarned = badgeState === "earned";
      const percentage = getBadgePercentage(badge);
      const artwork = resolveBadgeArtwork(badge.code, badge.iconUrl);
      const artworkKey = typeof artwork === "number" ? String(artwork) : (artwork?.uri ?? badge.code);
      const shouldShowArtwork = artwork !== null && failedArtwork[badge.id] !== artworkKey;
      const rarityKey = `progress.badges.rarities.${badge.rarity}`;
      const categoryKey = `progress.badges.categories.${badge.category}`;
      const rarity = t(rarityKey, { defaultValue: humanizeValue(badge.rarity) });
      const category = t(categoryKey, { defaultValue: humanizeValue(badge.category) });
      const stateLabel = isEarned
        ? t("progress.badges.earned")
        : badgeState === "inProgress"
          ? t("progress.badges.inProgressPercent", { percent: percentage })
          : t("progress.badges.notEarned");
      const earnedDate = formatEarnedDate(getLatestEarnedAt(badge), locale, t("progress.dateUnavailable"));

      /** Hides failed remote artwork while keeping local state isolated to this badge. */
      function handleArtworkError() {
        setFailedArtwork((current) => ({ ...current, [badge.id]: artworkKey }));
      }

      return (
        <View style={styles.badgeCard}>
          <View
            accessible
            accessibilityLabel={t("progress.badges.catalogRowLabel", {
              category,
              description: badge.description,
              name: badge.name,
              rarity,
              status: stateLabel,
            })}
            accessibilityRole="summary"
          />
          <View style={styles.badgeTopRow}>
            <View accessible={false} style={styles.artworkFrame}>
              {shouldShowArtwork && artwork ? (
                <Image
                  accessible={false}
                  cachePolicy="memory-disk"
                  contentFit="contain"
                  onError={handleArtworkError}
                  source={artwork}
                  style={styles.artwork}
                  transition={reduceMotion ? 0 : 150}
                />
              ) : (
                <MaterialCommunityIcons
                  accessible={false}
                  color={theme.rosary.colors.gold}
                  name="shield-cross"
                  size={theme.sizes.iconHero}
                />
              )}
              {!isEarned ? (
                <View accessible={false} style={styles.lockOverlay} testID={`badge-lock-overlay-${badge.id}`}>
                  <MaterialCommunityIcons
                    accessible={false}
                    color={theme.colors.text.white}
                    name="lock"
                    size={theme.sizes.iconMedium}
                  />
                </View>
              ) : null}
            </View>

            <View style={styles.badgeCopy}>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <View style={styles.chipRow}>
                <Text style={styles.rarityChip}>{rarity}</Text>
                <Text style={styles.categoryChip}>{category}</Text>
                {badge.isRepeatable ? <Text style={styles.categoryChip}>{t("progress.badges.repeatable")}</Text> : null}
              </View>
              <Text style={styles.description}>{badge.description}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.statusPill, isEarned ? styles.earnedPill : styles.lockedPill]}>
              <MaterialCommunityIcons
                accessible={false}
                color={isEarned ? theme.colors.badge.successText : theme.colors.badge.neutralText}
                name={isEarned ? "check-circle" : "lock-outline"}
                size={theme.sizes.iconSmall}
              />
              <Text style={[styles.statusText, isEarned ? styles.earnedText : styles.lockedText]}>{stateLabel}</Text>
            </View>
            <Text style={styles.reward}>{t("progress.badges.rewardPoints", { count: badge.pointsReward })}</Text>
          </View>

          {isEarned ? (
            <View style={styles.progressSection}>
              <Text style={styles.earnedDate}>{t("progress.badges.earnedOn", { date: earnedDate })}</Text>
              <View
                accessible
                accessibilityLabel={t("progress.badges.completedProgressLabel", { name: badge.name })}
                accessibilityRole="progressbar"
                accessibilityValue={{ max: 100, min: 0, now: 100 }}
                style={styles.progressTrack}
              >
                <View style={[styles.progressFill, styles.completedProgress]} />
              </View>
            </View>
          ) : badge.progress ? (
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{t("progress.badges.progress")}</Text>
                <Text style={styles.progressValue}>
                  {t("progress.badges.progressValue", {
                    current: badge.progress.currentValue,
                    required: badge.progress.requiredValue,
                  })}
                </Text>
              </View>
              <View
                accessible
                accessibilityLabel={t("progress.badges.progressLabel", { name: badge.name })}
                accessibilityRole="progressbar"
                accessibilityValue={{ max: 100, min: 0, now: percentage }}
                style={styles.progressTrack}
              >
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
              </View>
            </View>
          ) : badge.requirements.length > 0 ? (
            <View style={styles.requirements}>
              {badge.requirements.map((requirement) => {
                const current = clampProgress(requirement.currentValue, requirement.requiredValue);
                const requirementPercentage =
                  requirement.requiredValue > 0 ? clampProgress((current / requirement.requiredValue) * 100) : 0;
                return (
                  <View key={requirement.id} style={styles.requirement}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.requirementDescription}>{requirement.description}</Text>
                      <Text style={styles.progressValue}>
                        {t("progress.badges.progressValue", { current, required: requirement.requiredValue })}
                      </Text>
                    </View>
                    <View
                      accessible
                      accessibilityLabel={t("progress.badges.requirementProgressLabel", {
                        description: requirement.description,
                      })}
                      accessibilityRole="progressbar"
                      accessibilityValue={{ max: requirement.requiredValue, min: 0, now: current }}
                      style={styles.progressTrack}
                    >
                      <View style={[styles.progressFill, { width: `${requirementPercentage}%` }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.notStarted}>{t("progress.badges.notStarted")}</Text>
          )}
        </View>
      );
    },
    [failedArtwork, locale, reduceMotion, styles, t],
  );

  return (
    <Modal
      animationType={reduceMotion ? "none" : "fade"}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <View
            accessibilityLabel={t("progress.badges.catalogAccessibilityLabel")}
            accessibilityViewIsModal
            style={[
              styles.dialog,
              {
                maxHeight: Math.max(320, Math.min(isTablet ? 760 : height * 0.9, height - theme.spacing[8])),
                maxWidth: isTablet ? 680 : 560,
              },
            ]}
            testID="badge-catalog-dialog"
          >
            <View style={styles.header}>
              <View style={styles.headerCopy}>
                <Text accessibilityRole="header" style={styles.title}>
                  {t("progress.badges.modalTitle")}
                </Text>
                <Text style={styles.subtitle}>
                  {t("progress.badges.catalogSummary", { earned: earnedCount, total: badges.length })}
                </Text>
              </View>
              <Pressable
                accessibilityLabel={t("progress.badges.close")}
                accessibilityRole="button"
                hitSlop={theme.spacing[2]}
                onPress={onClose}
                style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
              >
                <MaterialCommunityIcons
                  accessible={false}
                  color={theme.colors.text.primary}
                  name="close"
                  size={theme.sizes.iconMedium}
                />
              </Pressable>
            </View>
            <FlatList
              accessibilityLabel={t("progress.badges.catalogList")}
              contentContainerStyle={styles.listContent}
              data={orderedBadges}
              initialNumToRender={8}
              keyExtractor={(badge) => badge.id}
              maxToRenderPerBatch={8}
              renderItem={renderBadge}
              showsVerticalScrollIndicator
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  artwork: { height: "100%", width: "100%" },
  artworkFrame: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: theme.rosary.colors.cardInset,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    justifyContent: "center",
    overflow: "hidden",
    width: 88,
  },
  badgeCard: {
    backgroundColor: theme.colors.surface.secondary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[3],
    padding: theme.spacing[3],
  },
  badgeCopy: { flex: 1, minWidth: theme.spacing[0] },
  badgeName: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamilies.bodySemibold,
  },
  badgeTopRow: { alignItems: "flex-start", flexDirection: "row", gap: theme.spacing[3] },
  categoryChip: {
    ...theme.typography.caption,
    backgroundColor: theme.colors.badge.neutralBackground,
    borderRadius: theme.radii.pill,
    color: theme.colors.badge.neutralText,
    overflow: "hidden",
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[0.5],
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[1], marginTop: theme.spacing[1] },
  closeButton: {
    alignItems: "center",
    borderRadius: theme.radii.pill,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  completedProgress: { width: "100%" },
  description: { ...theme.typography.bodySmall, color: theme.colors.text.muted, marginTop: theme.spacing[2] },
  dialog: {
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.border.strong,
    borderRadius: theme.radii["2xl"],
    borderWidth: theme.borderWidths.thin,
    overflow: "hidden",
    width: "100%",
  },
  earnedDate: { ...theme.typography.bodySmall, color: theme.colors.text.success },
  earnedPill: { backgroundColor: theme.colors.badge.successBackground },
  earnedText: { color: theme.colors.badge.successText },
  header: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.thin,
    flexDirection: "row",
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  headerCopy: { flex: 1, minWidth: theme.spacing[0] },
  listContent: { gap: theme.spacing[3], padding: theme.spacing[4] },
  lockOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    backgroundColor: theme.colors.background.overlay,
    justifyContent: "center",
  },
  lockedPill: { backgroundColor: theme.colors.badge.neutralBackground },
  lockedText: { color: theme.colors.badge.neutralText },
  metaRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: theme.spacing[2] },
  notStarted: { ...theme.typography.bodySmall, color: theme.colors.text.muted },
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.background.overlay,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing[4],
  },
  pressed: { opacity: theme.opacity.pressed },
  progressFill: { backgroundColor: theme.colors.brand.primary, borderRadius: theme.radii.pill, height: "100%" },
  progressHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.spacing[2],
    justifyContent: "space-between",
  },
  progressLabel: { ...theme.typography.labelSmall, color: theme.colors.text.secondary },
  progressSection: { gap: theme.spacing[2] },
  progressTrack: {
    backgroundColor: theme.colors.badge.neutralBackground,
    borderRadius: theme.radii.pill,
    height: theme.spacing[2],
    overflow: "hidden",
  },
  progressValue: { ...theme.typography.caption, color: theme.colors.text.secondary, flexShrink: 0 },
  rarityChip: {
    ...theme.typography.caption,
    backgroundColor: theme.colors.badge.warningBackground,
    borderRadius: theme.radii.pill,
    color: theme.colors.badge.warningText,
    overflow: "hidden",
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[0.5],
  },
  requirement: { gap: theme.spacing[2] },
  requirementDescription: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, flex: 1 },
  requirements: { gap: theme.spacing[3] },
  reward: { ...theme.typography.caption, color: theme.colors.text.muted },
  safeArea: { backgroundColor: theme.colors.background.overlay, flex: 1 },
  statusPill: {
    alignItems: "center",
    borderRadius: theme.radii.pill,
    flexDirection: "row",
    gap: theme.spacing[1],
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  statusText: { ...theme.typography.labelSmall },
  subtitle: { ...theme.typography.bodySmall, color: theme.colors.text.muted, marginTop: theme.spacing[0.5] },
  title: { ...theme.typography.heading2, color: theme.colors.text.primary },
}));
