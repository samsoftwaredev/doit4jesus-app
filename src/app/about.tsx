import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { theme } from "@/theme/tokens";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <ScreenShell
      subtitle="A companion for daily faithfulness."
      title="About Do It for Jesus"
      headerAccessory={
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather
            accessible={false}
            color={theme.colors.gold.pale}
            name="chevron-left"
            size={theme.sizes.iconMedium}
          />
        </Pressable>
      }
    >
      <View style={styles.card}>
        <Text style={styles.copy}>
          Do It for Jesus helps Catholics build consistent spiritual habits, grow in virtue, and encourage one another
          on their journey toward Christ.
        </Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  card: {
    backgroundColor: theme.colors.surface.navy,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    padding: theme.spacing[5],
  },
  copy: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: theme.lineHeights.lg,
  },
});
