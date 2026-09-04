import { Image } from "expo-image";
import { Text, View } from "react-native";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { Card } from "@/components/ui";

import { styles as styleSheet } from "./AvatarPanel.styles";
import type { AvatarPanelProps } from "./AvatarPanel.types";

/** Renders AvatarPanel with styles resolved from the active appearance. */
export function AvatarPanel({ style, testID }: AvatarPanelProps) {
  const styles = useThemedStyles(styleSheet);
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
