import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { OrnateCard } from "@/components/prayer/OrnateCard";
import { theme } from "@/theme/tokens";
import type { RosaryMysterySet } from "@/types/rosary";

type RosaryMysteryCardProps = {
  mysterySet: RosaryMysterySet;
  onPress: () => void;
  width: number;
};

export function RosaryMysteryCard({ mysterySet, onPress, width }: RosaryMysteryCardProps) {
  return (
    <Pressable
      accessibilityLabel={`Open ${mysterySet.title}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, { width }, pressed && styles.pressed]}
    >
      <OrnateCard style={styles.card}>
        <Image accessible={false} contentFit="cover" source={mysterySet.imageSource} style={styles.image} />
        <LinearGradient
          colors={["rgba(3, 13, 24, 0.06)", "rgba(3, 13, 24, 0.42)", "rgba(3, 13, 24, 0.9)"]}
          locations={[0, 0.42, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content}>
          <Text numberOfLines={2} style={styles.title}>{mysterySet.title}</Text>
          <Text numberOfLines={2} style={styles.subtitle}>{mysterySet.subtitle}</Text>
          <View style={styles.arrow}>
            <Feather accessible={false} color={theme.colors.text.inverse} name="arrow-up-right" size={theme.sizes.iconSmall} />
          </View>
        </View>
      </OrnateCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  arrow: {
    alignItems: "center",
    backgroundColor: theme.rosary.colors.gold,
    borderRadius: theme.radii.pill,
    height: theme.spacing[7],
    justifyContent: "center",
    marginTop: "auto",
    width: theme.spacing[7],
  },
  card: { aspectRatio: 0.7, backgroundColor: theme.rosary.colors.cardInset },
  content: { flex: 1, justifyContent: "flex-end", padding: theme.spacing[3] },
  image: { height: "100%", position: "absolute", width: "100%" },
  pressed: { opacity: theme.opacity.pressed, transform: [{ scale: 0.985 }] },
  pressable: { minWidth: 0 },
  subtitle: { ...theme.typography.caption, color: theme.rosary.colors.goldBright, marginTop: theme.spacing[1] },
  title: { ...theme.typography.heading3, color: theme.colors.text.white, fontFamily: theme.fontFamilies.display },
});
