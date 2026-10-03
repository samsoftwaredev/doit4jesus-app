import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui";
import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { BadgeCatalogModal } from "./components";
import { EarnedBadgeRow } from "./EarnedBadgeRow";
import { fetchBadgeCatalog, parseBadgeCatalogData } from "./progress.api";
import type { ScreenDataResponse } from "@/features/screen-data";
import type { BadgeCatalogEntry, EarnedBadge } from "./progress.types";

const BADGE_PREVIEW_LIMIT = 3;

/** Flattens repeatable award events and returns the three newest Home achievements. */
function getRecentEarnedBadges(catalog: BadgeCatalogEntry[]): EarnedBadge[] {
  return catalog
    .flatMap((badge) =>
      badge.earned.map((instance) => ({
        code: badge.code,
        description: badge.description,
        earnedAt: instance.earnedAt,
        iconUrl: badge.iconUrl,
        id: instance.id,
        name: badge.name,
      })),
    )
    .sort((first, second) => Date.parse(second.earnedAt) - Date.parse(first.earnedAt))
    .slice(0, BADGE_PREVIEW_LIMIT);
}

/** Loads a recent badge preview and opens the complete achievement catalog. */
export function EarnedBadgesSection({ initialData }: { initialData?: ScreenDataResponse }) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const [catalog, setCatalog] = useState<BadgeCatalogEntry[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isCatalogVisible, setIsCatalogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const badges = useMemo(() => getRecentEarnedBadges(catalog), [catalog]);

  /** Fetches the complete catalog and replaces stale success or error state with the latest result. */
  const loadBadges = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const section = initialData?.sections.badges;
      setCatalog(section ? parseBadgeCatalogData(section.data) : await fetchBadgeCatalog());
    } catch (error) {
      logDevelopmentError("loading earned badges", error);
      setCatalog([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [initialData]);

  useEffect(() => {
    void loadBadges();
  }, [loadBadges]);

  /** Opens the already-loaded catalog without issuing a second request. */
  const openCatalog = useCallback(() => {
    setIsCatalogVisible(true);
  }, []);

  /** Dismisses the badge catalog from its close control or platform back action. */
  const closeCatalog = useCallback(() => {
    setIsCatalogVisible(false);
  }, []);

  return (
    <View accessibilityLabel={t("progress.badges.accessibilityLabel")} style={styles.section}>
      <View style={styles.heading}>
        <View style={styles.headingLabel}>
          <MaterialCommunityIcons
            accessible={false}
            color={theme.rosary.colors.gold}
            name="shield-cross"
            size={theme.sizes.iconSmall}
          />
          <Text accessibilityRole="header" style={styles.title}>
            {t("progress.badges.heading")}
          </Text>
        </View>
        {!isLoading && !hasError ? (
          <Pressable
            accessibilityLabel={t("progress.badges.viewAll")}
            accessibilityRole="button"
            onPress={openCatalog}
            style={({ pressed }) => [styles.viewAllButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.viewAllText}>{t("progress.badges.viewAll")}</Text>
            <MaterialCommunityIcons
              accessible={false}
              color={theme.rosary.colors.goldBright}
              name="chevron-right"
              size={theme.sizes.iconSmall}
            />
          </Pressable>
        ) : null}
      </View>

      {isLoading ? (
        <BadgeRowsSkeleton />
      ) : hasError ? (
        <BadgeLoadError onRetry={loadBadges} />
      ) : badges.length === 0 ? (
        <Card contentStyle={styles.emptyContent} padding="md" variant="outlined">
          <MaterialCommunityIcons
            accessible={false}
            color={theme.colors.text.subtle}
            name="shield-outline"
            size={theme.sizes.iconLarge}
          />
          <View style={styles.emptyCopy}>
            <Text style={styles.emptyTitle}>{t("progress.badges.noBadges")}</Text>
            <Text style={styles.emptyDescription}>{t("progress.badges.description")}</Text>
          </View>
        </Card>
      ) : (
        <Card contentStyle={styles.badgesContent} padding="none" style={styles.badgesCard} variant="outlined">
          {badges.map((badge, index) => (
            <EarnedBadgeRow badge={badge} isLast={index === badges.length - 1} key={badge.id} />
          ))}
        </Card>
      )}
      <BadgeCatalogModal badges={catalog} onClose={closeCatalog} visible={isCatalogVisible} />
    </View>
  );
}

/** Preserves the final badge-list footprint while its dashboard request is pending. */
function BadgeRowsSkeleton() {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <Card
      accessibilityLabel={t("progress.badges.loading")}
      contentStyle={styles.badgesContent}
      padding="none"
      variant="outlined"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <View
          accessibilityLabel={t("progress.badges.loadingBadge")}
          key={index}
          style={[styles.badgeSkeleton, index < 2 && styles.rowDivider]}
        >
          <View style={styles.skeletonBadgeIcon} />
          <View style={styles.skeletonBadgeCopy}>
            <View style={styles.skeletonBadgeName} />
            <View style={styles.skeletonBadgeDescription} />
          </View>
        </View>
      ))}
    </Card>
  );
}

/** Shows an accessible retry action when the dashboard cannot load earned badges. */
function BadgeLoadError({ onRetry }: { onRetry: () => Promise<void> }) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <Card contentStyle={styles.errorContent} padding="md" variant="outlined">
      <Text accessibilityRole="alert" style={styles.errorText}>
        {t("progress.badges.loadError")}
      </Text>
      <Pressable
        accessibilityLabel={t("progress.badges.retryLabel")}
        accessibilityRole="button"
        onPress={onRetry}
        style={styles.retryButton}
      >
        <Text style={styles.retryText}>{t("common.retry")}</Text>
      </Pressable>
    </Card>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  badgeSkeleton: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
  },
  badgesCard: {
    overflow: "hidden",
  },
  badgesContent: {
    overflow: "hidden",
  },
  buttonPressed: {
    opacity: theme.opacity.pressed,
  },
  emptyContent: {
    alignItems: "center",
    flexDirection: "row",
  },
  emptyCopy: {
    flex: 1,
    marginLeft: theme.spacing[3],
    minWidth: theme.spacing[0],
  },
  emptyDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
  },
  emptyTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamilies.bodySemibold,
  },
  errorContent: {
    alignItems: "center",
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    textAlign: "center",
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing[2],
  },
  headingLabel: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
    gap: theme.spacing[2],
    minWidth: theme.spacing[0],
  },
  retryButton: {
    justifyContent: "center",
    marginTop: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  retryText: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.goldBright,
  },
  rowDivider: {
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
  },
  section: {
    minWidth: theme.spacing[0],
    width: "100%",
  },
  skeletonBadgeCopy: {
    flex: 1,
  },
  skeletonBadgeDescription: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.sm,
    height: theme.spacing[2],
    marginTop: theme.spacing[2],
    width: "80%",
  },
  skeletonBadgeIcon: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.pill,
    height: 48,
    marginRight: theme.spacing[3],
    width: 48,
  },
  skeletonBadgeName: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.sm,
    height: theme.spacing[3],
    width: "55%",
  },
  title: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    flexShrink: 1,
    letterSpacing: theme.letterSpacing.wider,
  },
  viewAllButton: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingLeft: theme.spacing[2],
  },
  viewAllText: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.goldBright,
  },
}));
