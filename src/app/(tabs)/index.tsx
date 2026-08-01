import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";

export default function HomeScreen() {
  return (
    <ScreenShell
      eyebrow="A NEW DAY"
      title="Welcome home"
      subtitle="A quiet space to pause, pray, and grow in faith."
      headerAccessory={
        <View style={styles.streak}>
          <Feather color="#8B5C22" name="sun" size={16} />
          <Text style={styles.streakText}>7</Text>
        </View>
      }
    >
      <View style={styles.verseCard}>
        <View style={styles.verseTopRow}>
          <Text style={styles.verseLabel}>TODAY&apos;S VERSE</Text>
          <Feather color="#F8EEDC" name="bookmark" size={18} />
        </View>
        <Text style={styles.verseText}>
          “The Lord is my shepherd; I shall not want.”
        </Text>
        <Text style={styles.reference}>Psalm 23:1</Text>
      </View>

      <Text style={styles.sectionTitle}>Your rhythm</Text>
      <View style={styles.rhythmRow}>
        <View style={[styles.rhythmCard, styles.prayerCard]}>
          <View style={[styles.iconCircle, styles.prayerIcon]}>
            <Feather color="#7B57AC" name="heart" size={18} />
          </View>
          <Text style={styles.cardTitle}>Prayer time</Text>
          <Text style={styles.cardCaption}>Make space for five quiet minutes.</Text>
        </View>
        <View style={[styles.rhythmCard, styles.communityCard]}>
          <View style={[styles.iconCircle, styles.communityIcon]}>
            <Feather color="#28796D" name="users" size={18} />
          </View>
          <Text style={styles.cardTitle}>Together</Text>
          <Text style={styles.cardCaption}>See what your community is sharing.</Text>
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  streak: {
    alignItems: "center",
    backgroundColor: "#FFF1D8",
    borderRadius: 18,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  streakText: {
    color: "#8B5C22",
    fontSize: 13,
    fontWeight: "800",
  },
  verseCard: {
    backgroundColor: "#64468F",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#4B2C75",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },
  verseTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  verseLabel: {
    color: "#E6D7FB",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  verseText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.45,
    lineHeight: 33,
    marginTop: 26,
  },
  reference: {
    color: "#E6D7FB",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 18,
  },
  sectionTitle: {
    color: "#36303B",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 13,
    marginTop: 30,
  },
  rhythmRow: {
    flexDirection: "row",
    gap: 12,
  },
  rhythmCard: {
    borderRadius: 20,
    flex: 1,
    minHeight: 172,
    padding: 17,
  },
  prayerCard: {
    backgroundColor: "#F0EAFA",
  },
  communityCard: {
    backgroundColor: "#E3F3EE",
  },
  iconCircle: {
    alignItems: "center",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  prayerIcon: {
    backgroundColor: "#FFF9FF",
  },
  communityIcon: {
    backgroundColor: "#F8FFFC",
  },
  cardTitle: {
    color: "#37303F",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 17,
  },
  cardCaption: {
    color: "#736D78",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
});
