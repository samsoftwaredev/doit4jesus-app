import Feather from "@expo/vector-icons/Feather";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

type GuideCardId = "history" | "promises";

const guideCards: readonly { id: GuideCardId; titleKey: string; contentKeys: readonly string[] }[] = [
  {
    contentKeys: ["prayerHome.rosaryGuide.history.first", "prayerHome.rosaryGuide.history.second"],
    id: "history",
    titleKey: "prayerHome.rosaryGuide.history.title",
  },
  {
    contentKeys: ["prayerHome.rosaryGuide.promises.first", "prayerHome.rosaryGuide.promises.second"],
    id: "promises",
    titleKey: "prayerHome.rosaryGuide.promises.title",
  },
];

/** Renders two independently expandable cards that introduce the Rosary before the garden. */
export function RosaryGuideCards() {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const [expandedCards, setExpandedCards] = useState<ReadonlySet<GuideCardId>>(() => new Set());

  /** Toggles one guide card without changing the expanded state of the other card. */
  const toggleCard = useCallback((cardId: GuideCardId) => {
    setExpandedCards((currentCards) => {
      const nextCards = new Set(currentCards);
      if (nextCards.has(cardId)) nextCards.delete(cardId);
      else nextCards.add(cardId);
      return nextCards;
    });
  }, []);

  return (
    <View style={styles.cards}>
      {guideCards.map(({ contentKeys, id, titleKey }) => {
        const expanded = expandedCards.has(id);
        const title = t(titleKey);
        return (
          <View key={id} style={styles.card}>
            <Pressable
              accessibilityHint={t(
                expanded ? "prayerHome.rosaryGuide.collapseHint" : "prayerHome.rosaryGuide.expandHint",
              )}
              accessibilityLabel={t(
                expanded ? "prayerHome.rosaryGuide.collapseLabel" : "prayerHome.rosaryGuide.expandLabel",
                {
                  title,
                },
              )}
              accessibilityRole="button"
              accessibilityState={{ expanded }}
              onPress={() => toggleCard(id)}
              style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
            >
              <Text accessibilityRole="header" style={styles.title}>
                {title}
              </Text>
              <Feather
                accessible={false}
                color={theme.colors.gold.pale}
                name={expanded ? "chevron-up" : "chevron-down"}
                size={theme.sizes.iconMedium}
              />
            </Pressable>
            {expanded ? (
              <View style={styles.content}>
                {contentKeys.map((contentKey) => (
                  <Text key={contentKey} style={styles.copy}>
                    {t(contentKey)}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.colors.surface.glass,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.hairline,
    overflow: "hidden",
  },
  cards: { gap: theme.spacing[3], width: "100%" },
  content: {
    borderTopColor: theme.colors.border.subtle,
    borderTopWidth: theme.borderWidths.hairline,
    gap: theme.spacing[3],
    padding: theme.spacing[4],
  },
  copy: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamilies.devotional,
    lineHeight: theme.lineHeights.lg,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[3],
    justifyContent: "space-between",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  headerPressed: { opacity: theme.opacity.muted },
  title: { ...theme.typography.heading3, color: theme.colors.text.primary, flex: 1 },
}));
