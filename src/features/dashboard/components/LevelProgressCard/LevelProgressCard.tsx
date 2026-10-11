import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "react-native-reanimated";

import type { Gender } from "@/features/profile";
import type { DashboardProgress, LevelCatalogEntry } from "@/features/progress";
import { useResponsiveLayout } from "@/hooks";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { levelImagesByCode, type LevelImageCode } from "../../../../../assets/images/levels";
import { AvatarJourneyCard } from "../AvatarJourneyCard";
import { formatPoints } from "../../rosary-reminder";

const DEFAULT_LEVEL_CODE = "awakened";
const DEFAULT_LEVEL_NUMBER = 1;

type LevelProgressCardProps = {
  gender?: Gender | null;
  isLoading: boolean;
  levelCatalog: LevelCatalogEntry[] | null;
  progress: DashboardProgress | null;
  progressError: boolean;
};

type DisplayLevel = {
  code: string | null;
  levelNumber: number;
  minimumTotalXp: number | null;
  name: string;
};

/** Converts backend level identifiers into stable artwork-manifest keys. */
function normalizeLevelCode(code: string | null | undefined): string | null {
  if (!code) return null;
  const normalized = code
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized === "perservering_disciple" ? "persevering_disciple" : normalized;
}

/** Resolves artwork only when the backend code has a known, exact logical match. */
function resolveLevelImage(code: string | null | undefined) {
  const normalizedCode = normalizeLevelCode(code);
  if (!normalizedCode || !(normalizedCode in levelImagesByCode)) return null;
  return levelImagesByCode[normalizedCode as LevelImageCode];
}

/** Keeps API percentages within the valid accessible progress range. */
function clampPercentage(value: number | null | undefined): number {
  if (value === null || value === undefined || !Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), 0), 100);
}

/** Sorts a level catalogue without mutating the cached API response. */
function sortLevelCatalog(levelCatalog: LevelCatalogEntry[] | null): LevelCatalogEntry[] {
  return [...(levelCatalog ?? [])].sort((left, right) => left.levelNumber - right.levelNumber);
}

/** Presents current-level artwork, progression, and the complete ordered level catalogue. */
export function LevelProgressCard({
  gender = null,
  isLoading,
  levelCatalog,
  progress,
  progressError,
}: LevelProgressCardProps) {
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const { isLargeText, isNarrowPhone } = useResponsiveLayout();
  const reduceMotion = useReducedMotion();
  const styles = useThemedStyles(styleSheet);
  const [isCatalogVisible, setIsCatalogVisible] = useState(false);
  const sortedCatalog = useMemo(() => sortLevelCatalog(levelCatalog), [levelCatalog]);
  const defaultCatalogLevel = sortedCatalog.find((entry) => normalizeLevelCode(entry.code) === DEFAULT_LEVEL_CODE);
  const currentCatalogLevel = progress?.currentLevel
    ? sortedCatalog.find((entry) => entry.levelNumber === progress.currentLevel?.levelNumber)
    : defaultCatalogLevel;
  const currentLevel: DisplayLevel = progress?.currentLevel
    ? {
        code: progress.currentLevel.code ?? currentCatalogLevel?.code ?? null,
        levelNumber: progress.currentLevel.levelNumber,
        minimumTotalXp: progress.currentLevel.minimumTotalXp ?? currentCatalogLevel?.minimumTotalXp ?? null,
        name: progress.currentLevel.name ?? currentCatalogLevel?.name ?? t("dashboard.levelProgress.defaultLevel"),
      }
    : {
        code: defaultCatalogLevel?.code ?? DEFAULT_LEVEL_CODE,
        levelNumber: defaultCatalogLevel?.levelNumber ?? DEFAULT_LEVEL_NUMBER,
        minimumTotalXp: defaultCatalogLevel?.minimumTotalXp ?? 0,
        name: defaultCatalogLevel?.name ?? t("dashboard.levelProgress.defaultLevel"),
      };
  const nextCatalogLevel = sortedCatalog.find((entry) => entry.levelNumber > currentLevel.levelNumber);
  const nextLevel: DisplayLevel | null = progress?.nextLevel
    ? {
        code:
          progress.nextLevel.code ??
          sortedCatalog.find((entry) => entry.levelNumber === progress.nextLevel?.levelNumber)?.code ??
          null,
        levelNumber: progress.nextLevel.levelNumber,
        minimumTotalXp: progress.nextLevel.minimumTotalXp,
        name: progress.nextLevel.name ?? nextCatalogLevel?.name ?? t("dashboard.holyProgress.nextLevelGeneric"),
      }
    : progress?.currentLevel
      ? null
      : nextCatalogLevel
        ? { ...nextCatalogLevel }
        : null;
  const isHighestLevel = Boolean(progress?.currentLevel && !progress.nextLevel);
  const percentage = isHighestLevel ? 100 : clampPercentage(progress?.levelProgressPercentage);
  const currentImage = resolveLevelImage(currentLevel.code);
  const nextImage = resolveLevelImage(nextLevel?.code);
  const shouldStackLevels = isNarrowPhone || isLargeText;
  const hasCatalog = sortedCatalog.length > 0;

  return (
    <LinearGradient
      colors={theme.colors.gradients.holyProgress}
      end={{ x: 0.5, y: 1 }}
      start={{ x: 0.5, y: 0 }}
      style={styles.card}
    >
      <Text accessibilityRole="header" style={styles.heading}>
        {t("dashboard.levelProgress.title")}
      </Text>
      <Text style={styles.description}>{t("dashboard.avatarJourney.encouragement")}</Text>
      {!progressError ? <AvatarJourneyCard gender={gender} isLoading={isLoading} progress={progress} /> : null}
      <Text style={styles.description}>{t("dashboard.levelProgress.description")}</Text>

      {isLoading ? (
        <View accessibilityLabel={t("dashboard.levelProgress.loading")} style={styles.loadingState}>
          <View style={styles.loadingArtwork} />
          <View style={styles.loadingLine} />
        </View>
      ) : null}

      {!isLoading && progressError ? (
        <View accessibilityLiveRegion="polite" style={styles.messagePanel}>
          <MaterialCommunityIcons
            accessible={false}
            color={theme.colors.text.secondary}
            name="shield-alert-outline"
            size={theme.sizes.iconLarge}
          />
          <Text style={styles.messageText}>{t("dashboard.levelProgress.unavailable")}</Text>
        </View>
      ) : null}

      {!isLoading && !progressError ? (
        <>
          <View style={[styles.levelPair, shouldStackLevels && styles.levelPairStacked]} testID="level-pair">
            <View style={styles.levelPanel}>
              <Text style={styles.panelLabel}>{t("dashboard.levelProgress.current")}</Text>
              <View style={styles.artworkFrame}>
                {currentImage ? (
                  <Image
                    accessible
                    accessibilityLabel={t("dashboard.levelProgress.artworkLabel", { level: currentLevel.name })}
                    accessibilityRole="image"
                    contentFit="contain"
                    source={currentImage}
                    style={styles.artwork}
                    transition={reduceMotion ? 0 : 180}
                  />
                ) : (
                  <MaterialCommunityIcons
                    accessible={false}
                    color={theme.colors.gold.pale}
                    name="shield-cross"
                    size={theme.sizes.iconXL}
                    testID="current-level-shield-fallback"
                  />
                )}
              </View>
              <Text style={styles.levelNumber}>
                {t("dashboard.levelProgress.level", { number: currentLevel.levelNumber })}
              </Text>
              <Text style={styles.levelName}>{currentLevel.name}</Text>
            </View>

            <View style={styles.levelPanel}>
              <Text style={styles.panelLabel}>{t("dashboard.levelProgress.next")}</Text>
              {nextLevel ? (
                <>
                  <View style={styles.artworkFrame}>
                    {nextImage ? (
                      <Image
                        accessible
                        accessibilityLabel={t("dashboard.levelProgress.artworkLabel", { level: nextLevel.name })}
                        accessibilityRole="image"
                        contentFit="contain"
                        source={nextImage}
                        style={styles.artwork}
                        transition={reduceMotion ? 0 : 180}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        accessible={false}
                        color={theme.colors.gold.pale}
                        name="shield-cross"
                        size={theme.sizes.iconXL}
                        testID="next-level-shield-fallback"
                      />
                    )}
                  </View>
                  <Text style={styles.levelNumber}>
                    {t("dashboard.levelProgress.level", { number: nextLevel.levelNumber })}
                  </Text>
                  <Text style={styles.levelName}>{nextLevel.name}</Text>
                </>
              ) : isHighestLevel ? (
                <View style={styles.highestPanel}>
                  <MaterialCommunityIcons
                    accessible={false}
                    color={theme.colors.gold.pale}
                    name="crown-outline"
                    size={theme.sizes.iconHero}
                  />
                  <Text style={styles.highestText}>{t("dashboard.levelProgress.highest")}</Text>
                </View>
              ) : (
                <View style={styles.highestPanel}>
                  <MaterialCommunityIcons
                    accessible={false}
                    color={theme.colors.text.secondary}
                    name="shield-outline"
                    size={theme.sizes.iconHero}
                  />
                  <Text style={styles.messageText}>{t("dashboard.levelProgress.nextUnavailable")}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.progressSection}>
            <View
              accessible
              accessibilityLabel={t("dashboard.levelProgress.progressLabel", {
                current: currentLevel.name,
                next:
                  nextLevel?.name ??
                  t(isHighestLevel ? "dashboard.levelProgress.highest" : "dashboard.levelProgress.nextUnavailable"),
                percent: percentage,
              })}
              accessibilityRole="progressbar"
              accessibilityValue={{ max: 100, min: 0, now: percentage }}
              style={styles.progressTrack}
            >
              <View style={[styles.progressFill, { width: `${percentage}%` }]} />
            </View>
            <Text style={styles.progressCopy}>
              {isHighestLevel
                ? t("dashboard.levelProgress.highest")
                : t("dashboard.levelProgress.progress", {
                    level: nextLevel?.name ?? t("dashboard.holyProgress.nextLevelGeneric"),
                    percent: percentage,
                  })}
            </Text>
          </View>
        </>
      ) : null}

      {hasCatalog ? (
        <Pressable
          accessibilityLabel={t("dashboard.levelProgress.seeLevelsLabel")}
          accessibilityRole="button"
          onPress={() => setIsCatalogVisible(true)}
          style={({ pressed }) => [styles.seeLevelsButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.seeLevelsText}>{t("dashboard.levelProgress.seeLevels")}</Text>
          <MaterialCommunityIcons
            accessible={false}
            color={theme.colors.gold.pale}
            name="chevron-right"
            size={theme.sizes.iconMedium}
          />
        </Pressable>
      ) : null}

      <Modal
        animationType={reduceMotion ? "none" : "fade"}
        onRequestClose={() => setIsCatalogVisible(false)}
        transparent
        visible={isCatalogVisible}
      >
        <View style={styles.modalOverlay}>
          <View accessibilityViewIsModal style={styles.modalSurface}>
            <View style={styles.modalHeader}>
              <Text accessibilityRole="header" style={styles.modalTitle}>
                {t("dashboard.levelProgress.modalTitle")}
              </Text>
              <Pressable
                accessibilityLabel={t("dashboard.levelProgress.close")}
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setIsCatalogVisible(false)}
                style={({ pressed }) => [styles.closeButton, pressed && styles.buttonPressed]}
              >
                <MaterialCommunityIcons
                  accessible={false}
                  color={theme.colors.text.primary}
                  name="close"
                  size={theme.sizes.iconMedium}
                />
              </Pressable>
            </View>
            <ScrollView
              accessibilityLabel={t("dashboard.levelProgress.listLabel")}
              contentContainerStyle={styles.levelList}
              showsVerticalScrollIndicator
            >
              {sortedCatalog.map((entry) => {
                const isCurrent = entry.levelNumber === currentLevel.levelNumber;
                const artwork = resolveLevelImage(entry.code);
                const formattedXp = formatPoints(entry.minimumTotalXp, locale);
                return (
                  <View
                    accessible
                    accessibilityLabel={t(
                      isCurrent ? "dashboard.levelProgress.rowLabelCurrent" : "dashboard.levelProgress.rowLabel",
                      {
                        level: entry.name,
                        number: entry.levelNumber,
                        points: formattedXp,
                      },
                    )}
                    accessibilityRole="summary"
                    accessibilityState={{ selected: isCurrent }}
                    key={`${entry.code}-${entry.levelNumber}`}
                    style={[styles.catalogRow, isCurrent && styles.catalogRowCurrent]}
                  >
                    <View style={styles.catalogArtworkFrame}>
                      {artwork ? (
                        <Image accessible={false} contentFit="contain" source={artwork} style={styles.catalogArtwork} />
                      ) : (
                        <MaterialCommunityIcons
                          accessible={false}
                          color={theme.colors.gold.pale}
                          name="shield-cross"
                          size={theme.sizes.iconHero}
                        />
                      )}
                    </View>
                    <View style={styles.catalogCopy}>
                      <Text style={styles.catalogNumber}>
                        {t("dashboard.levelProgress.level", { number: entry.levelNumber })}
                      </Text>
                      <Text style={styles.catalogName}>{entry.name}</Text>
                      <Text style={styles.catalogXp}>
                        {t("dashboard.levelProgress.xpRequired", { points: formattedXp })}
                      </Text>
                      {isCurrent ? (
                        <Text
                          accessibilityElementsHidden
                          importantForAccessibility="no-hide-descendants"
                          style={styles.currentMarker}
                        >
                          {t("dashboard.levelProgress.currentMarker")}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  artwork: {
    height: "100%",
    width: "100%",
  },
  artworkFrame: {
    alignItems: "center",
    aspectRatio: 1,
    justifyContent: "center",
    maxWidth: 156,
    width: "72%",
  },
  buttonPressed: {
    opacity: theme.opacity.pressed,
  },
  card: {
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    gap: theme.spacing[4],
    minHeight: 350,
    overflow: "hidden",
    padding: theme.spacing[4],
  },
  catalogArtwork: {
    height: "100%",
    width: "100%",
  },
  catalogArtworkFrame: {
    alignItems: "center",
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  catalogCopy: {
    flex: 1,
    gap: theme.spacing[0.5],
    minWidth: theme.spacing[0],
  },
  catalogName: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
  },
  catalogNumber: {
    ...theme.typography.labelSmall,
    color: theme.colors.gold.pale,
  },
  catalogRow: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    gap: theme.spacing[3],
    minHeight: 96,
    padding: theme.spacing[3],
  },
  catalogRowCurrent: {
    backgroundColor: theme.colors.surface.green,
    borderColor: theme.colors.gold.primary,
    borderWidth: theme.borderWidths.medium,
  },
  catalogXp: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
  },
  closeButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  currentMarker: {
    ...theme.typography.labelSmall,
    alignSelf: "flex-start",
    backgroundColor: theme.colors.gold.primary,
    borderRadius: theme.radii.pill,
    color: theme.colors.background.deep,
    marginTop: theme.spacing[1],
    overflow: "hidden",
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  heading: {
    ...theme.typography.heading3,
    color: theme.colors.gold.pale,
    fontFamily: theme.fontFamilies.devotional,
    letterSpacing: theme.letterSpacing.wide,
    textAlign: "center",
  },
  highestPanel: {
    alignItems: "center",
    flex: 1,
    gap: theme.spacing[3],
    justifyContent: "center",
    minHeight: 150,
    paddingHorizontal: theme.spacing[3],
  },
  highestText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.gold.pale,
    textAlign: "center",
  },
  levelList: {
    gap: theme.spacing[3],
    padding: theme.spacing[4],
  },
  levelName: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  levelNumber: {
    ...theme.typography.label,
    color: theme.colors.gold.pale,
    textAlign: "center",
  },
  levelPair: {
    alignItems: "stretch",
    flexDirection: "row",
    gap: theme.spacing[3],
  },
  levelPairStacked: {
    flexDirection: "column",
  },
  levelPanel: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flex: 1,
    gap: theme.spacing[1],
    minWidth: theme.spacing[0],
    padding: theme.spacing[3],
  },
  loadingArtwork: {
    aspectRatio: 1,
    backgroundColor: theme.colors.border.subtle,
    borderRadius: theme.radii.pill,
    width: 112,
  },
  loadingLine: {
    backgroundColor: theme.colors.border.subtle,
    borderRadius: theme.radii.pill,
    height: theme.spacing[3],
    width: "58%",
  },
  loadingState: {
    alignItems: "center",
    flex: 1,
    gap: theme.spacing[4],
    justifyContent: "center",
    minHeight: 230,
  },
  messagePanel: {
    alignItems: "center",
    flex: 1,
    gap: theme.spacing[3],
    justifyContent: "center",
    minHeight: 230,
  },
  messageText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  modalHeader: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.thin,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: theme.colors.background.overlay,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing[4],
  },
  modalSurface: {
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    maxHeight: "88%",
    maxWidth: 640,
    overflow: "hidden",
    width: "100%",
  },
  modalTitle: {
    ...theme.typography.heading2,
    color: theme.colors.text.primary,
    flex: 1,
  },
  panelLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  progressCopy: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  progressFill: {
    backgroundColor: theme.colors.gold.primary,
    borderRadius: theme.radii.pill,
    height: "100%",
  },
  progressSection: {
    gap: theme.spacing[2],
  },
  progressTrack: {
    backgroundColor: theme.colors.background.deep,
    borderRadius: theme.radii.pill,
    height: theme.spacing[2],
    overflow: "hidden",
    width: "100%",
  },
  seeLevelsButton: {
    alignItems: "center",
    alignSelf: "center",
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[5],
  },
  seeLevelsText: {
    ...theme.typography.label,
    color: theme.colors.gold.pale,
  },
}));
