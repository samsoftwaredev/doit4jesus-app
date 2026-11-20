import type { ImageSourcePropType } from "react-native";
import { View } from "react-native";

import type { RosaryMystery, RosaryPrayer } from "@/features/prayer/rosary/types";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

import { FruitPrayerCard } from "../FruitPrayerCard";
import { MysteryScriptureCard } from "../MysteryScriptureCard";
import { RosaryArtworkCard } from "../RosaryArtworkCard";

export interface RosaryDetailsProps {
  artworkSource?: ImageSourcePropType;
  isNarrationOnly?: boolean;
  mystery?: RosaryMystery;
  prayer?: RosaryPrayer;
  scriptureQuotation?: string;
  scriptureReference?: string;
}

/**
 * Stacks the current mystery, its artwork, and the scripture and prayer in one view
 * so the whole Rosary page scrolls vertically without any horizontal paging.
 */
export function RosaryDetails({
  artworkSource,
  isNarrationOnly = false,
  mystery,
  prayer,
  scriptureQuotation,
  scriptureReference,
}: RosaryDetailsProps) {
  const styles = useThemedStyles(styleSheet);

  return (
    <View style={styles.container} testID="rosary-details">
      <MysteryScriptureCard mystery={mystery} />
      <RosaryArtworkCard imageSource={artworkSource} />
      <FruitPrayerCard
        fruit={mystery?.fruit}
        fruitDescription={mystery?.fruitDescription}
        hidePrayerWhenEmpty={isNarrationOnly}
        prayer={prayer}
        scriptureQuotation={scriptureQuotation}
        scriptureReference={scriptureReference}
        showFruit={false}
      />
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  container: {
    gap: theme.spacing[3],
    minWidth: 0,
    width: "100%",
  },
}));
