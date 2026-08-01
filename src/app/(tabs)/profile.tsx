import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";

const profileItems = [
  { icon: "book-open", label: "Saved verses" },
  { icon: "bell", label: "Prayer reminders" },
  { icon: "settings", label: "Settings" },
] as const;

export default function ProfileScreen() {
  return (
    <ScreenShell
      eyebrow="YOUR JOURNEY"
      title="Profile"
      subtitle="Keep showing up. Small steps become a faithful life."
    >
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>Y</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>Your faith journey</Text>
          <Text style={styles.profileCaption}>Growing one day at a time</Text>
        </View>
        <Feather color="#928A98" name="edit-2" size={18} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>day streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>prayers shared</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.listCard}>
        {profileItems.map((item, index) => (
          <View
            key={item.label}
            style={[styles.listItem, index < profileItems.length - 1 && styles.listDivider]}
          >
            <View style={styles.listIcon}>
              <Feather color="#6B4FA1" name={item.icon} size={18} />
            </View>
            <Text style={styles.listLabel}>{item.label}</Text>
            <Feather color="#AAA3AD" name="chevron-right" size={20} />
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEE9F1",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    padding: 18,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#DCCEF1",
    borderRadius: 27,
    height: 54,
    justifyContent: "center",
    width: 54,
  },
  avatarInitial: {
    color: "#62448F",
    fontSize: 22,
    fontWeight: "800",
  },
  profileCopy: {
    flex: 1,
    marginLeft: 13,
  },
  profileName: {
    color: "#38313E",
    fontSize: 16,
    fontWeight: "800",
  },
  profileCaption: {
    color: "#7B7480",
    fontSize: 13,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 13,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: "#F0EAF7",
    borderRadius: 18,
    flex: 1,
    paddingVertical: 17,
  },
  statValue: {
    color: "#694C97",
    fontSize: 24,
    fontWeight: "800",
  },
  statLabel: {
    color: "#766B80",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },
  sectionTitle: {
    color: "#36303B",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 13,
    marginTop: 30,
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EEE9F1",
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  listItem: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  listDivider: {
    borderBottomColor: "#F0EDF1",
    borderBottomWidth: 1,
  },
  listIcon: {
    alignItems: "center",
    backgroundColor: "#F0EAF7",
    borderRadius: 15,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  listLabel: {
    color: "#433C49",
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 12,
  },
});
