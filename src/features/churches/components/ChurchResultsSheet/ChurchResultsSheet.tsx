import Feather from "@expo/vector-icons/Feather";
import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { IconButton } from "@/components";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

export type ChurchResultsSheetSnap = "expanded" | "middle" | "peek";

export type ChurchResultsSheetProps = {
  children: ReactNode;
  onSnapChange: (snap: ChurchResultsSheetSnap) => void;
  panelHeight: number;
  snap: ChurchResultsSheetSnap;
  summary: string;
  title: string;
};

type SheetHeights = Record<ChurchResultsSheetSnap, number>;

/** Derives bounded sheet heights while retaining enough map space at the middle position. */
export function getChurchResultsSheetHeights(panelHeight: number): SheetHeights {
  const peek = 88;
  const expanded = Math.max(peek, panelHeight - 32);
  const middle = Math.min(expanded, Math.max(240, Math.round(panelHeight * 0.5)));
  return { expanded, middle, peek };
}

/** Finds the nearest stable sheet position after a drag ends. */
function getClosestSnap(height: number, heights: SheetHeights): ChurchResultsSheetSnap {
  return (Object.keys(heights) as ChurchResultsSheetSnap[]).reduce((closest, candidate) =>
    Math.abs(heights[candidate] - height) < Math.abs(heights[closest] - height) ? candidate : closest,
  );
}

/** Presents church results over the map with gesture and assistive-technology snap controls. */
export function ChurchResultsSheet({
  children,
  onSnapChange,
  panelHeight,
  snap,
  summary,
  title,
}: ChurchResultsSheetProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const heights = useMemo(() => getChurchResultsSheetHeights(panelHeight), [panelHeight]);
  const sheetHeight = useSharedValue(heights[snap]);
  const dragStartHeight = useSharedValue(heights[snap]);

  useEffect(() => {
    sheetHeight.value = withTiming(heights[snap], { duration: 180 });
  }, [heights, sheetHeight, snap]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          dragStartHeight.value = sheetHeight.value;
        })
        .onUpdate((event) => {
          sheetHeight.value = Math.max(
            heights.peek,
            Math.min(heights.expanded, dragStartHeight.value - event.translationY),
          );
        })
        .onEnd(() => {
          const nextSnap = getClosestSnap(sheetHeight.value, heights);
          sheetHeight.value = withTiming(heights[nextSnap], { duration: 180 });
          runOnJS(onSnapChange)(nextSnap);
        }),
    [dragStartHeight, heights, onSnapChange, sheetHeight],
  );

  const animatedStyle = useAnimatedStyle(() => ({ height: sheetHeight.value }));

  /** Toggles the drawer between fully open and closed while retaining drag-based middle snapping. */
  function toggleSheet(): void {
    onSnapChange(snap === "peek" ? "expanded" : "peek");
  }

  return (
    <Animated.View style={[styles.sheet, animatedStyle]}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.header}>
          <View accessible style={styles.headerCopy}>
            <Text accessibilityRole="header" style={styles.title}>
              {title}
            </Text>
            <Text style={styles.summary}>{summary}</Text>
          </View>
          <IconButton
            accessibilityLabel={t(snap === "peek" ? "churches.results.expandSheet" : "churches.results.collapseSheet")}
            onPress={toggleSheet}
          >
            <Feather
              accessible={false}
              color={theme.colors.icon.primary}
              name={snap === "peek" ? "chevron-up" : "chevron-down"}
              size={20}
            />
          </IconButton>
        </View>
      </GestureDetector>
      {snap !== "peek" ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" style={styles.scroll}>
          {children}
        </ScrollView>
      ) : null}
    </Animated.View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  content: { gap: theme.spacing[3], padding: theme.spacing[4], paddingTop: theme.spacing[2] },
  header: {
    alignItems: "center",
    borderBottomColor: theme.colors.border.subtle,
    borderBottomWidth: theme.borderWidths.hairline,
    flexDirection: "row",
    gap: theme.spacing[2],
    minHeight: 88,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  headerCopy: { flex: 1, minWidth: 0 },
  scroll: { flex: 1 },
  sheet: {
    backgroundColor: theme.colors.surface.primary,
    borderColor: theme.colors.border.default,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    borderWidth: theme.borderWidths.thin,
    bottom: 0,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    zIndex: theme.zIndex.sticky,
    ...theme.shadows.large,
  },
  summary: { ...theme.typography.caption, color: theme.colors.text.secondary },
  title: { ...theme.typography.heading3, color: theme.colors.text.primary },
}));
