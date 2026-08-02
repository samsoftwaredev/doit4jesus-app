import { Image, Text, View } from "react-native";

import { styles, virtueToneColors } from "./VirtueProgressBar.styles";
import type { VirtueProgressBarProps } from "./virtues.types";

export function VirtueProgressBar({ label, value, maxValue, tone, icon }: VirtueProgressBarProps) {
  const safeMaxValue = Math.max(maxValue, 1);
  const clampedValue = Math.min(Math.max(value, 0), safeMaxValue);
  const progress = (clampedValue / safeMaxValue) * 100;
  const accentColor = virtueToneColors[tone];
  const accessibilityLabel = `${label}: ${clampedValue} out of ${safeMaxValue}`;

  return (
    <View style={styles.row}>
      <View style={styles.identity}>
        <View style={styles.iconFrame}>
          <Image accessible={false} resizeMode="cover" source={icon} style={styles.iconImage} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="progressbar"
        accessibilityValue={{ max: safeMaxValue, min: 0, now: clampedValue }}
        style={styles.progressTrack}
      >
        <View style={[styles.progressFill, { backgroundColor: accentColor, width: `${progress}%` }]}>
          <View pointerEvents="none" style={styles.progressHighlight} />
        </View>
      </View>
      <Text style={styles.score}>{`${clampedValue}/${safeMaxValue}`}</Text>
    </View>
  );
}
