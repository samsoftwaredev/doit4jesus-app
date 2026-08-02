import Feather from "@expo/vector-icons/Feather";
import { Image, StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { Button, Card } from "@/components/ui";
import { VirtuesPanel } from "@/features/virtues";
import { theme } from "@/theme/tokens";

const homeBackgroundImageAspectRatio = 1536 / 1024;

export default function HomeScreen() {
  return (
    <ScreenShell
      eyebrow="TODAY"
      title="Welcome home"
      subtitle="Build a faithful rhythm, one moment at a time."
      background={<HomeBackground />}
      headerAccessory={
        <View style={styles.streak}>
          <Feather
            color={theme.colors.icon.active}
            name="sun"
            size={theme.sizes.iconSmall}
          />
          <Text style={styles.streakText}>7 day streak</Text>
        </View>
      }
    >
      <Card
        footer={
          <Button fullWidth onPress={() => undefined} variant="outline">
            Read passage
          </Button>
        }
        headerRight={
          <Feather
            color={theme.colors.icon.active}
            name="bookmark"
            size={theme.sizes.iconSmall}
          />
        }
        subtitle="Psalm 23:1"
        title="Today's verse"
        variant="info"
      >
        <Text style={styles.verse}>
          “The Lord is my shepherd; I shall not want.”
        </Text>
      </Card>
      <VirtuesPanel />
      <Text style={styles.sectionTitle}>Your rhythm</Text>
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
      <Image
        resizeMode="contain"
        source={require("../../assets/backgrounds/cathedral.png")}
        style={styles.cathedralBackground}
      />
      <View style={styles.backgroundGap} />
      <Image
        resizeMode="contain"
        source={require("../../assets/backgrounds/hell.png")}
        style={styles.hellBackground}
      />
      <View style={styles.backgroundOverlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.background.deep,
    flex: 1,
    overflow: "hidden",
  },
  cathedralBackground: {
    aspectRatio: homeBackgroundImageAspectRatio,
    width: "100%",
  },
  backgroundGap: {
    flex: 1,
    minHeight: theme.spacing[10],
  },
  hellBackground: {
    aspectRatio: homeBackgroundImageAspectRatio,
    width: "100%",
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFill,
    // backgroundColor: theme.colors.background.overlay,
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
