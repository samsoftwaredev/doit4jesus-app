import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { logDevelopmentError } from "@/lib/development-logger";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

interface PrayTodayButtonProps {
  onPress: () => void;
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function PrayTodayButton({ onPress }: PrayTodayButtonProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch((error) =>
      logDevelopmentError("playing prayer-button haptics", error),
    );
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityHint={t("rosary.garden.prayHint")}
        accessibilityLabel={t("rosary.garden.prayLabel")}
        accessibilityRole="button"
        onPress={handlePress}
        onPressIn={() => {
          if (!reduceMotion) scale.value = withTiming(0.98, { duration: 90 });
        }}
        onPressOut={() => {
          if (!reduceMotion) scale.value = withSpring(1);
        }}
        style={styles.pressable}
        testID="pray-today-button"
      >
        <LinearGradient
          colors={theme.colors.gradients.prayButton}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.button}
        >
          <View style={styles.rosaryIcon}>
            <Feather accessible={false} color={theme.colors.text.white} name="circle" size={theme.sizes.iconSmall} />
            <Feather accessible={false} color={theme.colors.text.white} name="plus" size={theme.sizes.iconXs} />
          </View>
          <Text style={styles.label}>{t("rosary.garden.prayToday")}</Text>
          <Feather
            accessible={false}
            color={theme.colors.text.white}
            name="chevron-right"
            size={theme.sizes.iconMedium}
          />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  pressable: { borderRadius: theme.radii.lg, ...theme.shadows.focus },
  button: {
    alignItems: "center",
    borderColor: "#75AAFF",
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: theme.sizes.buttonHeightLarge + theme.spacing[1],
    paddingHorizontal: theme.spacing[4],
  },
  rosaryIcon: { alignItems: "center", flexDirection: "row", minWidth: theme.sizes.iconLarge },
  label: {
    ...theme.typography.button,
    color: theme.colors.text.white,
    fontSize: theme.fontSizes.lg,
    letterSpacing: theme.letterSpacing.wider,
  },
}));
