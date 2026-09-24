import { Image } from "expo-image";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { Button, Card } from "@/components/ui";

import { styles as styleSheet } from "./DailyPracticeCard.styles";
import type { DailyPracticeCardProps } from "./DailyPracticeCard.types";

/** Renders ConfessionCard with styles resolved from the active appearance. */
export function ConfessionCard({ onPress, style, testID }: DailyPracticeCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <Card
      footer={
        <Button fullWidth onPress={onPress} variant="outline">
          {t("formation.dailyPractice.confession.action")}
        </Button>
      }
      style={style}
      subtitle={t("formation.dailyPractice.confession.subtitle")}
      testID={testID}
      title={t("formation.dailyPractice.confession.title")}
      variant="warning"
    >
      <Image
        accessible={false}
        contentFit="cover"
        source={require("../../../assets/images/icons/confession.svg")}
        style={styles.image}
      />
      <Text style={styles.description}>{t("formation.dailyPractice.confession.description")}</Text>
    </Card>
  );
}
