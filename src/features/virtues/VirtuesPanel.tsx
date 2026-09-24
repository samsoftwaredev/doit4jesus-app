import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui";
import { useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { VirtueProgressBar } from "./VirtueProgressBar";
import { styles as styleSheet } from "./VirtuesPanel.styles";
import type { VirtueScore, VirtuesPanelProps } from "./virtues.types";

/** Renders this feature with colors from the currently resolved app appearance. */
export function VirtuesPanel({ virtues, maxValue = 100, fullWidth = true, style, testID }: VirtuesPanelProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const resolvedVirtues =
    virtues ??
    ([
      {
        id: "faith",
        label: t("formation.virtues.faith"),
        value: 85,
        tone: "faith",
        icon: require("../../../assets/images/virtues/cross.png"),
      },
      {
        id: "discipline",
        label: t("formation.virtues.discipline"),
        value: 90,
        tone: "discipline",
        icon: require("../../../assets/images/virtues/candel.png"),
      },
      {
        id: "courage",
        label: t("formation.virtues.courage"),
        value: 75,
        tone: "courage",
        icon: require("../../../assets/images/virtues/sword.png"),
      },
      {
        id: "wisdom",
        label: t("formation.virtues.wisdom"),
        value: 80,
        tone: "wisdom",
        icon: require("../../../assets/images/virtues/bible.png"),
      },
      {
        id: "charity",
        label: t("formation.virtues.charity"),
        value: 88,
        tone: "charity",
        icon: require("../../../assets/images/virtues/heart.png"),
      },
      {
        id: "purity",
        label: t("formation.virtues.purity"),
        value: 92,
        tone: "purity",
        icon: require("../../../assets/images/virtues/peace.png"),
      },
    ] satisfies readonly VirtueScore[]);
  return (
    <Card
      accessibilityLabel={t("formation.virtues.title")}
      fullWidth={fullWidth}
      padding="lg"
      style={style}
      testID={testID}
      variant="elevated"
    >
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          {t("formation.virtues.title")}
        </Text>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <MaterialCommunityIcons
            color={theme.colors.brand.primaryLight}
            name="star-four-points"
            size={theme.sizes.iconXs}
          />
          <View style={styles.dividerLine} />
        </View>
      </View>

      <Text style={styles.introduction}>{t("formation.virtues.introduction")}</Text>

      <View style={styles.virtueList}>
        {resolvedVirtues.map((virtue) => (
          <VirtueProgressBar key={virtue.id} {...virtue} maxValue={maxValue} />
        ))}
      </View>

      <View style={styles.encouragement}>
        <MaterialCommunityIcons
          color={theme.colors.icon.active}
          name="meditation"
          size={theme.sizes.iconMedium}
          style={styles.encouragementIcon}
        />
        <Text style={styles.encouragementText}>{t("formation.virtues.encouragement")}</Text>
      </View>
    </Card>
  );
}
