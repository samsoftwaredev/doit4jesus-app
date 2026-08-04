import { Image } from "expo-image";
import { Text, View } from "react-native";

import { Card } from "@/components/ui";
import type {
  DemonAttack,
  DemonBattleDetails,
  DemonDefense,
} from "@/features/demons";
import { getDemonArtwork } from "@/features/demons";

import { styles } from "./BattleDemonDetails.styles";

interface BattleDemonDetailsProps {
  details: DemonBattleDetails;
}

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function AttackListItem({ attack }: { attack: DemonAttack }) {
  return (
    <View style={styles.listItem}>
      <Text style={styles.itemTitle}>{attack.name}</Text>
      <Text style={styles.itemDescription}>{attack.description}</Text>
      <Text style={styles.itemMeta}>
        {`${formatLabel(attack.targetVirtueCode)} −${attack.virtueDecrease}`}
      </Text>
    </View>
  );
}

function DefenseListItem({ defense }: { defense: DemonDefense }) {
  return (
    <View style={styles.listItem}>
      <Text style={styles.itemTitle}>{defense.name}</Text>
      <Text style={styles.itemDescription}>{defense.challenge}</Text>
      <Text style={styles.itemMeta}>
        {`${formatLabel(defense.rewardVirtueCode)} +${defense.virtueIncrease} · ${defense.demonDamage} damage`}
      </Text>
    </View>
  );
}

export function BattleDemonDetails({ details }: BattleDemonDetailsProps) {
  const { demon, attacks, defenses, defeatReward } = details;
  const artwork = getDemonArtwork(demon);

  return (
    <Card fullWidth subtitle={demon.title} title={demon.name} variant="danger">
      {artwork ? (
        <View style={styles.artworkFrame}>
          <Image
            accessible={false}
            contentFit="contain"
            source={artwork}
            style={styles.artwork}
          />
        </View>
      ) : null}
      <View style={styles.metadata}>
        <View style={styles.categoryBadge}>
          <Text style={styles.badgeText}>{formatLabel(demon.category)}</Text>
        </View>
        <View style={[styles.categoryBadge, styles.healthBadge]}>
          <Text style={styles.badgeText}>{`Max HP ${demon.maxHp}`}</Text>
        </View>
      </View>

      <Text style={styles.description}>{demon.description}</Text>
      <Text style={styles.personality}>{demon.sillyPersonality}</Text>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Attacks
        </Text>
        {attacks.map((attack) => (
          <AttackListItem attack={attack} key={attack.code} />
        ))}
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Defenses
        </Text>
        {defenses.map((defense) => (
          <DefenseListItem defense={defense} key={defense.code} />
        ))}
      </View>

      <View style={styles.reward}>
        <Text accessibilityRole="header" style={styles.rewardTitle}>
          Defeat reward
        </Text>
        <Text style={styles.rewardText}>
          {`${formatLabel(defeatReward.virtueCode)} +${defeatReward.virtueIncrease}`}
        </Text>
        <Text style={styles.rewardText}>{`XP +${defeatReward.xpReward}`}</Text>
      </View>

      {demon.safetyNote ? (
        <Text style={styles.safetyNote}>{demon.safetyNote}</Text>
      ) : null}
    </Card>
  );
}
