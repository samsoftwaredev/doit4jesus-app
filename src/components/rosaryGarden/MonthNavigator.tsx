import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { theme } from "@/theme/tokens";

interface MonthNavigatorProps {
  month: number;
  year: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric", timeZone: "UTC" });

export function MonthNavigator({ month, year, canGoPrevious, canGoNext, onPrevious, onNext }: MonthNavigatorProps) {
  const reduceMotion = useReducedMotion();
  const monthLabel = monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="View previous month"
        accessibilityRole="button"
        accessibilityState={{ disabled: !canGoPrevious }}
        disabled={!canGoPrevious}
        onPress={onPrevious}
        style={({ pressed }) => [styles.monthButton, !canGoPrevious && styles.disabled, pressed && styles.pressed]}
        testID="garden-previous-month"
      >
        <Feather color={theme.colors.text.white} name="chevron-left" size={theme.sizes.iconMedium} />
      </Pressable>
      <Animated.Text entering={reduceMotion ? undefined : FadeIn.duration(220)} key={`${year}-${month}`} style={styles.label}>
        {monthLabel}
      </Animated.Text>
      <Pressable
        accessibilityLabel="View next month"
        accessibilityRole="button"
        accessibilityState={{ disabled: !canGoNext }}
        disabled={!canGoNext}
        onPress={onNext}
        style={({ pressed }) => [styles.monthButton, !canGoNext && styles.disabled, pressed && styles.pressed]}
        testID="garden-next-month"
      >
        <Feather color={theme.colors.text.white} name="chevron-right" size={theme.sizes.iconMedium} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingVertical: theme.spacing[2] },
  monthButton: { alignItems: "center", backgroundColor: theme.colors.brand.primaryDark, borderColor: theme.colors.brand.primaryLight, borderRadius: theme.radii.pill, borderWidth: theme.borderWidths.thin, height: theme.sizes.touchTarget, justifyContent: "center", width: theme.sizes.touchTarget },
  label: { ...theme.typography.heading2, color: theme.colors.text.white, fontFamily: theme.fontFamilies.devotional },
  disabled: { opacity: theme.opacity.disabled },
  pressed: { opacity: theme.opacity.pressed, transform: [{ scale: 0.96 }] },
});
