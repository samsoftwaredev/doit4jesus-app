import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";
import { HeaderActionGroup, ResponsiveImage } from "@/components/ui";
import { AvatarPanel } from "@/features/avatar";
import {
  ConfessionCard,
  MassTimesCard,
  TodaysRosaryCard,
  TodaysScriptureCard,
} from "@/features/daily-practice";
import { LevelsProgression } from "@/features/levels";
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
      <View style={styles.grid}>
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
      </View>
      <View style={styles.formationGrid}>
        <LevelsProgression style={styles.levelsProgression} />
        <AvatarPanel style={styles.avatarPanel} />
        <VirtuesPanel fullWidth={false} style={styles.virtuesPanel} />
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
});
