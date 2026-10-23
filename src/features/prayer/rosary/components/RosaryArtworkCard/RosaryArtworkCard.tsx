import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, useWindowDimensions, View, type ImageSourcePropType } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

export interface RosaryArtworkCardProps {
  imageSource?: ImageSourcePropType;
}

/** Calculates a responsive devotional frame height while preserving useful phone, tablet, and desktop bounds. */
function getArtworkFrameHeight(width: number, height: number) {
  const maximumHeight = width >= theme.breakpoints.desktop ? 480 : width >= theme.breakpoints.tablet ? 420 : 340;
  const minimumHeight = width > height ? 180 : 220;

  return Math.min(maximumHeight, Math.max(minimumHeight, height * 0.36));
}

/** Displays the active Rosary background artwork in full, without the prayer screen's crop or dark scrim. */
export function RosaryArtworkCard({ imageSource }: RosaryArtworkCardProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { height, width } = useWindowDimensions();
  const [imageFailed, setImageFailed] = useState(false);
  const frameHeight = getArtworkFrameHeight(width, height);

  useEffect(() => {
    setImageFailed(false);
  }, [imageSource]);

  /** Replaces a failed artwork request with a localized, accessible unavailable state. */
  const handleImageError = useCallback(() => setImageFailed(true), []);

  return (
    <View style={[styles.frame, { height: frameHeight }]} testID="rosary-artwork-card">
      {!imageSource || imageFailed ? (
        <View
          accessibilityLabel={t("rosary.cards.devotionalImageUnavailable")}
          accessibilityRole="image"
          accessible
          style={styles.fallback}
        >
          <Text style={styles.fallbackText}>{t("rosary.cards.devotionalImageUnavailable")}</Text>
        </View>
      ) : (
        <Image
          accessibilityLabel={t("rosary.cards.currentArtworkAccessibilityLabel")}
          accessible
          cachePolicy="memory-disk"
          contentFit="contain"
          onError={handleImageError}
          source={imageSource}
          style={styles.image}
          testID="rosary-artwork-image"
          transition={reduceMotion ? 0 : 180}
        />
      )}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  frame: {
    backgroundColor: "transparent",
    borderRadius: theme.radii.xl,
    borderWidth: 0,
    minWidth: 0,
    overflow: "hidden",
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  fallback: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing[6],
  },
  fallbackText: {
    ...theme.typography.bodySmall,
    color: theme.rosary.colors.immersiveSecondary,
    textAlign: "center",
  },
}));
