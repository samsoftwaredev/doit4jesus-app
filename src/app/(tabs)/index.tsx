import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import {
  Button,
  Card,
  HeaderActionGroup,
  ResponsiveImage,
} from "@/components/ui";
import { VirtuesPanel } from "@/features/virtues";
import { theme } from "@/theme/tokens";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenShell
      eyebrow="TODAY"
      title="Welcome home"
      subtitle="Build a faithful rhythm, one moment at a time."
      background={<HomeBackground />}
      headerAccessory={
        <HeaderActionGroup
          onMessagesPress={() => router.push("/messages")}
          onNotificationsPress={() => router.push("/notifications")}
          onSettingsPress={() => router.push("/settings")}
        />
      }
    >
      <VirtuesPanel />
      <View style={styles.grid}>
        <Card
          footer={
            <Button
              fullWidth
              leftIcon={
                <Feather
                  color={theme.colors.text.white}
                  name="heart"
                  size={theme.sizes.iconSmall}
                />
              }
              onPress={() => undefined}
              variant="success"
            >
              Start prayer
            </Button>
          }
          title="Prayer time"
        >
          <View style={styles.cardIcon}>
            <Feather
              color={theme.colors.icon.active}
              name="heart"
              size={theme.sizes.iconMedium}
            />
          </View>
          <Text style={styles.cardDescription}>
            Make room for a few quiet minutes with God.
          </Text>
        </Card>

        <Card
          footer={
            <Button fullWidth onPress={() => undefined} variant="secondary">
              See community
            </Button>
          }
          title="Together"
        >
          <View style={styles.cardIcon}>
            <Feather
              color={theme.colors.icon.secondary}
              name="users"
              size={theme.sizes.iconMedium}
            />
          </View>
          <Text style={styles.cardDescription}>
            Find encouragement from people walking beside you.
          </Text>
        </Card>
      </View>
    </ScreenShell>
  );
}

function HomeBackground() {
  return (
    <View style={styles.background}>
      <ResponsiveImage
        accessible={false}
        contentFit="contain"
        desktopSource={require("../../assets/backgrounds/cathedralDesktop.png")}
        mobileSource={require("../../assets/backgrounds/cathedraMobile.png")}
        preserveAspectRatio
        style={styles.backgroundImage}
        tabletSource={require("../../assets/backgrounds/cathedralTablet.png")}
      />
      <View style={styles.backgroundGap} />
      <ResponsiveImage
        accessible={false}
        contentFit="contain"
        desktopSource={require("../../assets/backgrounds/hellDesktop.png")}
        mobileSource={require("../../assets/backgrounds/hellMobile.png")}
        preserveAspectRatio
        style={styles.backgroundImage}
        tabletSource={require("../../assets/backgrounds/hellTablet.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.background.deep,
    flex: 1,
    overflow: "hidden",
  },
  backgroundGap: {
    flex: 1,
    minHeight: theme.spacing[10],
  },
  backgroundImage: {
    width: "100%",
  },
  streak: {
    alignItems: "center",
    backgroundColor: theme.colors.badge.successBackground,
    borderRadius: theme.radii.pill,
    flexDirection: "row",
    gap: theme.spacing[1],
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
  },
  streakText: {
    ...theme.typography.labelSmall,
    color: theme.colors.badge.successText,
  },
  verse: {
    ...theme.typography.heading2,
    color: theme.colors.text.primary,
  },
  sectionTitle: {
    ...theme.typography.heading3,
    marginBottom: theme.spacing[3],
    marginTop: theme.spacing[7],
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[4],
  },
  cardIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.md,
    height: theme.sizes.iconHero,
    justifyContent: "center",
    width: theme.sizes.iconHero,
  },
  cardDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[3],
  },
});
