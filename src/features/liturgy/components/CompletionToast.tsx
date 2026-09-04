import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

interface CompletionToastProps {
  count: number;
  currentLevel?: number;
  points?: number;
  totalXp?: number;
  visible: boolean;
  onDismiss: () => void;
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function CompletionToast({ count, currentLevel, points, totalXp, visible, onDismiss }: CompletionToastProps) {
  const styles = useThemedStyles(styleSheet);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { duration: 220, toValue: visible ? 1 : 0, useNativeDriver: true }),
      Animated.timing(translateY, { duration: 220, toValue: visible ? 0 : -8, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY, visible]);

  if (!visible) return null;

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.toast, { opacity, transform: [{ translateY }] }]}
    >
      <View accessible={false} style={styles.checkCircle}>
        <MaterialCommunityIcons color={theme.colors.text.white} name="check" size={18} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>All {count} scriptures completed</Text>
        <Text style={styles.message}>Well done — keep the Word in your heart.</Text>
        {typeof points === "number" ? <Text style={styles.points}>Points +{points}</Text> : null}
        {typeof totalXp === "number" ? (
          <Text style={styles.total}>
            Total XP {totalXp}
            {currentLevel ? ` · Level ${currentLevel}` : ""}
          </Text>
        ) : null}
      </View>
      <Pressable
        accessibilityLabel="Dismiss completion message"
        accessibilityRole="button"
        hitSlop={8}
        onPress={onDismiss}
        style={styles.dismiss}
      >
        <MaterialCommunityIcons color={theme.colors.text.secondary} name="close" size={20} />
      </Pressable>
    </Animated.View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  checkCircle: {
    alignItems: "center",
    backgroundColor: theme.colors.semantic.success,
    borderRadius: theme.radii.pill,
    height: 32,
    justifyContent: "center",
    marginRight: theme.spacing[2.5],
    width: 32,
  },
  copy: { flex: 1 },
  dismiss: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    marginLeft: theme.spacing[2],
    width: 36,
  },
  message: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[0.5],
  },
  points: {
    ...theme.typography.label,
    color: theme.colors.text.success,
    marginTop: theme.spacing[1.5],
  },
  toast: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.semantic.successSurface,
    borderColor: theme.colors.semantic.successBorder,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
  },
  title: {
    ...theme.typography.label,
    color: theme.colors.text.primary,
  },
  total: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0.5],
  },
}));
