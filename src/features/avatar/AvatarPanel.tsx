import { Image } from "expo-image";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useThemedStyles } from "@/theme/createThemedStyles";
import { Card } from "@/components/ui";

import { styles as styleSheet } from "./AvatarPanel.styles";
import type { AvatarPanelProps } from "./AvatarPanel.types";

/** Renders AvatarPanel with styles resolved from the active appearance. */
export function AvatarPanel({ style, testID }: AvatarPanelProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <Card
      accessibilityLabel={t("formation.avatar.label")}
      padding="lg"
      style={style}
      subtitle={t("formation.avatar.subtitle")}
      testID={testID}
      title={t("formation.avatar.title")}
      variant="elevated"
    >
      <View style={styles.portraitFrame}>
        <Image
          accessible={false}
          contentFit="contain"
          source={require("../../../assets/images/avatar/knight.png")}
          style={styles.portrait}
        />
      </View>
      <Text style={styles.description}>{t("formation.avatar.description")}</Text>
    </Card>
  );
}
