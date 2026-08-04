import { Image } from "expo-image";
import { Pressable, View } from "react-native";

import type { DemonCatalogItem } from "@/features/demons";
import { getDemonArtwork } from "@/features/demons";

import { styles } from "./ArenaDemonSelector.styles";

interface ArenaDemonSelectorProps {
  demons: ReadonlyArray<DemonCatalogItem>;
  onSelect: (demon: DemonCatalogItem) => void;
  selectedCode?: string;
}

interface OrbitPosition {
  left: `${number}%`;
  top: `${number}%`;
}

const orbitCenter = 50;
const orbitRadius = 34;

function toPercent(value: number): `${number}%` {
  return `${value}%`;
}

function getOrbitPosition(index: number, count: number): OrbitPosition {
  if (count <= 1) {
    return { left: toPercent(orbitCenter), top: toPercent(orbitCenter) };
  }

  const angle = (index / count) * Math.PI * 2 - Math.PI / 2;

  return {
    left: toPercent(orbitCenter + Math.cos(angle) * orbitRadius),
    top: toPercent(orbitCenter + Math.sin(angle) * orbitRadius),
  };
}

export function ArenaDemonSelector({
  demons,
  onSelect,
  selectedCode,
}: ArenaDemonSelectorProps) {
  return (
    <View
      accessibilityLabel="Demon arena. Select a demon to begin."
      style={styles.arena}
    >
      <Image
        accessible={false}
        contentFit="cover"
        source={require("../../assets/backgrounds/battleArena.png")}
        style={styles.background}
      />

      {demons.map((demon, index) => {
        const artwork = getDemonArtwork(demon);
        const isSelected = demon.code === selectedCode;

        return (
          <Pressable
            accessibilityLabel={`Select ${demon.name}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={demon.id}
            onPress={() => onSelect(demon)}
            style={({ pressed }) => [
              styles.demonButton,
              getOrbitPosition(index, demons.length),
              isSelected && styles.demonButtonSelected,
              pressed && styles.demonButtonPressed,
            ]}
          >
            {artwork ? (
              <Image
                accessible={false}
                contentFit="contain"
                source={artwork}
                style={styles.demonImage}
              />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
