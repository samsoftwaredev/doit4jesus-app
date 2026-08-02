import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { Card } from "@/components/ui";
import { theme } from "@/theme/tokens";

import { VirtueProgressBar } from "./VirtueProgressBar";
import { styles } from "./VirtuesPanel.styles";
import type { VirtueScore, VirtuesPanelProps } from "./virtues.types";

const defaultVirtues = [
  { id: "faith", label: "Faith", value: 85, tone: "faith", icon: require("../../assets/virtues/cross.png") },
  { id: "discipline", label: "Discipline", value: 90, tone: "discipline", icon: require("../../assets/virtues/candel.png") },
  { id: "courage", label: "Courage", value: 75, tone: "courage", icon: require("../../assets/virtues/sword.png") },
  { id: "wisdom", label: "Wisdom", value: 80, tone: "wisdom", icon: require("../../assets/virtues/bible.png") },
  { id: "charity", label: "Charity", value: 88, tone: "charity", icon: require("../../assets/virtues/heart.png") },
  { id: "purity", label: "Purity", value: 92, tone: "purity", icon: require("../../assets/virtues/peace.png") },
] as const satisfies ReadonlyArray<VirtueScore>;

export function VirtuesPanel({
  virtues = defaultVirtues,
  maxValue = 100,
  style,
  testID,
}: VirtuesPanelProps) {
  return (
    <Card accessibilityLabel="Virtues" fullWidth padding="lg" style={style} testID={testID} variant="elevated">
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Virtues
        </Text>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <MaterialCommunityIcons color={theme.colors.brand.primaryLight} name="star-four-points" size={theme.sizes.iconXs} />
          <View style={styles.dividerLine} />
        </View>
      </View>

      <Text style={styles.introduction}>
        A living portrait of the virtues formed through prayer, sacrifice, charity, and faithful living.
      </Text>

      <View style={styles.virtueList}>
        {virtues.map((virtue) => (
          <VirtueProgressBar key={virtue.id} {...virtue} maxValue={maxValue} />
        ))}
      </View>

      <View style={styles.encouragement}>
        <MaterialCommunityIcons
          color={theme.colors.icon.active}
          name="meditation"
          size={theme.sizes.iconMedium}
          style={styles.encouragementIcon}
        />
        <Text style={styles.encouragementText}>
          Every faithful act strengthens the soul. Continue in grace, one day at a time.
        </Text>
      </View>
    </Card>
  );
}
