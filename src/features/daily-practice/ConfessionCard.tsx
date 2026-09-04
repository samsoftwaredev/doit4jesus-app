import { Image } from "expo-image";
import { Text } from "react-native";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { Button, Card } from "@/components/ui";

import { styles as styleSheet } from "./DailyPracticeCard.styles";
import type { DailyPracticeCardProps } from "./DailyPracticeCard.types";

/** Renders ConfessionCard with styles resolved from the active appearance. */
export function ConfessionCard({ onPress, style, testID }: DailyPracticeCardProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Card
      footer={
        <Button fullWidth onPress={onPress} variant="outline">
          Find
        </Button>
      }
      style={style}
      subtitle="Return to mercy"
      testID={testID}
      title="Confession"
      variant="warning"
    >
      <Image
        accessible={false}
        contentFit="cover"
        source={require("../../assets/icons/confession.png")}
        style={styles.image}
      />
      <Text style={styles.description}>Locate reconciliation times and prepare your heart for grace.</Text>
    </Card>
  );
}
