import { Image } from "expo-image";
import { Text } from "react-native";

import { Button, Card } from "@/components/ui";

import { styles } from "./DailyPracticeCard.styles";
import type { DailyPracticeCardProps } from "./DailyPracticeCard.types";

export function MassTimesCard({ onPress, style, testID }: DailyPracticeCardProps) {
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
      <Text style={styles.description}>
        Find a nearby Mass and make room to encounter Christ.
      </Text>
    </Card>
  );
}
