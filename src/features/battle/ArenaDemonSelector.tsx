import { Image } from "expo-image";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useThemedStyles } from "@/theme/createThemedStyles";
import type { DemonCatalogItem } from "@/features/demons";
import { getDemonArtwork } from "@/features/demons";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { theme } from "@/theme/tokens";

import { styles as styleSheet } from "./ArenaDemonSelector.styles";

interface ArenaDemonSelectorProps {
  demons: readonly DemonCatalogItem[];
  onSelect: (demon: DemonCatalogItem) => void;
  selectedCode?: string;
}

interface OrbitPosition {
  left: `${number}%`;
  top: `${number}%`;
}

const orbitCenter = 50;
const orbitRadius = 34;

/** Formats an orbit coordinate for React Native percentage positioning. */
function toPercent(value: number): `${number}%` {
  return `${value}%`;
}

/** Evenly distributes a demon around the arena's visual orbit. */
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

/** Renders a fluid square arena whose selectable artwork scales with the available phone or desktop width. */
export function ArenaDemonSelector({ demons, onSelect, selectedCode }: ArenaDemonSelectorProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const { isLargeText, width } = useResponsiveLayout();
  const arenaWidth = Math.min(Math.max(width - theme.spacing[8], 0), theme.spacing[24] * 5);
  const demonButtonSize = Math.max(theme.sizes.touchTarget * 2, Math.min(isLargeText ? 128 : 180, arenaWidth * 0.36));

  return (
    <View accessibilityLabel={t("formation.battle.arenaLabel")} style={styles.arena}>
      <Image
        accessible={false}
        contentFit="cover"
        source={require("../../../assets/images/backgrounds/battleArena.png")}
        style={styles.background}
      />

      {demons.map((demon, index) => {
        const artwork = getDemonArtwork(demon);
        const isSelected = demon.code === selectedCode;

        return (
          <Pressable
            accessibilityLabel={t("formation.battle.select", { name: demon.name })}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={demon.id}
            onPress={() => onSelect(demon)}
            style={({ pressed }) => [
              styles.demonButton,
              getOrbitPosition(index, demons.length),
              {
                height: demonButtonSize,
                marginLeft: -demonButtonSize / 2,
                marginTop: -demonButtonSize / 2,
                width: demonButtonSize,
              },
              isSelected && styles.demonButtonSelected,
              pressed && styles.demonButtonPressed,
            ]}
          >
            {artwork ? (
              <Image accessible={false} contentFit="contain" source={artwork} style={styles.demonImage} />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
