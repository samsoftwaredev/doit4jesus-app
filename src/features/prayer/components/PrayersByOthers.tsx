import Feather from "@expo/vector-icons/Feather";
import { ActivityIndicator, FlatList, type ListRenderItemInfo, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import type { ApprovedPrayerIntention } from "@/features/prayer/intentions";
import { PrayerIntentionCard } from "@/features/prayer/intentions/components";
import { useResponsiveLayout } from "@/hooks";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const intentionCardWidth = 142;
const largeTextIntentionCardWidth = 220;

type PrayersByOthersProps = {
  errorMessage?: string;
  hasMore: boolean;
  intentions: ApprovedPrayerIntention[];
  isLoading: boolean;
  isLoadingMore: boolean;
  onCreateIntention: () => void;
  onLoadMore: () => void;
  onOpenIntention: (intentionId: string) => void;
  onOpenMyIntentions: () => void;
  onRetry: () => void;
  onSeeAll: () => void;
};

/** Renders the public prayer-intention preview and its management actions. */
export function PrayersByOthers({
  errorMessage,
  hasMore,
  intentions,
  isLoading,
  isLoadingMore,
  onCreateIntention,
  onLoadMore,
  onOpenIntention,
  onOpenMyIntentions,
  onRetry,
  onSeeAll,
}: PrayersByOthersProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { isLargeText } = useResponsiveLayout();
  const cardWidth = isLargeText ? largeTextIntentionCardWidth : intentionCardWidth;
  const snapInterval = cardWidth + theme.spacing[2];
  const hasInitialError = Boolean(errorMessage && intentions.length === 0);

  /** Renders one public intention within the horizontally paginated carousel. */
  const renderIntention = ({ item }: ListRenderItemInfo<ApprovedPrayerIntention>) => (
    <PrayerIntentionPreview intention={item} onOpenIntention={onOpenIntention} />
  );

  return (
    <View style={styles.section}>
      <View style={styles.intentionsHeader}>
        <Text
          accessibilityLabel={t("intentions.prayersByOthers")}
          accessibilityRole="header"
          style={styles.sectionLabel}
        >
          {t("intentions.prayersByOthersUpper")}
        </Text>
        <Pressable
          accessibilityLabel={t("intentions.seeAllLabel")}
          accessibilityRole="button"
          onPress={onSeeAll}
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAll}>{t("intentions.seeAll")}</Text>
          <Feather
            accessible={false}
            color={theme.rosary.colors.goldBright}
            name="chevron-right"
            size={theme.sizes.iconSmall}
          />
        </Pressable>
      </View>

      {isLoading ? <PrayerIntentionSkeletons /> : null}
      {!isLoading && !hasInitialError ? (
        <FlatList
          accessibilityLabel={t("intentions.carousel")}
          contentContainerStyle={styles.intentionsList}
          data={intentions}
          decelerationRate="fast"
          disableIntervalMomentum
          horizontal
          keyExtractor={getIntentionKey}
          ListFooterComponent={isLoadingMore ? <LoadingMoreCard isLargeText={isLargeText} /> : null}
          ListHeaderComponent={<ShareIntentionCard isLargeText={isLargeText} onPress={onCreateIntention} />}
          onEndReached={hasMore && !errorMessage ? onLoadMore : undefined}
          onEndReachedThreshold={0.6}
          renderItem={renderIntention}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={snapInterval}
          testID="prayer-intentions-carousel"
        />
      ) : null}
      {errorMessage ? (
        <View style={styles.intentionState}>
          <Text accessibilityRole="alert" style={styles.stateText}>
            {t(intentions.length > 0 ? "intentions.loadMoreError" : "intentions.loadError")}
          </Text>
          <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>{t("common.retry")}</Text>
          </Pressable>
        </View>
      ) : null}
      {!isLoading && !errorMessage && intentions.length === 0 ? (
        <View style={styles.intentionState}>
          <Text style={styles.stateText}>{t("intentions.empty")}</Text>
          <Text style={styles.stateCopy}>{t("intentions.emptyCopy")}</Text>
        </View>
      ) : null}
      <View style={styles.managementRow}>
        <Pressable
          accessibilityLabel={t("intentions.myViewLabel")}
          accessibilityRole="button"
          onPress={onOpenMyIntentions}
          style={styles.managementButton}
        >
          <Feather accessible={false} color={theme.rosary.colors.gold} name="list" size={theme.sizes.iconSmall} />
          <Text style={styles.managementText}>{t("intentions.myShort")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Returns a stable virtualization key for a public prayer intention. */
function getIntentionKey(intention: ApprovedPrayerIntention) {
  return intention.id;
}

/** Connects one prayer-intention card to its identifier-based navigation callback. */
function PrayerIntentionPreview({
  intention,
  onOpenIntention,
}: {
  intention: ApprovedPrayerIntention;
  onOpenIntention: (intentionId: string) => void;
}) {
  /** Opens the represented intention without exposing card internals to the carousel. */
  const handlePress = () => {
    onOpenIntention(intention.id);
  };

  return <PrayerIntentionCard intention={intention} onPress={handlePress} />;
}

/** Renders the leading call-to-action card for sharing a new prayer intention. */
function ShareIntentionCard({ isLargeText, onPress }: { isLargeText: boolean; onPress: () => void }) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityLabel={t("intentions.share")}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.shareCard, isLargeText && styles.shareCardLargeText]}
    >
      <View style={styles.plusCircle}>
        <Text accessible={false} style={styles.sharePlus} testID="share-intention-plus">
          +
        </Text>
      </View>
      <Text style={styles.shareTitle}>{t("intentions.share")}</Text>
      <Text style={styles.shareCopy}>{t("intentions.shareCopy")}</Text>
    </Pressable>
  );
}

/** Shows that another page of intentions is being appended to the carousel. */
function LoadingMoreCard({ isLargeText }: { isLargeText: boolean }) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();

  return (
    <View
      accessibilityLabel={t("intentions.loadingMoreLabel")}
      style={[styles.loadingMoreCard, isLargeText && styles.shareCardLargeText]}
    >
      <ActivityIndicator color={theme.rosary.colors.gold} />
    </View>
  );
}

/** Renders lightweight placeholders while public intentions are loading. */
function PrayerIntentionSkeletons() {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();

  return (
    <View accessibilityLabel={t("intentions.loadingLabel")} style={styles.skeletonRow}>
      {[0, 1, 2].map((item) => (
        <View key={item} style={styles.skeletonCard}>
          <ActivityIndicator color={theme.rosary.colors.gold} />
        </View>
      ))}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  intentionState: {
    alignItems: "flex-start",
    backgroundColor: "rgba(15, 42, 62, 0.82)",
    borderColor: "rgba(230, 186, 100, 0.34)",
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.hairline,
    padding: theme.spacing[4],
  },
  intentionsHeader: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: theme.spacing[1],
  },
  intentionsList: { gap: theme.spacing[2], paddingRight: theme.spacing[3] },
  loadingMoreCard: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.cardInset,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.hairline,
    justifyContent: "center",
    minHeight: 178,
    width: intentionCardWidth,
  },
  managementButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[1],
    minHeight: theme.sizes.touchTarget,
  },
  managementRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[4],
    justifyContent: "center",
  },
  managementText: {
    ...theme.typography.caption,
    color: theme.rosary.colors.goldBright,
  },
  plusCircle: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.12)",
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    height: theme.spacing[16],
    justifyContent: "center",
    width: theme.spacing[16],
  },
  retryButton: {
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    justifyContent: "center",
    marginTop: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  retryText: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.goldBright,
  },
  section: { gap: theme.spacing[4] },
  sectionLabel: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
  },
  shareCard: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.cardInset,
    borderColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.lg,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    justifyContent: "center",
    minHeight: 178,
    padding: theme.spacing[3],
    width: intentionCardWidth,
  },
  shareCardLargeText: {
    minHeight: 240,
    width: largeTextIntentionCardWidth,
  },
  shareCopy: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
    textAlign: "center",
  },
  sharePlus: {
    color: theme.rosary.colors.goldBright,
    fontSize: theme.sizes.iconHero,
    lineHeight: theme.sizes.touchTarget,
    textAlign: "center",
  },
  shareTitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.text.white,
    marginTop: theme.spacing[2],
    textAlign: "center",
  },
  seeAll: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.goldBright,
  },
  seeAllButton: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: theme.sizes.touchTarget,
  },
  skeletonCard: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.cardInset,
    borderRadius: theme.radii.lg,
    height: 178,
    justifyContent: "center",
    width: 142,
  },
  skeletonRow: {
    flexDirection: "row",
    gap: theme.spacing[2],
    overflow: "hidden",
  },
  stateCopy: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },
  stateText: { ...theme.typography.bodyMedium, color: theme.colors.text.white },
}));
