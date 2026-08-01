import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "@/components/screen-shell";

export default function CommunityScreen() {
  return (
    <ScreenShell
      eyebrow="GROW TOGETHER"
      title="Community"
      subtitle="Encouragement is closer when we walk together."
    >
      <View style={styles.featureCard}>
        <View style={styles.featureIcon}>
          <Feather color="#23786B" name="users" size={22} />
        </View>
        <Text style={styles.featureTitle}>You are not alone.</Text>
        <Text style={styles.featureText}>
          Share a prayer, celebrate a win, or simply be present with others.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Your circle</Text>
      <View style={styles.circleCard}>
        <View style={styles.circleHeader}>
          <View style={styles.groupMark}>
            <Text style={styles.groupMarkText}>G</Text>
          </View>
          <View style={styles.circleCopy}>
            <Text style={styles.circleTitle}>Grace Circle</Text>
            <Text style={styles.circleMeta}>12 members · Active today</Text>
          </View>
          <Feather color="#9A929F" name="more-horizontal" size={21} />
        </View>
        <View style={styles.divider} />
        <Text style={styles.nextLabel}>NEXT GATHERING</Text>
        <Text style={styles.nextEvent}>Tonight at 7:00 PM</Text>
        <Text style={styles.nextDetail}>A short devotional and time to pray together.</Text>
        <View style={styles.avatars}>
          <View style={[styles.avatar, styles.avatarOne]}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View style={[styles.avatar, styles.avatarTwo]}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={[styles.avatar, styles.avatarThree]}>
            <Text style={styles.avatarText}>J</Text>
          </View>
          <View style={[styles.avatar, styles.avatarMore]}>
            <Text style={styles.avatarMoreText}>+9</Text>
          </View>
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  featureCard: {
    backgroundColor: "#DDF3EC",
    borderRadius: 24,
    padding: 24,
  },
  featureIcon: {
    alignItems: "center",
    backgroundColor: "#F8FFFC",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  featureTitle: {
    color: "#225449",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 21,
  },
  featureText: {
    color: "#4E766D",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  sectionTitle: {
    color: "#36303B",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 13,
    marginTop: 30,
  },
  circleCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E9ECE9",
    borderRadius: 22,
    borderWidth: 1,
    padding: 19,
  },
  circleHeader: {
    alignItems: "center",
    flexDirection: "row",
  },
  groupMark: {
    alignItems: "center",
    backgroundColor: "#F3E8D5",
    borderRadius: 19,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  groupMarkText: {
    color: "#986A31",
    fontSize: 17,
    fontWeight: "800",
  },
  circleCopy: {
    flex: 1,
    marginLeft: 12,
  },
  circleTitle: {
    color: "#37313C",
    fontSize: 16,
    fontWeight: "800",
  },
  circleMeta: {
    color: "#7A737F",
    fontSize: 13,
    marginTop: 4,
  },
  divider: {
    backgroundColor: "#EEEAEF",
    height: 1,
    marginVertical: 18,
  },
  nextLabel: {
    color: "#8C6B4A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  nextEvent: {
    color: "#38313D",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 5,
  },
  nextDetail: {
    color: "#7A737F",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  avatars: {
    flexDirection: "row",
    marginTop: 18,
  },
  avatar: {
    alignItems: "center",
    borderColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 2,
    height: 34,
    justifyContent: "center",
    marginRight: -6,
    width: 34,
  },
  avatarOne: { backgroundColor: "#CEB2A2" },
  avatarTwo: { backgroundColor: "#9DBFB6" },
  avatarThree: { backgroundColor: "#B6A7D5" },
  avatarMore: { backgroundColor: "#EFECE9", marginLeft: 2 },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  avatarMoreText: {
    color: "#69636D",
    fontSize: 11,
    fontWeight: "800",
  },
});
