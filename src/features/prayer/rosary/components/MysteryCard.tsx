import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";
import type { RosaryMystery } from "@/features/prayer/rosary/types";

interface MysteryCardProps {
  maxImageHeight?: number;
  mystery?: RosaryMystery;
}

/** A bundled image avoids validating a remote or malformed BlurHash during initial render. */
const devotionalPlaceholder = require("../../../../assets/flowers/whiteLily.png");
const MYSTERY_IMAGE_ASPECT_RATIO = 575 / 784;

/**
 * Renders a mystery card whose devotional image scales at its portrait ratio without exceeding the available height.
 */
export function MysteryCard({ maxImageHeight, mystery }: MysteryCardProps) {
  const styles = useThemedStyles(styleSheet);
  const reduceMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [mystery?.id]);

  if (!mystery) {
    return (
      <View accessibilityLabel="No Rosary mystery available" style={styles.card}>
        <Text style={styles.emptyTitle}>No mystery available</Text>
        <Text style={styles.emptyCopy}>Please choose a Rosary mystery to begin praying.</Text>
      </View>
    );
  }

  return (
    <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(220)} key={mystery.id} style={styles.card}>
      <Text style={styles.label}>CURRENT MYSTERY</Text>
      <Text accessibilityRole="header" style={styles.title}>
        {mystery.title}
      </Text>
      <Text style={styles.category}>{mystery.category}</Text>

      <View
        style={[
          styles.imageFrame,
          maxImageHeight === undefined ? undefined : { maxWidth: maxImageHeight * MYSTERY_IMAGE_ASPECT_RATIO },
        ]}
        testID="mystery-image-frame"
      >
        {imageFailed ? (
          <View accessibilityLabel="Devotional image unavailable" style={styles.imageFallback}>
            <Feather color={theme.rosary.colors.gold} name="image" size={theme.sizes.iconLarge} />
            <Text style={styles.fallbackText}>Devotional image unavailable</Text>
          </View>
        ) : (
          <Image
            accessibilityLabel={mystery.imageAlt}
            accessible
            cachePolicy="memory-disk"
            contentFit="cover"
            onError={() => setImageFailed(true)}
            placeholder={devotionalPlaceholder}
            placeholderContentFit="cover"
            source={mystery.imageSource}
            style={styles.image}
            transition={reduceMotion ? 0 : 220}
          />
        )}
      </View>
    </Animated.View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  card: {
    backgroundColor: theme.rosary.colors.card,
    borderColor: "rgba(230, 186, 100, 0.48)",
    borderRadius: theme.radii.xl,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    overflow: "hidden",
    padding: theme.spacing[4],
    ...theme.shadows.medium,
  },
  label: {
    ...theme.typography.labelSmall,
    color: theme.rosary.colors.gold,
    letterSpacing: theme.letterSpacing.widest,
  },
  title: {
    ...theme.typography.heading2,
    color: theme.colors.text.white,
    marginTop: theme.spacing[1],
  },
  category: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[0.5],
  },
  imageFrame: {
    alignSelf: "center",
    aspectRatio: MYSTERY_IMAGE_ASPECT_RATIO,
    backgroundColor: theme.rosary.colors.cardInset,
    borderColor: "rgba(230, 186, 100, 0.35)",
    borderRadius: theme.radii.lg,
    borderWidth: theme.rosary.borderWidths.goldHairline,
    marginTop: theme.spacing[3],
    overflow: "hidden",
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  imageFallback: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing[4],
  },
  fallbackText: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[2],
    textAlign: "center",
  },
  emptyTitle: {
    ...theme.typography.heading3,
    color: theme.colors.text.white,
  },
  emptyCopy: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.scripture,
    marginTop: theme.spacing[1],
  },
}));
