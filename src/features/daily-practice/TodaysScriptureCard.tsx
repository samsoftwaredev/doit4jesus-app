import { Image } from "expo-image";
import { Text } from "react-native";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { Button, Card } from "@/components/ui";

import { styles as styleSheet } from "./DailyPracticeCard.styles";
import type { DailyPracticeCardProps } from "./DailyPracticeCard.types";

/** Renders TodaysScriptureCard with styles resolved from the active appearance. */
export function TodaysScriptureCard({ onPress, style, testID }: DailyPracticeCardProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Card
      footer={
        <Button fullWidth onPress={onPress} variant="primary">
          Read
        </Button>
      }
      style={style}
      subtitle="A word for your day"
      testID={testID}
      title="Today's Scripture"
      variant="info"
    >
      <Image
        accessible={false}
        contentFit="cover"
        source={require("../../assets/icons/bible.png")}
        style={styles.image}
      />
      <Text style={styles.description}>Receive the day&apos;s reading and carry it into prayer.</Text>
    </Card>
  );
}
