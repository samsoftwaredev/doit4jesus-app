import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";
import { useAppLanguage } from "@/localization";

interface MonthNavigatorProps {
  month: number;
  year: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

/** Renders MonthButton with styles resolved from the active appearance. */
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
  const styles = useThemedStyles(styleSheet);
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

/** Renders a month navigator and prevents duplicate navigation while a month is loading. */
export function MonthNavigator({
  month,
  year,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  isLoading = false,
}: MonthNavigatorProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { locale } = useAppLanguage();
  const reduceMotion = useReducedMotion();
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
  return (
    <View style={styles.container}>
      <MonthButton
        accessibilityLabel={t("rosary.garden.previousMonth")}
        canNavigate={canGoPrevious && !isLoading}
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
        accessibilityLabel={t("rosary.garden.nextMonth")}
        canNavigate={canGoNext && !isLoading}
        direction="right"
        onPress={onNext}
        testID="garden-next-month"
      />
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
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
  label: {
    ...theme.typography.heading2,
    color: theme.colors.text.white,
    flex: 1,
    fontFamily: theme.fontFamilies.devotional,
    minWidth: 0,
    paddingHorizontal: theme.spacing[2],
    textAlign: "center",
  },
  hovered: { backgroundColor: theme.colors.brand.primary, opacity: theme.opacity.hover },
  disabled: { opacity: theme.opacity.disabled },
  pressed: { opacity: theme.opacity.pressed, transform: [{ scale: 0.96 }] },
}));
