import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type ListRenderItemInfo,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchActivityPointsPage, type ActivityPointsActivity } from "@/features/progress";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { formatPoints } from "../../rosary-reminder";

export type ActivityPointsModalProps = {
  onClose: () => void;
  visible: boolean;
};

/** Formats a valid activity timestamp in the active locale, without exposing malformed values. */
function formatActivityDate(value: string, locale: string, unavailable: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return unavailable;

  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

/** Formats every point amount with an explicit sign when it is nonzero. */
function formatSignedPoints(points: number, locale: string): string {
  const formatted = formatPoints(Math.abs(points), locale);
  return points > 0 ? `+${formatted}` : points < 0 ? `-${formatted}` : formatted;
}

/** Converts future backend activity codes into legible fallback text. */
function humanizeActivityCode(activityCode: string): string {
  return activityCode
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0)}${word.slice(1).toLowerCase()}`)
    .join(" ");
}

/** Resolves a client-localized name for the supported activity codes and a readable fallback for future codes. */
function getActivityLabel(activityCode: string, translate: (key: string) => string): string {
  if (activityCode === "ROSARY") return translate("dashboard.holyProgress.activityTypes.rosary");
  if (activityCode === "SCRIPTURE") return translate("dashboard.holyProgress.activityTypes.scripture");
  return humanizeActivityCode(activityCode);
}

/** Shows cursor-paginated activity history with every activity's signed net points. */
export function ActivityPointsModal({ onClose, visible }: ActivityPointsModalProps) {
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const reduceMotion = useReducedMotion();
  const { height, width } = useWindowDimensions();
  const styles = useThemedStyles(styleSheet);
  const [activities, setActivities] = useState<ActivityPointsActivity[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const isTablet = width >= theme.breakpoints.tablet;

  /** Loads a fresh first page each time the dialog is opened or retried. */
  const loadInitialPage = useCallback(async () => {
    setIsInitialLoading(true);
    setLoadError(false);
    setActivities([]);
    setHasMore(false);
    setNextCursor(null);

    try {
      const page = await fetchActivityPointsPage();
      setActivities(page.activities);
      setHasMore(page.hasMore);
      setNextCursor(page.nextCursor);
    } catch {
      setLoadError(true);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  /** Starts an initial history request whenever the dialog becomes visible. */
  const loadWhenVisible = useCallback(() => {
    if (visible) void loadInitialPage();
  }, [loadInitialPage, visible]);

  useEffect(loadWhenVisible, [loadWhenVisible]);

  /** Requests and appends the next cursor page without concurrent duplicate requests. */
  const loadMore = useCallback(async () => {
    if (!hasMore || !nextCursor || isLoadingMore) return;

    setIsLoadingMore(true);
    setLoadError(false);
    try {
      const page = await fetchActivityPointsPage(nextCursor);
      setActivities((current) => [...current, ...page.activities]);
      setHasMore(page.hasMore);
      setNextCursor(page.nextCursor);
    } catch {
      setLoadError(true);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, nextCursor]);

  /** Selects the correct retry target for an initial or later-page failure. */
  const retryLoad = useCallback(() => {
    if (activities.length === 0) {
      void loadInitialPage();
      return;
    }
    void loadMore();
  }, [activities.length, loadInitialPage, loadMore]);

  /** Supplies stable keys to the native virtualized activity-history list. */
  const keyExtractor = useCallback((activity: ActivityPointsActivity) => activity.id, []);

  /** Renders a single activity's localized name, date, and signed net points. */
  const renderActivity = useCallback(
    ({ item }: ListRenderItemInfo<ActivityPointsActivity>) => {
      const date = formatActivityDate(
        item.completedAt ?? item.occurredAt,
        locale,
        t("dashboard.holyProgress.unavailable"),
      );
      const label = getActivityLabel(item.activityCode, t);
      const points = formatSignedPoints(item.points, locale);

      return (
        <View accessibilityLabel={`${label}, ${date}, ${points}`} style={styles.activityRow}>
          <View style={styles.activityCopy}>
            <Text style={styles.activityName}>{label}</Text>
            <Text style={styles.activityDate}>{date}</Text>
          </View>
          <Text style={[styles.points, item.points < 0 && styles.negativePoints]}>{points}</Text>
        </View>
      );
    },
    [locale, styles, t],
  );

  /** Renders the list footer for incremental loading, retry, or the next-page action. */
  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return (
        <ActivityIndicator
          accessibilityLabel={t("dashboard.holyProgress.activityHistoryLoading")}
          color={theme.colors.gold.strong}
        />
      );
    }
    if (loadError && activities.length > 0) {
      return (
        <View style={styles.footerError}>
          <Text accessibilityLiveRegion="polite" style={styles.errorText}>
            {t("dashboard.holyProgress.activityHistoryError")}
          </Text>
          <Pressable accessibilityRole="button" onPress={retryLoad} style={styles.footerButton}>
            <Text style={styles.footerButtonText}>{t("dashboard.holyProgress.activityHistoryRetry")}</Text>
          </Pressable>
        </View>
      );
    }
    if (!hasMore) return null;
    return (
      <Pressable accessibilityRole="button" onPress={loadMore} style={styles.footerButton}>
        <Text style={styles.footerButtonText}>{t("dashboard.holyProgress.activityHistoryLoadMore")}</Text>
      </Pressable>
    );
  }, [activities.length, hasMore, isLoadingMore, loadError, loadMore, retryLoad, styles, t]);

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
            accessibilityLabel={t("dashboard.holyProgress.activityHistoryModalLabel")}
            accessibilityViewIsModal
            style={[
              styles.dialog,
              {
                maxHeight: Math.max(320, Math.min(isTablet ? 760 : height * 0.9, height - theme.spacing[8])),
                maxWidth: isTablet ? 680 : 560,
              },
            ]}
          >
            <View style={styles.header}>
              <Text accessibilityRole="header" style={styles.title}>
                {t("dashboard.holyProgress.activityHistoryTitle")}
              </Text>
              <Pressable
                accessibilityLabel={t("dashboard.holyProgress.closeActivityHistory")}
                accessibilityRole="button"
                hitSlop={theme.spacing[2]}
                onPress={onClose}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  accessible={false}
                  color={theme.colors.text.primary}
                  name="close"
                  size={theme.sizes.iconMedium}
                />
              </Pressable>
            </View>
            {isInitialLoading ? (
              <View accessibilityLabel={t("dashboard.holyProgress.activityHistoryLoading")} style={styles.loading}>
                <ActivityIndicator color={theme.colors.gold.strong} />
                <Text style={styles.loadingText}>{t("dashboard.holyProgress.activityHistoryLoading")}</Text>
              </View>
            ) : null}
            {!isInitialLoading && loadError && activities.length === 0 ? (
              <View style={styles.state}>
                <Text accessibilityLiveRegion="polite" style={styles.errorText}>
                  {t("dashboard.holyProgress.activityHistoryError")}
                </Text>
                <Pressable accessibilityRole="button" onPress={retryLoad} style={styles.footerButton}>
                  <Text style={styles.footerButtonText}>{t("dashboard.holyProgress.activityHistoryRetry")}</Text>
                </Pressable>
              </View>
            ) : null}
            {!isInitialLoading && !loadError && activities.length === 0 ? (
              <View style={styles.state}>
                <Text style={styles.emptyText}>{t("dashboard.holyProgress.activityHistoryEmpty")}</Text>
              </View>
            ) : null}
            {!isInitialLoading && activities.length > 0 ? (
              <FlatList
                accessibilityLabel={t("dashboard.holyProgress.activityHistoryList")}
                contentContainerStyle={styles.listContent}
                data={activities}
                keyExtractor={keyExtractor}
                ListFooterComponent={renderFooter}
                renderItem={renderActivity}
                showsVerticalScrollIndicator
              />
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  activityCopy: { flex: 1, minWidth: 0 },
  activityDate: { ...theme.typography.caption, color: theme.colors.text.muted, marginTop: theme.spacing[0.5] },
  activityName: { ...theme.typography.bodyMedium, color: theme.colors.text.primary },
  activityRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: theme.sizes.touchTarget + theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  closeButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  dialog: {
    backgroundColor: theme.colors.surface.primary,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii["2xl"],
    borderWidth: theme.borderWidths.thin,
    overflow: "hidden",
    width: "100%",
  },
  emptyText: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, textAlign: "center" },
  errorText: { ...theme.typography.bodySmall, color: theme.colors.text.warning, textAlign: "center" },
  footerButton: {
    alignItems: "center",
    alignSelf: "center",
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[4],
  },
  footerButtonText: {
    ...theme.typography.labelSmall,
    color: theme.colors.gold.strong,
    letterSpacing: theme.letterSpacing.wide,
  },
  footerError: { gap: theme.spacing[2], paddingTop: theme.spacing[3] },
  header: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.thin,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: theme.spacing[4],
    paddingRight: theme.spacing[2],
    paddingVertical: theme.spacing[2],
  },
  listContent: { paddingBottom: theme.spacing[4] },
  loading: {
    alignItems: "center",
    gap: theme.spacing[3],
    justifyContent: "center",
    minHeight: 220,
    padding: theme.spacing[6],
  },
  loadingText: { ...theme.typography.bodySmall, color: theme.colors.text.secondary },
  negativePoints: { color: theme.colors.text.warning },
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.background.overlay,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing[4],
  },
  points: {
    ...theme.typography.heading3,
    color: theme.colors.semantic.success,
    fontFamily: theme.fontFamilies.bodySemibold,
  },
  safeArea: { flex: 1 },
  state: {
    alignItems: "center",
    gap: theme.spacing[3],
    justifyContent: "center",
    minHeight: 220,
    padding: theme.spacing[6],
  },
  title: { ...theme.typography.heading3, color: theme.colors.text.primary, flex: 1 },
}));
