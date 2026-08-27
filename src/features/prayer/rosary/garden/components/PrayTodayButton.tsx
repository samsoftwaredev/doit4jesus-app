import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { theme } from "@/theme/tokens";

interface PrayTodayButtonProps {
  onPress: () => void;
}

export function PrayTodayButton({ onPress }: PrayTodayButtonProps) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityHint="Opens today’s Rosary prayer."
        accessibilityLabel="Pray today's rosary"
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
          colors={["#276EEA", "#154FAE"]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.button}
        >
          <View style={styles.rosaryIcon}>
            <Feather accessible={false} color={theme.colors.text.white} name="circle" size={theme.sizes.iconSmall} />
            <Feather accessible={false} color={theme.colors.text.white} name="plus" size={theme.sizes.iconXs} />
          </View>
          <Text style={styles.label}>PRAY TODAY</Text>
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

const styles = StyleSheet.create({
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
});
