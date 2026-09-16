import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

interface DailyVerseCardProps {
  citation: string;
  text: string;
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function DailyVerseCard({ citation, text }: DailyVerseCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <View accessibilityLabel={t("liturgy.verseLabel", { citation })} style={styles.card}>
      <MaterialCommunityIcons
        accessible={false}
        color={theme.colors.gold.pale}
        name="format-quote-open"
        size={31}
        style={styles.quote}
      />
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.citation}>{citation}</Text>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    marginTop: theme.spacing[4],
    overflow: "hidden",
    padding: theme.spacing[5],
  },
  citation: { ...theme.typography.label, color: theme.colors.gold.pale, marginTop: theme.spacing[4] },
  quote: { marginBottom: theme.spacing[1] },
  text: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamilies.devotional,
    fontSize: theme.fontSizes.lg,
    fontStyle: "italic",
    lineHeight: theme.lineHeights.lg,
  },
}));
