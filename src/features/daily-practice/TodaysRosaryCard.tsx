import { Image } from "expo-image";
import { Text } from "react-native";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { Button, Card } from "@/components/ui";

import { styles as styleSheet } from "./DailyPracticeCard.styles";
import type { DailyPracticeCardProps } from "./DailyPracticeCard.types";

/** Renders TodaysRosaryCard with styles resolved from the active appearance. */
export function TodaysRosaryCard({ onPress, style, testID }: DailyPracticeCardProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Card
      footer={
        <Button fullWidth onPress={onPress} variant="success">
          Pray
        </Button>
      }
      style={style}
      subtitle="Meditate with Mary"
      testID={testID}
      title="Today's Rosary"
      variant="success"
    >
      <Image
        accessible={false}
        contentFit="cover"
        source={require("../../assets/icons/rosary.png")}
        style={styles.image}
      />
      <Text style={styles.description}>Enter the mysteries with a focused moment of prayer.</Text>
    </Card>
  );
}
