import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useWindowDimensions, View } from "react-native";

import { theme } from "@/theme/tokens";

import { styles } from "./KnightDisplay.styles";
import type { ArmorItem } from "./armorOfGod.types";

interface KnightDisplayProps {
  selectedItem: ArmorItem;
}

const focusPositionByArmorId = {
  belt: { left: "50%", top: "55%" },
  boots: { left: "50%", top: "84%" },
  breastplate: { left: "47%", top: "38%" },
  helmet: { left: "50%", top: "17%" },
  shield: { left: "73%", top: "46%" },
  sword: { left: "35%", top: "65%" },
} as const;

export function KnightDisplay({ selectedItem }: KnightDisplayProps) {
  const { height: windowHeight } = useWindowDimensions();
  const stageHeight = Math.min(windowHeight * 0.44, theme.spacing[24] * 6);
  const focusPosition = focusPositionByArmorId[selectedItem.id as keyof typeof focusPositionByArmorId];

  return (
    <View
      accessibilityLabel={`Guardian knight. ${selectedItem.name} is selected.`}
      style={[styles.stage, { height: stageHeight }]}
    >
      <View pointerEvents="none" style={styles.platform} />
      <Image
        accessible={false}
        contentFit="contain"
        source={require("../../assets/avatar/knight.png")}
        style={styles.knight}
      />
      {focusPosition ? (
        <View pointerEvents="none" style={[styles.focusMarker, focusPosition]}>
          <MaterialCommunityIcons
            accessible={false}
            color={theme.colors.gold.pale}
            name={selectedItem.icon}
            size={theme.sizes.iconSmall}
          />
        </View>
      ) : null}
    </View>
  );
}
