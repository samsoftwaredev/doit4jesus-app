import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";

import { Button, Card } from "@/components/ui";
import { ScreenShell } from "@/components/screen-shell";
import { theme } from "@/theme/tokens";

const members = ["A", "M", "J"];

export default function CommunityScreen() {
  return (
    <ScreenShell
      eyebrow="GROW TOGETHER"
      title="Community"
      subtitle="Encouragement is closer when we walk together."
    >
      <Card
        footer={
          <Button fullWidth leftIcon={<Feather color={theme.colors.text.white} name="message-circle" size={theme.sizes.iconSmall} />} onPress={() => undefined} variant="success">
            Join the conversation
          </Button>
        }
        headerRight={<Feather color={theme.colors.icon.active} name="users" size={theme.sizes.iconMedium} />}
        subtitle="A place to be known"
        title="You are not alone"
        variant="success"
      >
        <Text style={styles.featureText}>
          Share a prayer, celebrate a win, or simply be present with others.
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>Your circle</Text>
      <Card
        footer={
          <Button fullWidth onPress={() => undefined} variant="outline">
            View Grace Circle
          </Button>
        }
        headerRight={
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active today</Text>
          </View>
        }
        subtitle="12 members"
        title="Grace Circle"
      >
        <Text style={styles.nextLabel}>NEXT GATHERING</Text>
        <Text style={styles.nextEvent}>Tonight at 7:00 PM</Text>
        <Text style={styles.nextDetail}>A short devotional and time to pray together.</Text>
        <View style={styles.members}>
          {members.map((member, index) => (
            <View key={member} style={[styles.avatar, index === 0 && styles.firstAvatar]}>
              <Text style={styles.avatarText}>{member}</Text>
            </View>
          ))}
          <View style={[styles.avatar, styles.moreAvatar]}>
            <Text style={styles.moreAvatarText}>+9</Text>
          </View>
        </View>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  featureText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text.secondary,
  },
  sectionTitle: {
    ...theme.typography.heading3,
    marginBottom: theme.spacing[3],
    marginTop: theme.spacing[7],
  },
  activeBadge: {
    backgroundColor: theme.colors.badge.successBackground,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[0.5],
  },
  activeBadgeText: {
    ...theme.typography.labelSmall,
    color: theme.colors.badge.successText,
  },
  nextLabel: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.info,
  },
  nextEvent: {
    ...theme.typography.heading3,
    marginTop: theme.spacing[1],
  },
  nextDetail: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
  },
  members: {
    flexDirection: "row",
    gap: theme.spacing[1],
    marginTop: theme.spacing[4],
  },
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.badge.neutralBackground,
    borderRadius: theme.radii.pill,
    height: theme.sizes.iconLarge,
    justifyContent: "center",
    width: theme.sizes.iconLarge,
  },
  firstAvatar: {
    backgroundColor: theme.colors.brand.primaryDark,
  },
  moreAvatar: {
    backgroundColor: theme.colors.surface.tertiary,
  },
  avatarText: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.white,
  },
  moreAvatarText: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.secondary,
  },
});
