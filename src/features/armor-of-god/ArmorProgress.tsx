import { Text, View } from "react-native";

import { styles } from "./ArmorProgress.styles";

interface ArmorProgressProps {
  equippedCount: number;
  totalCount: number;
}

export function ArmorProgress({ equippedCount, totalCount }: ArmorProgressProps) {
  const safeTotal = Math.max(totalCount, 1);
  const progress = Math.min(Math.max(equippedCount / safeTotal, 0), 1);
  const label = `Armor Equipped: ${equippedCount} of ${totalCount}`;

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
