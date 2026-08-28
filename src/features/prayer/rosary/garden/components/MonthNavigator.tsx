import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet, View } from "react-native";
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

function MonthButton({
  accessibilityLabel,
  canNavigate,
  direction,
  onPress,
  testID,
}: {
  accessibilityLabel: string;
  canNavigate: boolean;
  direction: "left" | "right";
  onPress: () => void;
  testID: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: !canNavigate }}
      disabled={!canNavigate}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.monthButton,
        canNavigate && isHovered && styles.hovered,
        !canNavigate && styles.disabled,
        canNavigate && pressed && styles.pressed,
      ]}
      testID={testID}
    >
      <Feather
        color={canNavigate ? theme.colors.text.white : theme.colors.text.muted}
        name={`chevron-${direction}`}
        size={theme.sizes.iconMedium}
      />
    </Pressable>
  );
}

export function MonthNavigator({ month, year, canGoPrevious, canGoNext, onPrevious, onNext }: MonthNavigatorProps) {
  const reduceMotion = useReducedMotion();
  const monthLabel = monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
  return (
    <View style={styles.container}>
      <MonthButton
        accessibilityLabel="Previous month"
        canNavigate={canGoPrevious}
        direction="left"
        onPress={onPrevious}
        testID="garden-previous-month"
      />
      <Animated.Text
        entering={reduceMotion ? undefined : FadeIn.duration(220)}
        key={`${year}-${month}`}
        style={styles.label}
      >
        {monthLabel}
      </Animated.Text>
      <MonthButton
        accessibilityLabel="Next month"
        canNavigate={canGoNext}
        direction="right"
        onPress={onNext}
        testID="garden-next-month"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing[2],
  },
  monthButton: {
    alignItems: "center",
    backgroundColor: theme.colors.brand.primaryDark,
    borderColor: theme.colors.brand.primaryLight,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  label: { ...theme.typography.heading2, color: theme.colors.text.white, fontFamily: theme.fontFamilies.devotional },
  hovered: { backgroundColor: theme.colors.brand.primary, opacity: theme.opacity.hover },
  disabled: { opacity: theme.opacity.disabled },
  pressed: { opacity: theme.opacity.pressed, transform: [{ scale: 0.96 }] },
});
