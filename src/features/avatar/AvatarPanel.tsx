import { Image } from "expo-image";
import { Text, View } from "react-native";

import { Card } from "@/components/ui";

import { styles } from "./AvatarPanel.styles";
import type { AvatarPanelProps } from "./AvatarPanel.types";

export function AvatarPanel({ style, testID }: AvatarPanelProps) {
  return (
    <Card
      accessibilityLabel="Avatar panel, Knight of Faith"
      padding="lg"
      style={style}
      subtitle="Your spiritual companion"
      testID={testID}
      title="Knight of Faith"
      variant="elevated"
    >
      <View style={styles.portraitFrame}>
        <Image
          accessible={false}
          contentFit="contain"
          source={require("../../assets/avatar/knight.png")}
          style={styles.portrait}
        />
      </View>
      <Text style={styles.description}>A faithful companion on your pilgrimage toward holiness.</Text>
    </Card>
  );
}
