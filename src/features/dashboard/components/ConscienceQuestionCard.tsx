import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/theme/tokens";

import type { ConscienceQuestionViewModel } from "../dashboard.types";

const bibleImage = require("../../../assets/icons/bible.png");

type ConscienceQuestionCardProps = {
  error: boolean;
  isLoading: boolean;
  onRetry: () => void;
  question: ConscienceQuestionViewModel | null;
};

export function ConscienceQuestionCard({ error, isLoading, onRetry, question }: ConscienceQuestionCardProps) {
  return (
    <LinearGradient
      colors={["#1D203F", "#111B32", "#24213F"]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.card}
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
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={styles.heading}>
          QUESTION OF CONSCIENCE
        </Text>
        {isLoading ? <QuestionSkeleton /> : null}
        {!isLoading && error ? (
          <View accessibilityRole="alert">
            <Text style={styles.error}>Reflection unavailable.</Text>
            <Pressable
              accessibilityLabel="Retry conscience question"
              accessibilityRole="button"
              onPress={onRetry}
              style={styles.retry}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>
          </View>
        ) : null}
        {!isLoading && !error && question ? (
          <>
            <Text style={styles.question}>{question.question}</Text>
            {question.reflection ? <Text style={styles.reflection}>{question.reflection}</Text> : null}
          </>
        ) : null}
      </View>
    </LinearGradient>
  );
}

function QuestionSkeleton() {
  return (
    <View accessibilityLabel="Loading conscience question" style={styles.skeletons}>
      <View style={styles.questionSkeleton} />
      <View style={styles.questionSkeletonShort} />
      <View style={styles.reflectionSkeleton} />
    </View>
  );
}

const styles = StyleSheet.create({
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
  copy: { flex: 1, minWidth: 0, paddingLeft: theme.spacing[3] },
  cross: { position: "absolute", right: theme.spacing[0], top: theme.spacing[0] },
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
  retry: { alignSelf: "flex-start", minHeight: theme.sizes.touchTarget, justifyContent: "center" },
  retryText: { ...theme.typography.button, color: theme.colors.gold.pale },
  skeletons: { marginTop: theme.spacing[3] },
});
