import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";

import { Button, Card } from "@/components/ui";
import { ScreenShell } from "@/components/screen-shell";
import { theme } from "@/theme/tokens";

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
      <Card
        headerRight={<Feather color={theme.colors.icon.secondary} name="edit-2" size={theme.sizes.iconSmall} />}
        title="Your faith journey"
        variant="elevated"
      >
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>Y</Text>
          </View>
          <Text style={styles.profileCaption}>Growing one day at a time</Text>
        </View>
      </Card>

      <View style={styles.statsGrid}>
        <Card padding="sm" title="Day streak" variant="success">
          <Text style={styles.statValue}>7</Text>
        </Card>
        <Card padding="sm" title="Prayers shared" variant="info">
          <Text style={styles.statValue}>12</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <Card footer={<Button fullWidth onPress={() => undefined} variant="ghost">Manage profile</Button>} padding="none" title="Preferences">
        <View style={styles.list}>
          {profileItems.map((item, index) => (
            <View
              key={item.label}
              style={[styles.listItem, index < profileItems.length - 1 && styles.listDivider]}
            >
              <View style={styles.listIcon}>
                <Feather color={theme.colors.icon.secondary} name={item.icon} size={theme.sizes.iconSmall} />
              </View>
              <Text style={styles.listLabel}>{item.label}</Text>
              <Feather color={theme.colors.icon.muted} name="chevron-right" size={theme.sizes.iconMedium} />
            </View>
          ))}
        </View>
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.teal,
    borderRadius: theme.radii.pill,
    height: theme.sizes.iconHero,
    justifyContent: "center",
    width: theme.sizes.iconHero,
  },
  avatarInitial: {
    ...theme.typography.heading3,
    color: theme.colors.text.white,
  },
  profileCaption: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    marginLeft: theme.spacing[3],
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[4],
    marginTop: theme.spacing[4],
  },
  statValue: {
    ...theme.typography.metric,
  },
  sectionTitle: {
    ...theme.typography.heading3,
    marginBottom: theme.spacing[3],
    marginTop: theme.spacing[7],
  },
  list: {
    paddingHorizontal: theme.spacing[4],
  },
  listItem: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: theme.spacing[3],
  },
  listDivider: {
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
  },
  listIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.sm,
    height: theme.sizes.iconMedium + theme.spacing[2],
    justifyContent: "center",
    width: theme.sizes.iconMedium + theme.spacing[2],
  },
  listLabel: {
    ...theme.typography.bodyMedium,
    flex: 1,
    marginHorizontal: theme.spacing[3],
  },
});
