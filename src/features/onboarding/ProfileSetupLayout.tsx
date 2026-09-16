import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import type { ComponentProps, ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { AtmosphericSafeAreaView } from "@/components/atmospheric-safe-area-view";
import { Button, Confetti } from "@/components/ui";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

type ProfileSetupLayoutProps = {
  children?: ReactNode;
  description: string;
  error?: string | null;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  nextDisabled?: boolean;
  nextLabel?: string;
  nextLoading?: boolean;
  onBack?: () => void;
  onNext: () => void;
  showConfetti?: boolean;
  step: number;
  title: string;
};

const totalSteps = 7;

/** Renders a profile-setup step over the shared atmosphere and optional confetti. */
export function ProfileSetupLayout({
  children,
  description,
  error,
  icon,
  nextDisabled,
  nextLabel,
  nextLoading,
  onBack,
  onNext,
  showConfetti = false,
  step,
  title,
}: ProfileSetupLayoutProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { gutter, isLandscape, isLargeText, isTablet } = useResponsiveLayout();
  const useWideLayout = isTablet && isLandscape && !isLargeText;

  return (
    <LinearGradient colors={theme.colors.gradients.onboarding} style={styles.background}>
      <AtmosphericSafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={0}
          style={styles.keyboardView}
        >
          <ScrollView
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View pointerEvents="none" style={styles.decorativeGlow} />
            <View style={[styles.page, { paddingHorizontal: gutter }, isTablet && styles.pageTablet]}>
              <View style={styles.topBar}>
                {onBack ? (
                  <Pressable
                    accessibilityLabel={t("onboarding.back")}
                    accessibilityRole="button"
                    hitSlop={theme.spacing[2]}
                    onPress={onBack}
                    style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                  >
                    <Feather color={theme.colors.text.primary} name="chevron-left" size={theme.sizes.iconMedium} />
                  </Pressable>
                ) : (
                  <View style={styles.backPlaceholder} />
                )}
                <View style={styles.backPlaceholder} />
              </View>

              <View style={styles.content}>
                <View style={[styles.setupBody, useWideLayout && styles.setupBodyWide]}>
                  <View style={[styles.heading, useWideLayout && styles.headingWide]}>
                    <View style={styles.iconHalo}>
                      <View style={styles.iconCircle}>
                        <MaterialCommunityIcons
                          accessible={false}
                          color={theme.rosary.colors.goldBright}
                          name={icon}
                          size={theme.sizes.iconLarge}
                        />
                      </View>
                    </View>
                    <Text accessibilityRole="header" style={styles.title}>
                      {title}
                    </Text>
                    <Text style={styles.description}>{description}</Text>
                  </View>

                  <View style={[styles.form, useWideLayout && styles.formWide]}>{children}</View>
                </View>

                <View style={styles.footer}>
                  {error ? (
                    <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.error}>
                      {error}
                    </Text>
                  ) : null}
                  <ProfileSetupProgress step={step} />
                  <Button
                    disabled={nextDisabled}
                    fullWidth
                    loading={nextLoading}
                    onPress={onNext}
                    rightIcon={
                      <Feather
                        accessible={false}
                        color={theme.colors.text.white}
                        name="chevron-right"
                        size={theme.sizes.iconMedium}
                      />
                    }
                    size="lg"
                    style={styles.nextButton}
                    testID="profile-setup-next"
                  >
                    {nextLabel ?? t("common.next")}
                  </Button>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </AtmosphericSafeAreaView>
      {showConfetti ? <Confetti particleCount={48} testID="profile-setup-confetti" /> : null}
    </LinearGradient>
  );
}

/** Announces and renders the current position across language and profile setup. */
export function ProfileSetupProgress({ step }: { step: number }) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  return (
    <View accessibilityLabel={t("common.stepProgress", { step, total: totalSteps })} accessible style={styles.progress}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const selected = index + 1 === step;
        return (
          <View
            accessibilityElementsHidden
            key={index}
            style={[styles.dot, selected && styles.activeDot]}
            testID={`profile-setup-progress-${index + 1}`}
          />
        );
      })}
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  activeDot: {
    backgroundColor: theme.rosary.colors.goldBright,
    borderColor: theme.rosary.colors.goldBright,
    transform: [{ scale: 1.18 }],
  },
  background: { flex: 1 },
  backButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderColor: theme.colors.border.default,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.hairline,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  backPlaceholder: { height: theme.sizes.touchTarget, width: theme.sizes.touchTarget },
  content: { flex: 1, width: "100%" },
  decorativeGlow: {
    backgroundColor: "rgba(230, 186, 100, 0.05)",
    borderRadius: theme.radii.pill,
    height: 320,
    position: "absolute",
    right: -150,
    top: -130,
    width: 320,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[2],
    maxWidth: 390,
    textAlign: "center",
  },
  dot: {
    backgroundColor: theme.colors.transparent,
    borderColor: theme.colors.border.interactive,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.spacing[2.5],
    width: theme.spacing[2.5],
  },
  error: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.danger,
    textAlign: "center",
  },
  footer: { gap: theme.spacing[4], marginTop: "auto", paddingTop: theme.spacing[7] },
  form: { gap: theme.spacing[3], marginTop: theme.spacing[7], width: "100%" },
  formWide: { flex: 1, marginTop: theme.spacing[3], minWidth: 0 },
  heading: { alignItems: "center", marginTop: theme.spacing[3] },
  headingWide: { flex: 1, minWidth: 0 },
  iconCircle: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.rosary.colors.goldMuted,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.spacing[16],
    justifyContent: "center",
    width: theme.spacing[16],
  },
  iconHalo: {
    alignItems: "center",
    backgroundColor: "rgba(230, 186, 100, 0.08)",
    borderRadius: theme.radii.pill,
    height: theme.spacing[20],
    justifyContent: "center",
    marginBottom: theme.spacing[4],
    width: theme.spacing[20],
  },
  keyboardView: { flex: 1 },
  nextButton: { backgroundColor: theme.colors.brand.primaryDark, borderColor: theme.colors.brand.primaryLight },
  page: {
    alignSelf: "center",
    flex: 1,
    maxWidth: 560,
    minHeight: "100%",
    paddingBottom: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    width: "100%",
  },
  pageTablet: { maxWidth: 720 },
  pressed: { opacity: theme.opacity.pressed, transform: [{ scale: 0.97 }] },
  progress: { alignItems: "center", flexDirection: "row", gap: theme.spacing[2], justifyContent: "center" },
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  setupBody: { width: "100%" },
  setupBodyWide: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing[8],
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamilies.devotional,
    textAlign: "center",
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: theme.spacing[2],
  },
}));
