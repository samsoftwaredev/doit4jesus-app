import { boxShadow } from "@/theme/boxShadow";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { Gender } from "@/features/profile";
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
  const styles = useThemedStyles(styleSheet);
  const hasDisplayName = Boolean(displayName?.trim());
  const usesKnight = gender === "male";

  return (
    <LinearGradient
      colors={[theme.colors.surface.navyDeep, theme.colors.background.deep]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.card}
      testID="journey-welcome-card"
    >
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text accessibilityRole="header" style={styles.title}>
            {hasDisplayName ? t("dashboard.journey.titleNamed", { name: displayName }) : t("dashboard.journey.title")}
          </Text>
          <Text style={styles.intro}>{t("dashboard.journey.intro")}</Text>
        </View>
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

      <View accessibilityLabel={t("dashboard.journey.tabsLabel")} style={styles.tabs}>
        {journeyRows.map((row) => (
          <View accessible accessibilityLabel={t(row.rowLabelKey)} key={row.labelKey} style={styles.row}>
            <MaterialCommunityIcons
              accessible={false}
              color={theme.rosary.colors.gold}
              name={row.icon}
              size={theme.sizes.iconSmall}
            />
            <Text style={styles.tab}>{t(row.labelKey)}</Text>
          </View>
        ))}
      </View>

      <View accessibilityLabel={t("dashboard.journey.goal")} style={styles.goal}>
        <MaterialCommunityIcons
          accessible={false}
          color={theme.rosary.colors.gold}
          name="cross"
          size={theme.sizes.iconSmall}
        />
        <Text style={styles.goalText}>{t("dashboard.journey.goal")}</Text>
      </View>
    </LinearGradient>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  artwork: { height: theme.spacing[24], width: theme.spacing[20] },
  card: {
    borderColor: theme.colors.brand.primary,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.hairline,
    gap: theme.spacing[3],
    minWidth: theme.spacing[0],
    overflow: "hidden",
    padding: theme.spacing[3],
    ...boxShadow(theme.colors.brand.primary, 0.26, 0, theme.spacing[4]),
  },
  copy: { flex: 1, minWidth: theme.spacing[0] },
  goal: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.green,
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  goalText: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.primary,
    flex: 1,
    marginLeft: theme.spacing[2],
  },
  header: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2] },
  intro: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, marginTop: theme.spacing[1] },
  row: {
    alignItems: "center",
    flexBasis: "47%",
    flexDirection: "row",
    flexGrow: 1,
    gap: theme.spacing[2],
    minHeight: theme.spacing[8],
  },
  tab: { ...theme.typography.caption, color: theme.colors.text.primary, flex: 1 },
  tabs: { flexDirection: "row", flexWrap: "wrap", columnGap: theme.spacing[3], rowGap: theme.spacing[1] },
  title: { ...theme.typography.heading3, color: theme.colors.text.primary },
}));
