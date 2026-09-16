import { useThemedStyles } from "@/theme/createThemedStyles";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { styles as styleSheet } from "./ArmorProgress.styles";

interface ArmorProgressProps {
  equippedCount: number;
  totalCount: number;
}

/** Renders ArmorProgress with styles resolved from the active appearance. */
export function ArmorProgress({ equippedCount, totalCount }: ArmorProgressProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const safeTotal = Math.max(totalCount, 1);
  const progress = Math.min(Math.max(equippedCount / safeTotal, 0), 1);
  const label = t("armor.equippedProgress", { equipped: equippedCount, total: totalCount });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        accessibilityLabel={label}
        accessibilityRole="progressbar"
        accessibilityValue={{ max: safeTotal, min: 0, now: equippedCount }}
        style={styles.track}
      >
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}
