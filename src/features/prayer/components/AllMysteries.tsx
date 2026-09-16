import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { RosaryMysteryCard } from "@/features/prayer/rosary/components";
import { getRosaryContent } from "@/features/prayer/rosary/data/localizedRosaryContent";
import { getRosaryMysterySetsFromContent } from "@/features/prayer/rosary/data/rosaryMysteries";
import type { RosaryMysteryType } from "@/features/prayer/rosary/types/rosary";
import { useResponsiveLayout } from "@/hooks";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

type AllMysteriesProps = {
  cardWidth: number;
  gap: number;
  onOpenMystery: (mysteryType: RosaryMysteryType) => void;
};

/** Renders the complete grid of Rosary mystery sets. */
export function AllMysteries({ cardWidth, gap, onOpenMystery }: AllMysteriesProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { language } = useAppLanguage();
  const { isDesktop } = useResponsiveLayout();
  const rosaryMysterySets = getRosaryMysterySetsFromContent(getRosaryContent(language));

  return (
    <View style={styles.section}>
      <Text accessibilityLabel={t("prayer.allMysteries")} accessibilityRole="header" style={styles.sectionLabel}>
        {t("prayer.allMysteriesUpper")}
      </Text>
      <View
        style={[styles.mysteryGrid, isDesktop && styles.mysteryGridDesktop, { columnGap: gap, rowGap: gap }]}
        testID="all-mysteries-grid"
      >
        {rosaryMysterySets.map((set) => (
          <RosaryMysteryCard
            key={set.type}
            mysterySet={set}
            onPress={() => onOpenMystery(set.type)}
            width={cardWidth}
          />
        ))}
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  mysteryGrid: { flexDirection: "row", flexWrap: "wrap" },
  mysteryGridDesktop: { flexWrap: "nowrap" },
  section: { gap: theme.spacing[4] },
  sectionLabel: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
  },
}));
