import { Image } from "expo-image";
import { Text } from "react-native";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { Button, Card } from "@/components/ui";

import { styles as styleSheet } from "./DailyPracticeCard.styles";
import type { DailyPracticeCardProps } from "./DailyPracticeCard.types";

/** Renders MassTimesCard with styles resolved from the active appearance. */
export function MassTimesCard({ onPress, style, testID }: DailyPracticeCardProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Card
      footer={
        <Button fullWidth onPress={onPress} variant="info">
          View
        </Button>
      }
      style={style}
      subtitle="Worship near you"
      testID={testID}
      title="Mass Times"
      variant="default"
    >
      <Image
        accessible={false}
        contentFit="cover"
        source={require("../../assets/icons/church.png")}
        style={styles.image}
      />
      <Text style={styles.description}>Find a nearby Mass and make room to encounter Christ.</Text>
    </Card>
  );
}
