import { Text, View } from "react-native";

import { RosaryMysteryCard } from "@/features/prayer/rosary/components";
import { rosaryMysterySets } from "@/features/prayer/rosary/data/rosaryMysteries";
import type { RosaryMysteryType } from "@/features/prayer/rosary/types/rosary";
import { useResponsiveLayout } from "@/hooks";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

type AllMysteriesProps = {
  cardWidth: number;
  gap: number;
  onOpenMystery: (mysteryType: RosaryMysteryType) => void;
};

/** Renders the complete grid of Rosary mystery sets. */
export function AllMysteries({ cardWidth, gap, onOpenMystery }: AllMysteriesProps) {
  const styles = useThemedStyles(styleSheet);
  const { isDesktop } = useResponsiveLayout();

  return (
    <View style={styles.section}>
      <Text accessibilityLabel="All Mysteries" accessibilityRole="header" style={styles.sectionLabel}>
        ALL MYSTERIES
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
