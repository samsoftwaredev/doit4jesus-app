import { Text, View } from "react-native";

import { Card } from "@/components/ui";

import { styles } from "./DemonCatalogItemCard.styles";
import type { DemonCatalogItem } from "./demons.types";

interface DemonCatalogItemCardProps {
  demon: DemonCatalogItem;
}

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export function DemonCatalogItemCard({ demon }: DemonCatalogItemCardProps) {
  return (
    <Card subtitle={demon.title} title={demon.name} variant="danger">
      <View style={styles.metadata}>
        <View style={styles.metadataBadge}>
          <Text style={styles.badgeText}>{formatLabel(demon.category)}</Text>
        </View>
        <View style={[styles.metadataBadge, styles.hpBadge]}>
          <Text style={styles.badgeText}>{`Max HP ${demon.maxHp}`}</Text>
        </View>
      </View>

      <Text style={styles.description}>{demon.description}</Text>

      <View style={styles.affinitySection}>
        <Text style={styles.affinityHeading}>Virtue affinities</Text>
        <View style={styles.affinityList}>
          {demon.virtueAffinities.map((affinity) => {
            const isPrimary = affinity.affinityType.toLowerCase() === "primary";

            return (
              <View
                key={`${demon.id}-${affinity.virtueCode}-${affinity.affinityType}`}
                style={[styles.affinityBadge, isPrimary && styles.primaryAffinity]}
              >
                <Text style={[styles.affinityText, isPrimary && styles.primaryAffinityText]}>
                  {`${formatLabel(affinity.affinityType)} · ${formatLabel(affinity.virtueCode)}`}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </Card>
  );
}
