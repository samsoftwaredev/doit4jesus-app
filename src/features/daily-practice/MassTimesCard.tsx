import { Image } from "expo-image";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { Button, Card } from "@/components/ui";

import { styles as styleSheet } from "./DailyPracticeCard.styles";
import type { DailyPracticeCardProps } from "./DailyPracticeCard.types";

/** Renders MassTimesCard with styles resolved from the active appearance. */
export function MassTimesCard({ onPress, style, testID }: DailyPracticeCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <Card
      footer={
        <Button fullWidth onPress={onPress} variant="info">
          {t("formation.dailyPractice.mass.action")}
        </Button>
      }
      style={style}
      subtitle={t("formation.dailyPractice.mass.subtitle")}
      testID={testID}
      title={t("formation.dailyPractice.mass.title")}
      variant="default"
    >
      <Image
        accessible={false}
        contentFit="cover"
        source={require("../../../assets/images/icons/church.svg")}
        style={styles.image}
      />
      <Text style={styles.description}>{t("formation.dailyPractice.mass.description")}</Text>
    </Card>
  );
}
