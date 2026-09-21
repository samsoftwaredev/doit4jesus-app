import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type {
  ConscienceQuestionCategory,
  ConscienceQuestionListItemViewModel,
  ConscienceQuestionViewModel,
} from "../dashboard.types";

const bibleImage = require("../../../assets/icons/bible.png");

type ConscienceQuestionCardProps = {
  allQuestions: ConscienceQuestionListItemViewModel[];
  allQuestionsError: boolean;
  error: boolean;
  isLoadingAllQuestions: boolean;
  isLoading: boolean;
  onRetry: () => void;
  onViewMore: () => void;
  question: ConscienceQuestionViewModel | null;
};

const categories: ConscienceQuestionCategory[] = ["single", "married", "religious"];

/** Renders a daily conscience question with guidance for using the examination. */
export function ConscienceQuestionCard({
  allQuestions,
  allQuestionsError,
  error,
  isLoadingAllQuestions,
  isLoading,
  onRetry,
  onViewMore,
  question,
}: ConscienceQuestionCardProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  const { isLargeText, isNarrowPhone } = useResponsiveLayout();
  const { width } = useWindowDimensions();
  const [isQuestionsVisible, setIsQuestionsVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<ConscienceQuestionCategory[]>([]);
  const stackContent = isLargeText || isNarrowPhone;
  const visibleQuestions =
    selectedCategories.length === 0
      ? allQuestions
      : allQuestions.filter((questionItem) => selectedCategories.includes(questionItem.category));

  /** Opens the complete examination and requests its latest questions. */
  function handleViewMore() {
    setIsQuestionsVisible(true);
    onViewMore();
  }

  /** Closes the full examination dialog while preserving selected category filters. */
  function handleCloseQuestions() {
    setIsQuestionsVisible(false);
  }

  /** Adds or removes one vocation category from the multi-select list filter. */
  function handleCategoryToggle(category: ConscienceQuestionCategory) {
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((currentCategory) => currentCategory !== category)
        : [...currentCategories, category],
    );
  }

  return (
    <>
      <LinearGradient
        colors={theme.colors.gradients.conscience}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[styles.card, stackContent && styles.cardStacked]}
      >
        <View pointerEvents="none" style={styles.illumination} />
        <View style={styles.artwork}>
          <Image accessible={false} contentFit="contain" source={bibleImage} style={styles.bible} />
          <Feather
            accessible={false}
            color={theme.colors.gold.pale}
            name="plus"
            size={theme.sizes.iconSmall}
            style={styles.cross}
          />
        </View>
        <View style={[styles.copy, stackContent && styles.copyStacked]}>
          <Text accessibilityRole="header" style={styles.heading}>
            {t("dashboard.conscience.heading")}
          </Text>
          <Text style={styles.description}>{t("dashboard.conscience.description")}</Text>
          {isLoading ? <QuestionSkeleton /> : null}
          {!isLoading && error ? (
            <View accessibilityRole="alert">
              <Text style={styles.error}>{t("dashboard.conscience.unavailable")}</Text>
              <Pressable
                accessibilityLabel={t("dashboard.conscience.retryLabel")}
                accessibilityRole="button"
                onPress={onRetry}
                style={styles.retry}
              >
                <Text style={styles.retryText}>{t("common.retry")}</Text>
              </Pressable>
            </View>
          ) : null}
          {!isLoading && !error && question ? (
            <>
              <Text style={styles.question}>{question.question}</Text>
              {question.reflection ? <Text style={styles.reflection}>{question.reflection}</Text> : null}
            </>
          ) : null}
          <Pressable
            accessibilityLabel={t("dashboard.conscience.viewMoreLabel")}
            accessibilityRole="button"
            onPress={handleViewMore}
            style={({ pressed }) => [styles.viewMore, pressed && styles.pressed]}
          >
            <Text style={styles.viewMoreText}>{t("dashboard.conscience.viewMore")}</Text>
          </Pressable>
        </View>
      </LinearGradient>
      <Modal
        animationType="slide"
        onRequestClose={handleCloseQuestions}
        presentationStyle="overFullScreen"
        transparent
        visible={isQuestionsVisible}
      >
        <View style={styles.modalOverlay}>
          <View
            accessibilityLabel={t("dashboard.conscience.listTitle")}
            accessibilityViewIsModal
            style={[styles.modal, { maxWidth: Math.min(width - theme.spacing[4] * 2, 720) }]}
          >
            <View style={styles.modalHeader}>
              <Text accessibilityRole="header" style={styles.modalTitle}>
                {t("dashboard.conscience.listTitle")}
              </Text>
              <Pressable
                accessibilityLabel={t("dashboard.conscience.closeLabel")}
                accessibilityRole="button"
                onPress={handleCloseQuestions}
                style={styles.closeButton}
              >
                <Feather accessible={false} color={theme.colors.text.primary} name="x" size={theme.sizes.iconMedium} />
              </Pressable>
            </View>
            <Text style={styles.vocationPrompt}>{t("dashboard.conscience.vocationPrompt")}</Text>
            <View accessibilityRole="tablist" style={styles.filters}>
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <Pressable
                    accessibilityLabel={t(`dashboard.conscience.categories.${category}`)}
                    accessibilityRole="switch"
                    accessibilityState={{ checked: isSelected }}
                    key={category}
                    onPress={() => handleCategoryToggle(category)}
                    style={[styles.filter, isSelected && styles.filterSelected]}
                  >
                    <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                      {t(`dashboard.conscience.categories.${category}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <ScrollView contentContainerStyle={styles.questionList} showsVerticalScrollIndicator={false}>
              {isLoadingAllQuestions ? (
                <Text accessibilityRole="alert" style={styles.listStatus}>
                  {t("dashboard.conscience.listLoading")}
                </Text>
              ) : null}
              {!isLoadingAllQuestions && allQuestionsError ? (
                <Text accessibilityRole="alert" style={styles.listStatus}>
                  {t("dashboard.conscience.listUnavailable")}
                </Text>
              ) : null}
              {!isLoadingAllQuestions &&
                !allQuestionsError &&
                visibleQuestions.map((questionItem) => (
                  <View key={questionItem.id} style={styles.questionListItem}>
                    <Text style={styles.questionCategory}>
                      {t(`dashboard.conscience.categories.${questionItem.category}`)} · {questionItem.title}
                    </Text>
                    <Text style={styles.questionListText}>{questionItem.question}</Text>
                  </View>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

/** Renders QuestionSkeleton with styles resolved from the active appearance. */
function QuestionSkeleton() {
  const { t } = useTranslation();
  const styles = useThemedStyles(styleSheet);
  return (
    <View accessibilityLabel={t("dashboard.conscience.loading")} style={styles.skeletons}>
      <View style={styles.questionSkeleton} />
      <View style={styles.questionSkeletonShort} />
      <View style={styles.reflectionSkeleton} />
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  artwork: {
    alignItems: "center",
    height: 96,
    justifyContent: "center",
    position: "relative",
    width: 82,
  },
  bible: { height: 70, width: 70 },
  card: {
    borderColor: "#5D5989",
    borderRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    minHeight: 184,
    overflow: "hidden",
    padding: theme.spacing[4],
    position: "relative",
  },
  cardStacked: { flexDirection: "column" },
  copy: { flex: 1, minWidth: 0, paddingLeft: theme.spacing[3] },
  copyStacked: { paddingLeft: theme.spacing[0], paddingTop: theme.spacing[2] },
  cross: { position: "absolute", right: theme.spacing[0], top: theme.spacing[0] },
  description: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, marginTop: theme.spacing[2] },
  error: { ...theme.typography.body, color: theme.colors.text.secondary, marginTop: theme.spacing[3] },
  heading: {
    ...theme.typography.labelSmall,
    color: theme.colors.accent.purpleLight,
    letterSpacing: theme.letterSpacing.wider,
  },
  illumination: {
    backgroundColor: "rgba(132, 118, 182, 0.12)",
    borderRadius: theme.radii.pill,
    height: 220,
    left: -84,
    position: "absolute",
    top: -64,
    width: 220,
  },
  question: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamilies.display,
    marginTop: theme.spacing[3],
  },
  questionSkeleton: {
    backgroundColor: "rgba(231, 238, 242, 0.16)",
    borderRadius: theme.radii.xs,
    height: theme.spacing[4],
    width: "100%",
  },
  questionSkeletonShort: {
    backgroundColor: "rgba(231, 238, 242, 0.16)",
    borderRadius: theme.radii.xs,
    height: theme.spacing[4],
    marginTop: theme.spacing[1],
    width: "72%",
  },
  reflection: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, marginTop: theme.spacing[3] },
  reflectionSkeleton: {
    backgroundColor: "rgba(231, 238, 242, 0.1)",
    borderRadius: theme.radii.xs,
    height: theme.spacing[3],
    marginTop: theme.spacing[3],
    width: "88%",
  },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    minWidth: theme.sizes.touchTarget,
  },
  filter: {
    alignItems: "center",
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    justifyContent: "center",
    minHeight: theme.sizes.touchTarget,
    paddingHorizontal: theme.spacing[3],
  },
  filterSelected: { backgroundColor: theme.colors.accent.purple, borderColor: theme.colors.accent.purple },
  filterText: { ...theme.typography.button, color: theme.colors.text.primary },
  filterTextSelected: { color: theme.colors.text.inverse },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[2],
    marginBottom: theme.spacing[3],
    marginTop: theme.spacing[1],
  },
  listStatus: { ...theme.typography.body, color: theme.colors.text.secondary, paddingVertical: theme.spacing[4] },
  modal: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.radii.xl,
    flex: 1,
    maxHeight: "88%",
    padding: theme.spacing[4],
    width: "100%",
  },
  modalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing[3],
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing[4],
  },
  modalTitle: {
    ...theme.typography.heading2,
    color: theme.colors.text.primary,
    flex: 1,
    fontFamily: theme.fontFamilies.display,
    marginRight: theme.spacing[2],
  },
  pressed: { opacity: 0.78 },
  questionCategory: {
    ...theme.typography.labelSmall,
    color: theme.colors.accent.purpleLight,
    letterSpacing: theme.letterSpacing.wider,
  },
  questionList: { gap: theme.spacing[3], paddingBottom: theme.spacing[2] },
  questionListItem: {
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.thin,
    gap: theme.spacing[1],
    paddingBottom: theme.spacing[3],
  },
  questionListText: { ...theme.typography.body, color: theme.colors.text.primary },
  retry: { alignSelf: "flex-start", minHeight: theme.sizes.touchTarget, justifyContent: "center" },
  retryText: { ...theme.typography.button, color: theme.colors.gold.pale },
  skeletons: { marginTop: theme.spacing[3] },
  vocationPrompt: { ...theme.typography.bodySmall, color: theme.colors.text.secondary, marginTop: theme.spacing[3] },
  viewMore: {
    alignSelf: "flex-start",
    justifyContent: "center",
    marginTop: theme.spacing[3],
    minHeight: theme.sizes.touchTarget,
  },
  viewMoreText: { ...theme.typography.button, color: theme.colors.gold.pale },
}));
