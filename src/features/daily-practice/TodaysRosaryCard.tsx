import { Image } from "expo-image";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { Button, Card } from "@/components/ui";

import { styles as styleSheet } from "./DailyPracticeCard.styles";
import type { DailyPracticeCardProps } from "./DailyPracticeCard.types";

/** Renders TodaysRosaryCard with styles resolved from the active appearance. */
export function TodaysRosaryCard({ onPress, style, testID }: DailyPracticeCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <Card
      footer={
        <Button fullWidth onPress={onPress} variant="success">
          {t("formation.dailyPractice.rosary.action")}
        </Button>
      }
      style={style}
      subtitle={t("formation.dailyPractice.rosary.subtitle")}
      testID={testID}
      title={t("formation.dailyPractice.rosary.title")}
      variant="success"
    >
      <Image
        accessible={false}
        contentFit="cover"
        source={require("../../assets/icons/rosary.png")}
        style={styles.image}
      />
      <Text style={styles.description}>{t("formation.dailyPractice.rosary.description")}</Text>
    </Card>
  );
}
