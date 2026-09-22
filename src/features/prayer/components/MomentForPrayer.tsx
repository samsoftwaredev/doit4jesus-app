import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { ImageSourcePropType } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import { OrnateCard } from "./OrnateCard";

type MomentForPrayerProps = {
  mysteryImageSource: ImageSourcePropType;
  mysteryTitle: string;
  onPrayToday: () => void;
  weekday: string;
};

/** Renders today's Rosary call to action with the scheduled mystery's devotional image. */
export function MomentForPrayer({ mysteryImageSource, mysteryTitle, onPrayToday, weekday }: MomentForPrayerProps) {
  const styles = useThemedStyles(styleSheet);

  return (
    <View style={styles.section}>
      <TodayRosaryCard
        mysteryImageSource={mysteryImageSource}
        mysteryTitle={mysteryTitle}
        onPress={onPrayToday}
        weekday={weekday}
      />
    </View>
  );
}

/** Renders the illustrated card that begins today's scheduled Rosary with readable overlay copy. */
function TodayRosaryCard({
  mysteryImageSource,
  mysteryTitle,
  onPress,
  weekday,
}: Omit<MomentForPrayerProps, "onPrayToday"> & {
  onPress: () => void;
}) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();

  return (
    <OrnateCard style={styles.todayCard}>
      <Image
        accessible={false}
        contentFit="cover"
        source={mysteryImageSource}
        style={styles.todayImage}
        testID="today-rosary-mystery-image"
      />
      <LinearGradient colors={theme.colors.gradients.mysteryImage} style={StyleSheet.absoluteFill} />
      <View style={styles.todayContent}>
        <View style={styles.todayLabel}>
          <Feather accessible={false} color={theme.rosary.colors.gold} name="calendar" size={theme.sizes.iconSmall} />
          <Text style={styles.sectionLabel}>{t("prayer.todaysRosary")}</Text>
        </View>
        <Text style={styles.todayTitle}>{mysteryTitle}</Text>
        <Text style={styles.weekday}>{weekday}</Text>
        <Button
          accessibilityLabel={t("prayer.prayTodayLabel", { mystery: mysteryTitle })}
          onPress={onPress}
          rightIcon={
            <Feather
              accessible={false}
              color={theme.colors.text.inverse}
              name="chevron-right"
              size={theme.sizes.iconSmall}
            />
          }
          style={styles.todayAction}
          variant="warning"
        >
          {t("prayer.prayToday")}
        </Button>
      </View>
    </OrnateCard>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  section: { width: "100%" },
  sectionLabel: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
  },
  todayAction: { marginTop: theme.spacing[4] },
  todayCard: { backgroundColor: theme.rosary.colors.cardInset, minHeight: 272 },
  todayContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: theme.spacing[4],
  },
  todayImage: { height: "100%", position: "absolute", right: 0, width: "100%" },
  todayLabel: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[1],
  },
  todayTitle: {
    ...theme.typography.heading1,
    color: theme.colors.text.white,
    fontFamily: theme.fontFamilies.display,
    marginTop: theme.spacing[2],
    maxWidth: "72%",
  },
  weekday: {
    ...theme.typography.bodyMedium,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[1],
  },
}));
