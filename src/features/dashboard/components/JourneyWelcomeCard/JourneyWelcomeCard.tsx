import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { Gender } from "@/features/profile";
import { useResponsiveLayout } from "@/hooks";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const knightArtwork = require("../../../../../assets/images/avatar/knight.png");
const princessArtwork = require("../../../../../assets/images/avatar/princess.png");

const journeyRows = [
  { icon: "home-variant-outline", labelKey: "dashboard.journey.home", rowLabelKey: "dashboard.journey.homeLabel" },
  { icon: "hands-pray", labelKey: "dashboard.journey.prayer", rowLabelKey: "dashboard.journey.prayerLabel" },
  {
    icon: "account-group-outline",
    labelKey: "dashboard.journey.community",
    rowLabelKey: "dashboard.journey.communityLabel",
  },
  {
    icon: "account-circle-outline",
    labelKey: "dashboard.journey.profile",
    rowLabelKey: "dashboard.journey.profileLabel",
  },
] as const;

export type JourneyWelcomeCardProps = {
  displayName: string | null;
  gender: Gender | null;
};

/**
 * Presents a premium, responsive spiritual journey map when Home progress data is unavailable.
 *
 * @param props - The current user's optional name and gender used to select companion artwork.
 * @returns A localized, non-interactive journey card with accessible tab descriptions.
 */
export function JourneyWelcomeCard({ displayName, gender }: JourneyWelcomeCardProps) {
  const { t } = useTranslation();
  const { isLargeText, isTablet } = useResponsiveLayout();
  const styles = useThemedStyles(styleSheet);
  const hasDisplayName = Boolean(displayName?.trim());
  const usesKnight = gender === "male";
  const usesWideLayout = isTablet && !isLargeText;

  return (
    <LinearGradient
      colors={[theme.colors.surface.navyDeep, theme.colors.background.deep]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[styles.card, usesWideLayout && styles.cardWide]}
      testID="journey-welcome-card"
    >
      <View accessible={false} pointerEvents="none" style={styles.innerBorder} />
      <View accessible={false} pointerEvents="none" style={styles.topCorner} />
      <View accessible={false} pointerEvents="none" style={styles.bottomCorner} />

      <View style={[styles.copy, usesWideLayout && styles.copyWide]}>
        <View accessible={false} style={styles.ornament} testID="journey-ornament">
          <View style={styles.ornamentLine} />
          <MaterialCommunityIcons
            color={theme.rosary.colors.gold}
            name="star-four-points"
            size={theme.sizes.iconSmall}
          />
          <View style={styles.ornamentLine} />
        </View>
        <Text accessibilityRole="header" style={styles.title}>
          {hasDisplayName ? t("dashboard.journey.titleNamed", { name: displayName }) : t("dashboard.journey.title")}
        </Text>
        <Text style={styles.intro}>{t("dashboard.journey.intro")}</Text>
        <View accessible={false} style={styles.introductionDivider} testID="journey-introduction-divider">
          <View style={styles.dividerLine} />
          <Text style={styles.dividerDiamond}>◆</Text>
          <View style={styles.dividerLine} />
        </View>

        <View accessibilityLabel={t("dashboard.journey.tabsLabel")} style={styles.tabs}>
          {journeyRows.map((row, index) => (
            <View key={row.labelKey}>
              <View accessible accessibilityLabel={t(row.rowLabelKey)} style={styles.row}>
                <View accessible={false} style={styles.iconFrame}>
                  <MaterialCommunityIcons
                    color={theme.rosary.colors.gold}
                    name={row.icon}
                    size={theme.sizes.iconSmall}
                  />
                </View>
                <Text style={styles.tab}>{t(row.labelKey)}</Text>
                <MaterialCommunityIcons
                  accessible={false}
                  color={theme.colors.text.muted}
                  name="chevron-right"
                  size={theme.sizes.iconSmall}
                  testID={`journey-row-chevron-${index}`}
                />
              </View>
              {index < journeyRows.length - 1 ? <View accessible={false} style={styles.rowDivider} /> : null}
            </View>
          ))}
        </View>
      </View>
      <View style={[styles.artworkArea, usesWideLayout && styles.artworkAreaWide]}>
        <Image
          accessible
          accessibilityLabel={t(usesKnight ? "dashboard.journey.knightLabel" : "dashboard.journey.princessLabel")}
          accessibilityRole="image"
          contentFit="contain"
          source={usesKnight ? knightArtwork : princessArtwork}
          style={styles.artwork}
          testID="journey-companion-artwork"
        />
      </View>

      <View accessibilityLabel={t("dashboard.journey.goal")} style={styles.goal}>
        <MaterialCommunityIcons
          accessible={false}
          color={theme.rosary.colors.gold}
          name="cross"
          ze={theme.sizes.iconSmall}
        />
        <Text style={styles.goalText}>{t("dashboard.journey.goal")}</Text>
      </View>
    </LinearGradient>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  artwork: { bottom: 0, height: "100%", position: "absolute", right: 0, width: "100%" },
  artworkArea: {
    alignSelf: "center",
    height: theme.spacing[24] * 2,
    marginTop: theme.spacing[3],
    maxWidth: "100%",
    minWidth: theme.spacing[24] + theme.spacing[12],
    overflow: "hidden",
    width: "72%",
  },
  artworkAreaWide: {
    alignSelf: "stretch",
    bottom: theme.spacing[0],
    height: "auto",
    marginTop: theme.spacing[0],
    minWidth: theme.spacing[0],
    position: "absolute",
    right: theme.spacing[0],
    top: theme.spacing[0],
    width: "43%",
  },
  artworkFade: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0, zIndex: 1 },
  bottomCorner: {
    borderBottomColor: theme.rosary.colors.goldMuted,
    borderBottomLeftRadius: theme.radii.lg,
    borderBottomWidth: theme.borderWidths.hairline,
    borderLeftColor: theme.rosary.colors.goldMuted,
    borderLeftWidth: theme.borderWidths.hairline,
    bottom: theme.spacing[2],
    height: theme.spacing[4],
    left: theme.spacing[2],
    position: "absolute",
    width: theme.spacing[4],
  },
  card: {
    borderColor: theme.colors.brand.primary,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.hairline,
    minWidth: theme.spacing[0],
    overflow: "hidden",
    padding: theme.spacing[5],
    shadowColor: theme.colors.brand.primary,
    shadowOpacity: 0.26,
    shadowRadius: theme.spacing[4],
  },
  cardWide: { minHeight: theme.spacing[24] * 4, paddingRight: "43%" },
  copy: { zIndex: 2 },
  copyWide: { flex: 1 },
  dividerDiamond: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    marginHorizontal: theme.spacing[2],
  },
  dividerLine: { backgroundColor: theme.colors.border.subtle, flex: 1, height: theme.borderWidths.hairline },
  goal: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.green,
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    marginTop: theme.spacing[3],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  goalText: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing[2],
  },
  iconFrame: {
    alignItems: "center",
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    marginRight: theme.spacing[3],
    width: theme.sizes.touchTarget,
  },
  innerBorder: {
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.hairline,
    bottom: theme.spacing[1],
    left: theme.spacing[1],
    position: "absolute",
    right: theme.spacing[1],
    top: theme.spacing[1],
  },
  introductionDivider: { alignItems: "center", flexDirection: "row", marginVertical: theme.spacing[4] },
  intro: { ...theme.typography.body, color: theme.colors.text.secondary, marginTop: theme.spacing[2] },
  ornament: { alignItems: "center", flexDirection: "row", width: theme.spacing[24] },
  ornamentLine: {
    backgroundColor: theme.rosary.colors.goldMuted,
    flex: 1,
    height: theme.borderWidths.hairline,
    marginHorizontal: theme.spacing[1],
  },
  row: { alignItems: "center", flexDirection: "row", minHeight: theme.sizes.touchTarget + theme.spacing[2] },
  rowDivider: {
    backgroundColor: theme.colors.border.subtle,
    height: theme.borderWidths.hairline,
    marginLeft: theme.sizes.touchTarget + theme.spacing[3],
  },
  tab: { ...theme.typography.bodySmall, color: theme.colors.text.primary, flex: 1 },
  tabs: { gap: theme.spacing[0] },
  title: { ...theme.typography.heading2, color: theme.colors.text.primary, marginTop: theme.spacing[3] },
  topCorner: {
    borderRightColor: theme.rosary.colors.goldMuted,
    borderRightWidth: theme.borderWidths.hairline,
    borderTopColor: theme.rosary.colors.goldMuted,
    borderTopRightRadius: theme.radii.lg,
    borderTopWidth: theme.borderWidths.hairline,
    height: theme.spacing[4],
    position: "absolute",
    right: theme.spacing[2],
    top: theme.spacing[2],
    width: theme.spacing[4],
  },
}));
