import { Image } from "expo-image";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { Button, Card } from "@/components/ui";

import { styles as styleSheet } from "./DailyPracticeCard.styles";
import type { DailyPracticeCardProps } from "./DailyPracticeCard.types";

/** Renders TodaysScriptureCard with styles resolved from the active appearance. */
export function TodaysScriptureCard({ onPress, style, testID }: DailyPracticeCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <Card
      footer={
        <Button fullWidth onPress={onPress} variant="primary">
          {t("formation.dailyPractice.scripture.action")}
        </Button>
      }
      style={style}
      subtitle={t("formation.dailyPractice.scripture.subtitle")}
      testID={testID}
      title={t("formation.dailyPractice.scripture.title")}
      variant="info"
    >
      <Image
        accessible={false}
        contentFit="cover"
        source={require("../../../assets/images/icons/bible.png")}
        style={styles.image}
      />
      <Text style={styles.description}>{t("formation.dailyPractice.scripture.description")}</Text>
    </Card>
  );
}
