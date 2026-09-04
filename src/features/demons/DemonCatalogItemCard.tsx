import { Image } from "expo-image";
import type { StyleProp, ViewStyle } from "react-native";
import { Text, View } from "react-native";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { Card } from "@/components/ui";

import { getDemonArtwork } from "./demonArtwork";
import { styles as styleSheet } from "./DemonCatalogItemCard.styles";
import type { DemonCatalogItem } from "./demons.types";

interface DemonCatalogItemCardProps {
  demon: DemonCatalogItem;
  style?: StyleProp<ViewStyle>;
}

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

/** Renders DemonCatalogItemCard with styles resolved from the active appearance. */
export function DemonCatalogItemCard({ demon, style }: DemonCatalogItemCardProps) {
  const styles = useThemedStyles(styleSheet);
  const artwork = getDemonArtwork(demon);

  return (
    <Card style={style} variant="danger">
      <View style={styles.content}>
        {artwork ? (
          <View style={styles.artworkFrame}>
            <Image accessible={false} contentFit="contain" source={artwork} style={styles.artwork} />
          </View>
        ) : null}

        <View style={styles.details}>
          <View style={styles.metadata}>
            <Text style={styles.title}>{demon.name}</Text>
            <Text style={styles.subtitle}>{demon.title}</Text>
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
        </View>
      </View>
    </Card>
  );
}
