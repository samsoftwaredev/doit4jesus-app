import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import type { DemonCatalogItem } from "@/features/demons";
import { getDemonArtwork } from "@/features/demons";
import { theme } from "@/theme/tokens";

import { CARD_BG, styles } from "./BattleDemonRoster.styles";

interface BattleDemonRosterProps {
  demons: ReadonlyArray<DemonCatalogItem>;
  onSelect: (demon: DemonCatalogItem) => void;
  selectedCode?: string;
}

export function BattleDemonRoster({
  demons,
  onSelect,
  selectedCode,
}: BattleDemonRosterProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const EDGE_THRESHOLD = 4;
  const showLeftFade = scrollX > EDGE_THRESHOLD;
  const showRightFade =
    contentWidth - containerWidth - scrollX > EDGE_THRESHOLD;

  const cols =
    screenWidth >= theme.breakpoints.desktop
      ? 3
      : screenWidth >= theme.breakpoints.tablet
        ? 2.5
        : 1.5;
  const gap = theme.spacing[3];
  const tileWidth =
    containerWidth > 0 ? (containerWidth - gap * (cols - 1)) / cols : undefined;

  function handleLayout(e: LayoutChangeEvent) {
    setContainerWidth(e.nativeEvent.layout.width);
  }

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setScrollX(e.nativeEvent.contentOffset.x);
  }

  return (
    <View>
      <View onLayout={handleLayout} style={styles.scrollWrapper}>
        <ScrollView
          contentContainerStyle={styles.rosterContent}
          horizontal
          nestedScrollEnabled
          onContentSizeChange={(w) => setContentWidth(w)}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
        >
          {demons.map((demon) => {
            const isSelected = demon.code === selectedCode;
            const artwork = getDemonArtwork(demon);

            return (
              <Pressable
                accessibilityLabel={`Select ${demon.name}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                key={demon.id}
                onPress={() => onSelect(demon)}
                style={({ pressed }) => [
                  styles.demonTile,
                  tileWidth != null ? { width: tileWidth } : undefined,
                  isSelected && styles.demonTileSelected,
                  pressed && styles.demonTilePressed,
                ]}
              >
                <View style={styles.imageFrame}>
                  {artwork ? (
                    <Image
                      accessible={false}
                      contentFit="contain"
                      source={artwork}
                      style={styles.image}
                    />
                  ) : null}
                </View>
                <Text numberOfLines={2} style={styles.name}>
                  {demon.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {showLeftFade ? (
          <LinearGradient
            colors={[CARD_BG, "transparent"]}
            end={{ x: 1, y: 0 }}
            pointerEvents="none"
            start={{ x: 0, y: 0 }}
            style={styles.fadeLeft}
          />
        ) : null}
        {showRightFade ? (
          <LinearGradient
            colors={["transparent", CARD_BG]}
            end={{ x: 1, y: 0 }}
            pointerEvents="none"
            start={{ x: 0, y: 0 }}
            style={styles.fadeRight}
          />
        ) : null}
      </View>
    </View>
  );
}
