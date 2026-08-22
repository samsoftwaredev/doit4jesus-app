import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { HeaderActionGroup, ResponsiveImage } from "@/components/ui";
import { ArmorOfGodScreen } from "@/features/armor-of-god";
import { LevelsProgression } from "@/features/levels";
import { DailyLiturgyDashboard } from "@/features/liturgy/screens";
import { theme } from "@/theme/tokens";

const battleImage = require("../../assets/tabs/battle.png");

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenShell
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
      {/* <View style={styles.grid}>
        <TodaysScriptureCard
          onPress={() => router.push("/prayer")}
          style={styles.dailyPracticeCard}
        />
        <TodaysRosaryCard
          onPress={() => router.push("/prayer")}
          style={styles.dailyPracticeCard}
        />
        <MassTimesCard
          onPress={() => router.push("/community")}
          style={styles.dailyPracticeCard}
        />
        <ConfessionCard
          onPress={() => router.push("/community")}
          style={styles.dailyPracticeCard}
        />
      </View> */}
      <DailyLiturgyDashboard />
      <View style={styles.formationGrid}>
        <LevelsProgression style={styles.levelsProgression} />
        <ArmorOfGodScreen />
        {/* <VirtuesPanel fullWidth={false} style={styles.virtuesPanel} /> */}
      </View>
      {/* <Card
        fullWidth
        header={
          <View style={styles.battleCardHeader}>
            <RNImage source={battleImage} style={styles.battleCardImage} />
            <View style={styles.battleCardTitleContainer}>
              <Text style={styles.battleCardTitle}>The Arena</Text>
              <Text style={styles.battleCardSubtitle}>
                Fight the demons. Grow in virtue.
              </Text>
            </View>
            <RNImage
              source={battleImage}
              style={[styles.battleCardImage, styles.battleCardImageFlipped]}
            />
          </View>
        }
        variant="danger"
        style={styles.battleCard}
      >
        <Button
          fullWidth
          leftIcon={
            <MaterialCommunityIcons
              color={theme.colors.text.white}
              name="sword-cross"
              size={theme.sizes.iconMedium}
            />
          }
          rightIcon={
            <MaterialCommunityIcons
              color={theme.colors.text.white}
              name="chevron-right"
              size={theme.sizes.iconMedium}
            />
          }
          size="lg"
          textStyle={styles.battleButtonLabel}
          variant="danger"
          onPress={() => router.push("/battle" as Href)}
        >
          Go to Battle
        </Button>
      </Card> */}
    </ScreenShell>
  );
}

function HomeBackground() {
  return (
    <View style={styles.background}>
      <View style={styles.imageWrapper}>
        <ResponsiveImage
          accessible={false}
          contentFit="contain"
          desktopSource={require("../../assets/backgrounds/cathedralDesktop.png")}
          mobileSource={require("../../assets/backgrounds/cathedraMobile.png")}
          preserveAspectRatio
          style={styles.backgroundImage}
          tabletSource={require("../../assets/backgrounds/cathedralTablet.png")}
        />
        <LinearGradient
          colors={["transparent", theme.colors.background.deep]}
          end={{ x: 0, y: 1 }}
          pointerEvents="none"
          start={{ x: 0, y: 0 }}
          style={styles.imageBottomGradient}
        />
      </View>
      <View style={styles.backgroundGap} />
      <View style={styles.imageWrapper}>
        <ResponsiveImage
          accessible={false}
          contentFit="contain"
          desktopSource={require("../../assets/backgrounds/hellDesktop.png")}
          mobileSource={require("../../assets/backgrounds/hellMobile.png")}
          preserveAspectRatio
          style={styles.backgroundImage}
          tabletSource={require("../../assets/backgrounds/hellTablet.png")}
        />
        <LinearGradient
          colors={["transparent", theme.colors.background.deep]}
          end={{ x: 0, y: 1 }}
          pointerEvents="none"
          start={{ x: 0, y: 0 }}
          style={styles.imageBottomGradient}
        />
      </View>
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
  imageWrapper: {
    position: "relative",
  },
  imageBottomGradient: {
    bottom: 0,
    height: theme.spacing[20],
    left: 0,
    position: "absolute",
    right: 0,
  },
  formationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  levelsProgression: {
    marginBottom: theme.spacing[4],
  },
  avatarPanel: {
    flexBasis: theme.sizes.cardMinWidth,
    flexGrow: 1,
  },
  virtuesPanel: {
    flexBasis: theme.sizes.cardMinWidth,
    flexGrow: 2,
  },
  grid: {
    marginTop: 400,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[4],
    marginBottom: 20,
  },
  dailyPracticeCard: {
    flexBasis: "47%",
    flexGrow: 1,
  },
  battleCard: {
    marginBottom: theme.spacing[4],
    marginTop: theme.spacing[4],
  },
  battleCardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[3],
  },
  battleCardImage: {
    height: theme.sizes.iconXL,
    width: theme.sizes.iconXL,
  },
  battleCardImageFlipped: {
    transform: [{ scaleX: -1 }],
  },
  battleCardTitleContainer: {
    alignItems: "center",
    flex: 1,
  },
  battleCardTitle: {
    ...theme.typography.heading2,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  battleCardSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[0.5],
    textAlign: "center",
  },
  battleButtonLabel: {
    flex: 1,
  },
});
