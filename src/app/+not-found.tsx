import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { Button, SacredAtmosphere } from "@/components/ui";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useAppTheme } from "@/theme/AppThemeProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

/** Renders an inviting lost-sheep recovery screen for every unmatched route. */
export default function NotFoundScreen() {
  const router = useRouter();
  const styles = useThemedStyles(styleSheet);
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const { gutter, isDesktop, isLandscape, isNarrowPhone, isTablet, width } = useResponsiveLayout();
  const useWideLayout = isDesktop || (isTablet && isLandscape);
  const artworkWidth = isDesktop ? 340 : isTablet ? 300 : isNarrowPhone ? 200 : 240;

  /** Replaces the invalid route so the missing page is not left in navigation history. */
  const handleReturnHome = useCallback(() => {
    router.replace("/");
  }, [router]);

  /** Returns to the prior route when possible, with home as a safe deep-link fallback. */
  const handleRetraceSteps = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  }, [router]);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.page}>
      <LinearGradient colors={theme.colors.gradients.landing} pointerEvents="none" style={styles.background} />
      <SacredAtmosphere />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: gutter }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.layout, useWideLayout && styles.layoutWide]}>
          <View style={[styles.artworkFrame, { maxWidth: Math.max(width - gutter * 2, 0), width: artworkWidth }]}>
            <Image
              accessibilityLabel={t("notFound.imageLabel")}
              accessible
              contentFit="cover"
              source={require("../../assets/images/lost-sheep-404.png")}
              style={styles.artwork}
            />
          </View>

          <View style={[styles.copy, useWideLayout && styles.copyWide]}>
            <Text style={styles.eyebrow}>{t("notFound.eyebrow")}</Text>
            <Text accessibilityRole="header" style={styles.title}>
              {t("notFound.title")}
            </Text>
            <Text style={styles.description}>{t("notFound.description")}</Text>

            <View style={[styles.actions, useWideLayout && styles.actionsWide]}>
              <Button
                fullWidth={!useWideLayout}
                onPress={handleReturnHome}
                size="lg"
                style={styles.actionButton}
                variant="success"
              >
                {t("notFound.returnHome")}
              </Button>
              <Button
                fullWidth={!useWideLayout}
                onPress={handleRetraceSteps}
                size="lg"
                style={styles.actionButton}
                variant="secondary"
              >
                {t("notFound.retraceSteps")}
              </Button>
            </View>

            <Text style={styles.wilderness}>{t("notFound.wilderness")}</Text>
          </View>
        </View>
      </ScrollView>

      <SacredAtmosphere layer="foregroundDust" testID="not-found-atmosphere-foreground" />
    </SafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  page: {
    backgroundColor: theme.colors.background.primary,
    flex: 1,
    position: "relative",
  },
  background: {
    ...StyleSheet.absoluteFill,
  },
  scrollContent: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: theme.spacing[8],
    paddingTop: theme.spacing[6],
  },
  layout: {
    alignItems: "center",
    gap: theme.spacing[6],
    maxWidth: theme.sizes.contentMaxWidth,
    width: "100%",
  },
  layoutWide: {
    flexDirection: "row",
    gap: theme.spacing[12],
    justifyContent: "center",
  },
  artworkFrame: {
    aspectRatio: 2 / 3,
    backgroundColor: theme.colors.surface.navyDeep,
    borderColor: theme.colors.border.warning,
    borderRadius: theme.radii["2xl"],
    borderWidth: theme.borderWidths.thin,
    overflow: "hidden",
    ...theme.shadows.large,
  },
  artwork: {
    height: "100%",
    width: "100%",
  },
  copy: {
    alignItems: "center",
    maxWidth: 500,
    minWidth: 0,
    width: "100%",
  },
  copyWide: {
    alignItems: "flex-start",
    flex: 1,
    width: undefined,
  },
  eyebrow: {
    ...theme.typography.label,
    color: theme.colors.text.warning,
    letterSpacing: theme.letterSpacing.widest,
    marginBottom: theme.spacing[2],
    textAlign: "center",
  },
  title: {
    ...theme.typography.displayMedium,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  description: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[3],
    textAlign: "center",
  },
  actions: {
    gap: theme.spacing[3],
    marginTop: theme.spacing[6],
    width: "100%",
  },
  actionsWide: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  actionButton: {
    minHeight: theme.sizes.touchTarget,
    minWidth: 190,
  },
  wilderness: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    fontStyle: "italic",
    marginTop: theme.spacing[5],
    textAlign: "center",
  },
}));
