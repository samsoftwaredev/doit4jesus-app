import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

import type { DailyReading } from "../liturgy.types";

interface ScriptureReadingRowProps {
  completed: boolean;
  expanded: boolean;
  reading: DailyReading;
  onComplete: (readingId: string) => Promise<void>;
  onToggle: () => void;
}

function titleCaseReadingType(type: DailyReading["type"]) {
  return type.replaceAll("_", " ");
}

/** Renders this feature with colors from the currently resolved app appearance. */
export function ScriptureReadingRow({ completed, expanded, reading, onComplete, onToggle }: ScriptureReadingRowProps) {
  const styles = useThemedStyles(styleSheet);
  const contentHeight = useRef(0);
  const viewportHeight = useRef(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const readingType = titleCaseReadingType(reading.type);

  const updateEndState = useCallback((offsetY: number) => {
    if (contentHeight.current <= 0 || viewportHeight.current <= 0) return;
    if (offsetY + viewportHeight.current >= contentHeight.current - 24) setHasReachedEnd(true);
  }, []);

  const toggle = useCallback(() => {
    setSaveError(null);
    onToggle();
  }, [onToggle]);

  const complete = useCallback(async () => {
    if (completed || !hasReachedEnd) return;
    setIsCompleting(true);
    setSaveError(null);
    try {
      await onComplete(reading.id);
    } catch {
      setSaveError("Your reading could not be saved. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  }, [completed, hasReachedEnd, onComplete, reading.id]);

  return (
    <View style={[styles.row, expanded && styles.rowExpanded]}>
      <Pressable
        accessibilityHint={expanded ? "Collapses this Scripture reading." : "Expands this Scripture reading."}
        accessibilityLabel={`${expanded ? "Collapse" : "Expand"} ${readingType}, ${reading.citation}`}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={toggle}
        style={({ pressed }) => [styles.rowHeader, pressed && styles.pressed]}
      >
        <View style={[styles.icon, completed && styles.completedIcon]}>
          <MaterialCommunityIcons
            color={completed ? theme.colors.text.success : theme.colors.gold.pale}
            name="book-open-page-variant-outline"
            size={19}
          />
        </View>
        <View style={styles.copy}>
          <Text style={styles.type}>{readingType}</Text>
          <Text style={styles.citation}>{reading.citation}</Text>
        </View>
        <View style={styles.disclosure}>
          <Text style={[styles.read, completed && styles.completedText]}>{completed ? "Read" : "Read"}</Text>
          {completed ? (
            <MaterialCommunityIcons color={theme.colors.semantic.success} name="check-circle" size={19} />
          ) : (
            <MaterialCommunityIcons
              color={theme.colors.text.muted}
              name={expanded ? "chevron-up" : "chevron-down"}
              size={22}
            />
          )}
        </View>
      </Pressable>
      {expanded ? (
        <View style={styles.expandedContent}>
          <ScrollView
            accessibilityLabel={`${readingType}, ${reading.citation}, Scripture text`}
            nestedScrollEnabled
            onContentSizeChange={(_, height) => {
              contentHeight.current = height;
              updateEndState(0);
            }}
            onLayout={(event) => {
              viewportHeight.current = event.nativeEvent.layout.height;
              updateEndState(0);
            }}
            onScroll={(event) => updateEndState(event.nativeEvent.contentOffset.y)}
            scrollEventThrottle={16}
            style={styles.readingScroll}
          >
            <Text selectable style={styles.scripture}>
              {reading.text}
            </Text>
            <View accessibilityLabel="End of reading" style={styles.endMarker}>
              <MaterialCommunityIcons color={theme.colors.semantic.success} name="check-circle-outline" size={18} />
              <Text style={styles.endCopy}>You&apos;ve reached the end of this reading.</Text>
            </View>
          </ScrollView>
          {saveError ? (
            <Text accessibilityRole="alert" style={styles.saveError}>
              {saveError}
            </Text>
          ) : null}
          <Button
            accessibilityHint={
              hasReachedEnd || completed ? undefined : "Scroll to the end of the reading before marking it complete."
            }
            disabled={!hasReachedEnd || completed}
            fullWidth
            loading={isCompleting}
            onPress={() => void complete()}
            size="sm"
            variant={completed ? "outline" : "primary"}
          >
            {completed ? "Completed" : hasReachedEnd ? "Mark as Read" : "Read to the End"}
          </Button>
        </View>
      ) : null}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  citation: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[0.5],
  },
  completedIcon: {
    backgroundColor: "rgba(105, 196, 124, 0.12)",
    borderColor: theme.colors.semantic.successBorder,
  },
  completedText: { color: theme.colors.text.success },
  copy: { flex: 1, minWidth: theme.spacing[0], paddingRight: theme.spacing[2] },
  disclosure: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[1],
    minHeight: 44,
    paddingLeft: theme.spacing[1],
  },
  endCopy: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.success,
    flex: 1,
    marginLeft: theme.spacing[2],
  },
  endMarker: {
    alignItems: "center",
    borderTopColor: theme.colors.border.subtle,
    borderTopWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    marginTop: theme.spacing[4],
    paddingTop: theme.spacing[3],
  },
  expandedContent: {
    borderTopColor: theme.colors.border.subtle,
    borderTopWidth: theme.borderWidths.hairline,
    marginLeft: theme.spacing[7],
    paddingBottom: theme.spacing[3],
    paddingTop: theme.spacing[3],
  },
  icon: {
    alignItems: "center",
    backgroundColor: "rgba(197, 142, 56, 0.09)",
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.md,
    borderWidth: theme.borderWidths.thin,
    height: 40,
    justifyContent: "center",
    marginRight: theme.spacing[3],
    width: 40,
  },
  pressed: { opacity: theme.opacity.muted },
  read: { ...theme.typography.label, color: theme.colors.gold.pale },
  readingScroll: { maxHeight: 280 },
  row: {
    borderTopColor: theme.colors.border.subtle,
    borderTopWidth: theme.borderWidths.hairline,
    paddingVertical: theme.spacing[3],
  },
  rowExpanded: { backgroundColor: "rgba(13, 47, 74, 0.32)" },
  rowHeader: { alignItems: "center", flexDirection: "row", minHeight: 44 },
  saveError: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.danger,
    marginBottom: theme.spacing[2],
  },
  scripture: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamilies.devotional,
    lineHeight: theme.lineHeights.lg,
  },
  type: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.muted,
    letterSpacing: theme.letterSpacing.wide,
  },
}));
