import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

interface DailyMassHeaderProps {
  date: string;
  onCalendarPress?: () => void;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export function DailyMassHeader({
  date,
  onCalendarPress,
}: DailyMassHeaderProps) {
  return (
    <View accessibilityRole="header" style={styles.card}>
      <View accessible={false} style={styles.crossCircle}>
        <MaterialCommunityIcons
          color={theme.colors.gold.pale}
          name="cross"
          size={21}
        />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Daily Mass</Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>
      <Pressable
        accessibilityHint="Opens a date selector when one is available."
        accessibilityLabel="Select a Mass date"
        accessibilityRole="button"
        disabled={!onCalendarPress}
        onPress={onCalendarPress}
        style={({ pressed }) => [
          styles.calendarButton,
          pressed && onCalendarPress ? styles.pressed : null,
        ]}
      >
        <MaterialCommunityIcons
          color={theme.colors.gold.pale}
          name="calendar-month-outline"
          size={21}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarButton: {
    alignItems: "center",
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  card: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.navy,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    padding: theme.spacing[3],
  },
  copy: {
    flex: 1,
    marginHorizontal: theme.spacing[3],
  },
  crossCircle: {
    alignItems: "center",
    backgroundColor: "rgba(197, 142, 56, 0.1)",
    borderColor: theme.colors.gold.primary,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  date: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0.5],
  },
  pressed: {
    opacity: theme.opacity.muted,
  },
  title: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
  },
});
