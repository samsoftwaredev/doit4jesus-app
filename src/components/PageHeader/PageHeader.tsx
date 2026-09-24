import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/components/IconButton";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useAppTheme } from "@/theme/AppThemeProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

export type PageHeaderVariant = "hero" | "compact";

export interface PageHeaderProps {
  actions?: ReactNode;
  backAccessibilityLabel?: string;
  description: string;
  eyebrow?: string;
  onBack?: () => void;
  showLogo?: boolean;
  style?: StyleProp<ViewStyle>;
  title?: string;
  variant?: PageHeaderVariant;
}

const companyLogoSources = {
  dark: require("../../../assets/svgs/whiteCompanyLogo.svg"),
  light: require("../../../assets/svgs/blackCompanyLogo.svg"),
} as const;

/**
 * Renders the shared hero or compact page heading with optional navigation, actions, and Home branding.
 *
 * @param props Header copy, navigation, actions, and branding options. A hero header may omit its title.
 * @returns An accessible page header whose branded actions share a row with the company logo.
 */
export function PageHeader({
  actions,
  backAccessibilityLabel,
  description,
  eyebrow,
  onBack,
  showLogo = false,
  style,
  title,
  variant = "hero",
}: PageHeaderProps) {
  const styles = useThemedStyles(styleSheet);
  const { t } = useTranslation();
  const { colorScheme } = useAppTheme();
  const { gutter, isLargeText, isNarrowPhone } = useResponsiveLayout();
  const stackHero = isLargeText || isNarrowPhone;
  const isCompact = variant === "compact";
  const resolvedBackAccessibilityLabel = backAccessibilityLabel ?? t("common.goBack");

  if (isCompact) {
    return (
      <View style={[styles.container, styles.compactContainer, { paddingHorizontal: gutter }, style]}>
        <View style={styles.compactSide}>
          {onBack ? (
            <IconButton accessibilityLabel={resolvedBackAccessibilityLabel} onPress={onBack}>
              <Feather
                accessible={false}
                color={theme.colors.icon.primary}
                name="chevron-left"
                size={theme.sizes.iconMedium}
              />
            </IconButton>
          ) : null}
        </View>
        <View style={styles.compactCopy}>
          {title ? (
            <Text accessibilityRole="header" numberOfLines={isLargeText ? undefined : 2} style={styles.compactTitle}>
              {title}
            </Text>
          ) : null}
          <Text style={styles.compactDescription}>{description}</Text>
        </View>
        <View style={[styles.compactSide, styles.compactActions]}>{actions}</View>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.heroContainer, style]}>
      {onBack ? (
        <View style={styles.heroBackRow}>
          <IconButton accessibilityLabel={resolvedBackAccessibilityLabel} onPress={onBack}>
            <Feather
              accessible={false}
              color={theme.colors.icon.primary}
              name="chevron-left"
              size={theme.sizes.iconMedium}
            />
          </IconButton>
        </View>
      ) : null}
      {showLogo ? (
        <View style={styles.brandRow} testID="page-header-brand-row">
          <Image
            accessibilityLabel="Do It for Jesus"
            accessibilityRole="image"
            accessible
            contentFit="contain"
            source={companyLogoSources[colorScheme]}
            style={styles.logo}
          />
          {actions ? <View style={styles.heroActions}>{actions}</View> : null}
        </View>
      ) : null}
      <View
        style={[styles.heroMainRow, !showLogo && stackHero && styles.heroMainRowStacked]}
        testID="page-header-main-row"
      >
        <View
          style={[
            styles.heroCopy,
            showLogo && styles.heroCopyBranded,
            !showLogo && stackHero && styles.heroCopyStacked,
          ]}
        >
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          {title ? (
            <Text accessibilityRole="header" style={styles.heroTitle}>
              {title}
            </Text>
          ) : null}
          <Text
            style={[styles.heroDescription, showLogo && styles.heroDescriptionBranded]}
            testID="page-header-description"
          >
            {description}
          </Text>
        </View>
        {!showLogo && actions ? (
          <View style={[styles.heroActions, stackHero && styles.heroActionsStacked]}>{actions}</View>
        ) : null}
      </View>
    </View>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  container: { width: "100%" },
  compactActions: { alignItems: "flex-end" },
  compactContainer: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    maxWidth: theme.sizes.contentMaxWidth,
    minHeight: theme.sizes.touchTarget + theme.spacing[5],
    paddingBottom: theme.spacing[2],
    paddingTop: theme.spacing[2],
  },
  compactCopy: {
    alignItems: "center",
    flex: 1,
    minWidth: theme.spacing[0],
    paddingHorizontal: theme.spacing[2],
  },
  compactDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[0.5],
    textAlign: "center",
  },
  compactSide: { minWidth: theme.sizes.touchTarget },
  compactTitle: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  eyebrow: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.link,
    marginBottom: theme.spacing[1],
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing[4],
  },
  heroActions: { flexShrink: 0 },
  heroActionsStacked: { alignSelf: "flex-start", marginTop: theme.spacing[3] },
  heroBackRow: { marginBottom: theme.spacing[3] },
  heroContainer: { paddingBottom: theme.spacing[6], paddingTop: theme.spacing[5] },
  heroCopy: { flex: 1, minWidth: theme.spacing[0], paddingRight: theme.spacing[3] },
  heroCopyBranded: { paddingRight: theme.spacing[0], width: "100%" },
  heroCopyStacked: { paddingRight: theme.spacing[0], width: "100%" },
  heroDescription: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
  },
  heroDescriptionBranded: { width: "100%" },
  heroMainRow: { alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between" },
  heroMainRowStacked: { flexDirection: "column" },
  heroTitle: { ...theme.typography.heading1, color: theme.colors.text.primary },
  logo: { height: 61, width: 112 },
}));
