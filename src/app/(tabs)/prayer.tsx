import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";

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
      <View style={styles.invitationCard}>
        <View style={styles.crossBadge}>
          <Feather color="#FFFFFF" name="plus" size={22} />
        </View>
        <Text style={styles.invitationTitle}>Take a moment with God</Text>
        <Text style={styles.invitationText}>
          Breathe in grace. Breathe out what you are carrying.
        </Text>
        <View style={styles.startPrompt}>
          <Feather color="#FFFFFF" name="arrow-right" size={17} />
          <Text style={styles.startPromptText}>Begin a prayer</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Prayer prompts</Text>
      <View style={styles.promptList}>
        {prompts.map((prompt) => (
          <View key={prompt.title} style={styles.promptCard}>
            <View style={styles.promptIcon}>
              <Feather color="#6B4FA1" name={prompt.icon} size={19} />
            </View>
            <View style={styles.promptCopy}>
              <Text style={styles.promptTitle}>{prompt.title}</Text>
              <Text style={styles.promptDetail}>{prompt.detail}</Text>
            </View>
            <Feather color="#B0A9B5" name="chevron-right" size={20} />
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  invitationCard: {
    backgroundColor: "#7A5AA8",
    borderRadius: 24,
    overflow: "hidden",
    padding: 24,
  },
  crossBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.17)",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  invitationTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.45,
    marginTop: 22,
  },
  invitationText: {
    color: "#F2EBFB",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  startPrompt: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#A986D6",
    borderRadius: 18,
    flexDirection: "row",
    gap: 7,
    marginTop: 22,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  startPromptText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  sectionTitle: {
    color: "#36303B",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 13,
    marginTop: 30,
  },
  promptList: {
    gap: 10,
  },
  promptCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEE9F1",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    padding: 14,
  },
  promptIcon: {
    alignItems: "center",
    backgroundColor: "#F1ECF8",
    borderRadius: 17,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  promptCopy: {
    flex: 1,
    marginLeft: 13,
  },
  promptTitle: {
    color: "#39333F",
    fontSize: 15,
    fontWeight: "800",
  },
  promptDetail: {
    color: "#7A737F",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
});
