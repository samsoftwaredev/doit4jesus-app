import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card, DayCalendarTile } from "@/components/ui";
import { theme } from "@/theme/tokens";

const prompts = [
  {
    icon: "heart",
    title: "Give thanks",
    detail: "Name three gifts from today.",
  },
  {
    icon: "compass",
    title: "Ask for guidance",
    detail: "Bring the next step before God.",
  },
  {
    icon: "users",
    title: "Pray for someone",
    detail: "Lift up a person on your heart.",
  },
] as const;

export default function PrayerScreen() {
  return (
    <ScreenShell
      eyebrow="YOUR QUIET PLACE"
      title="Prayer"
      subtitle="There is no perfect way to begin. Just come as you are."
    >
      <DayCalendarTile
        day={2}
        state="completed"
        flowerVariant="blueFlower"
        style={{}}
        accessibilityLabel="Day 2, rosary not yet completed"
        testID="day-calendar-tile-2"
      />
      <Card
        footer={
          <Button
            fullWidth
            leftIcon={
              <Feather
                color={theme.colors.text.white}
                name="play"
                size={theme.sizes.iconSmall}
              />
            }
            onPress={() => undefined}
            variant="success"
          >
            Begin a prayer
          </Button>
        }
        headerRight={
          <Feather
            color={theme.colors.icon.active}
            name="heart"
            size={theme.sizes.iconMedium}
          />
        }
        subtitle="A moment to be still"
        title="Take a moment with God"
        variant="success"
      >
        <Text style={styles.invitationText}>
          Breathe in grace. Breathe out what you are carrying.
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>Prayer prompts</Text>
      <View style={styles.promptList}>
        {prompts.map((prompt) => (
          <Card key={prompt.title} padding="sm" variant="outlined">
            <View style={styles.promptRow}>
              <View style={styles.promptIcon}>
                <Feather
                  color={theme.colors.icon.active}
                  name={prompt.icon}
                  size={theme.sizes.iconSmall}
                />
              </View>
              <View style={styles.promptCopy}>
                <Text style={styles.promptTitle}>{prompt.title}</Text>
                <Text style={styles.promptDetail}>{prompt.detail}</Text>
              </View>
              <Feather
                color={theme.colors.icon.muted}
                name="chevron-right"
                size={theme.sizes.iconMedium}
              />
            </View>
          </Card>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  invitationText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text.secondary,
  },
  sectionTitle: {
    ...theme.typography.heading3,
    marginBottom: theme.spacing[3],
    marginTop: theme.spacing[7],
  },
  promptList: {
    gap: theme.spacing[3],
  },
  promptRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  promptIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.sm,
    height: theme.sizes.iconHero,
    justifyContent: "center",
    width: theme.sizes.iconHero,
  },
  promptCopy: {
    flex: 1,
    marginHorizontal: theme.spacing[3],
    minWidth: theme.spacing[0],
  },
  promptTitle: {
    ...theme.typography.bodyMedium,
  },
  promptDetail: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0.5],
  },
});
