import Feather from "@expo/vector-icons/Feather";
import { Image, type ImageSource } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Confetti } from "@/components/ui/Confetti";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

export type AchievementAlertProps = {
  badgeArtwork?: ImageSource | number | null;
  message: string;
  onDismiss: () => void;
};

/** Renders a dismissible, celebratory achievement message with a non-interactive confetti burst. */
export function AchievementAlert({ badgeArtwork = null, message, onDismiss }: AchievementAlertProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const [hasArtworkError, setHasArtworkError] = useState(false);

  useEffect(() => {
    setHasArtworkError(false);
  }, [badgeArtwork]);

  /** Hides an unavailable badge image so the stable award icon remains visible. */
  const handleArtworkError = useCallback(() => {
    setHasArtworkError(true);
  }, []);

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={styles.container}
      testID="achievement-alert"
    >
      <View style={styles.alert}>
        <View accessible={false} style={styles.icon}>
          {badgeArtwork && !hasArtworkError ? (
            <Image
              accessible={false}
              contentFit="contain"
              onError={handleArtworkError}
              source={badgeArtwork}
              style={styles.badgeArtwork}
              testID="achievement-badge-artwork"
            />
          ) : (
            <Feather
              color={theme.rosary.colors.goldBright}
              name="award"
              size={theme.sizes.iconMedium}
              testID="achievement-icon-fallback"
            />
          )}
        </View>
        <Text style={styles.message}>{message}</Text>
        <Pressable
          accessibilityLabel={t("common.dismissMessage")}
          accessibilityRole="button"
          hitSlop={theme.spacing[2]}
          onPress={onDismiss}
          style={styles.dismiss}
        >
          <Feather accessible={false} color={theme.colors.text.secondary} name="x" size={theme.sizes.iconSmall} />
        </Pressable>
      </View>
      <Confetti particleCount={28} testID="achievement-confetti" />
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  alert: {
    alignItems: "center",
    backgroundColor: theme.colors.semantic.successSurface,
    borderColor: theme.colors.semantic.successBorder,
    borderRadius: theme.radii.lg,
    borderWidth: theme.borderWidths.thin,
    flexDirection: "row",
    minHeight: theme.sizes.touchTarget + theme.spacing[3],
    overflow: "hidden",
    paddingLeft: theme.spacing[3],
  },
  badgeArtwork: { height: "100%", width: "100%" },
  container: {
    elevation: 4,
    position: "relative",
    shadowColor: theme.colors.text.primary,
    shadowOffset: { height: theme.spacing[1], width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: theme.spacing[3],
  },
  dismiss: {
    alignItems: "center",
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    marginRight: theme.spacing[1],
    width: theme.sizes.touchTarget,
  },
  icon: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderRadius: theme.radii.pill,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  message: { ...theme.typography.bodySmall, color: theme.colors.text.primary, flex: 1, marginLeft: theme.spacing[3] },
}));
