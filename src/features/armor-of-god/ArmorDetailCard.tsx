import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { Button, Card } from "@/components/ui";
import { useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { ArmorStatusBadge } from "./ArmorStatusBadge";
import { ScriptureReference } from "./ScriptureReference";
import { styles as styleSheet } from "./ArmorDetailCard.styles";
import type { ArmorItem } from "./armorOfGod.types";
import { getArmorActionLabel } from "./armorOfGod.utils";

interface ArmorDetailCardProps {
  item: ArmorItem;
  onAction: () => void;
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function ArmorDetailCard({ item, onAction }: ArmorDetailCardProps) {
  const styles = useThemedStyles(styleSheet);
  const isActionDisabled = item.status === "equipped" || item.status === "locked";

  return (
    <Card
      footer={
        <Button
          disabled={isActionDisabled}
          fullWidth
          onPress={onAction}
          variant={item.status === "available" ? "warning" : "secondary"}
        >
          {getArmorActionLabel(item.status, item.shortName)}
        </Button>
      }
      fullWidth
      header={
        <View style={styles.header}>
          <View style={styles.iconFrame}>
            <MaterialCommunityIcons
              accessible={false}
              color={theme.colors.gold.pale}
              name={item.icon}
              size={theme.sizes.iconHero}
            />
          </View>
          <View style={styles.headerCopy}>
            <Text accessibilityRole="header" style={styles.title}>
              {`${item.order}. ${item.name}`}
            </Text>
            <ArmorStatusBadge status={item.status} />
          </View>
        </View>
      }
      variant="elevated"
    >
      <Text style={styles.description}>{item.description}</Text>
      <ScriptureReference reference={item.scriptureReference} />
      {item.challenge ? (
        <View style={styles.challenge}>
          <Text style={styles.challengeLabel}>Today&apos;s challenge</Text>
          <Text style={styles.challengeText}>{item.challenge}</Text>
          {item.xpReward ? <Text style={styles.xp}>{`+${item.xpReward} XP`}</Text> : null}
        </View>
      ) : null}
    </Card>
  );
}
