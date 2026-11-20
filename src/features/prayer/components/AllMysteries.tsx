import { useCallback, useMemo, useState } from "react";
import { Text, View } from "react-native";
import type { LayoutChangeEvent } from "react-native";
import { useTranslation } from "react-i18next";

import { RosaryMysteryCard } from "@/features/prayer/rosary/components/RosaryMysteryCard";
import { getRosaryContent } from "@/features/prayer/rosary/data/localizedRosaryContent";
import { getRosaryMysterySetsFromContent } from "@/features/prayer/rosary/data/rosaryMysteries";
import { useRosaryArtStylePreference } from "@/features/prayer/rosary/hooks/useRosaryArtStylePreference";
import type { RosaryMysteryType } from "@/features/prayer/rosary/types/rosary";
import { useAppLanguage } from "@/localization";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

type AllMysteriesProps = {
  gap: number;
  onOpenMystery: (mysteryType: RosaryMysteryType) => void;
};

/** Renders the complete grid of Rosary mystery sets, always as two columns (2x2). */
export function AllMysteries({ gap, onOpenMystery }: AllMysteriesProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { language } = useAppLanguage();
  const { rosaryArtStyle } = useRosaryArtStylePreference();
  const [gridWidth, setGridWidth] = useState(0);
  const onGridLayout = useCallback((event: LayoutChangeEvent) => {
    setGridWidth(Math.floor(event.nativeEvent.layout.width));
  }, []);
  const cardWidth = gridWidth > 0 ? Math.floor((gridWidth - gap) / 2) : 0;
  const rosaryMysterySets = useMemo(
    () => getRosaryMysterySetsFromContent(getRosaryContent(language), rosaryArtStyle),
    [language, rosaryArtStyle],
  );

  return (
    <View style={styles.section}>
      <Text accessibilityLabel={t("prayer.allMysteries")} accessibilityRole="header" style={styles.sectionLabel}>
        {t("prayer.allMysteriesUpper")}
      </Text>
      <View
        onLayout={onGridLayout}
        style={[styles.mysteryGrid, { columnGap: gap, rowGap: gap }]}
        testID="all-mysteries-grid"
      >
        {cardWidth > 0
          ? rosaryMysterySets.map((set) => (
              <RosaryMysteryCard
                key={set.type}
                mysterySet={set}
                onPress={() => onOpenMystery(set.type)}
                width={cardWidth}
              />
            ))
          : null}
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  mysteryGrid: { flexDirection: "row", flexWrap: "wrap" },
  section: { gap: theme.spacing[4] },
  sectionLabel: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
  },
}));
