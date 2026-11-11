import type { PropsWithChildren, ReactNode, RefObject } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PageHeader } from "@/components";
import { useFloatingTabBarInset } from "@/components/navigation/FloatingTabBarInset";
import type { PageHeaderVariant } from "@/components";
import { SacredAtmosphere } from "@/components/ui/SacredAtmosphere";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

type ScreenShellProps = PropsWithChildren<{
  actions?: ReactNode;
  backAccessibilityLabel?: string;
  background?: ReactNode;
  bottomAction?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  description: string;
  eyebrow?: string;
  headerVariant?: PageHeaderVariant;
  onBack?: () => void;
  overlay?: ReactNode;
  showLogo?: boolean;
  scrollViewRef?: RefObject<ScrollView | null>;
  testID?: string;
  title?: string;
}>;

/**
 * Displays the shared application header and a scrollable screen body.
 * Warm light remains behind the UI while non-interactive dust passes above
 * normal screen content.
 *
 * @param props Header, scrollable body, optional persistent bottom action, background content, and viewport overlay.
 * @returns A safe-area screen shell with its content above the background.
 */
export function ScreenShell({
  actions,
  backAccessibilityLabel,
  background,
  bottomAction,
  children,
  contentContainerStyle,
  description,
  eyebrow,
  headerVariant,
  onBack,
  overlay,
  showLogo,
  scrollViewRef,
  testID,
  title,
}: ScreenShellProps) {
  const styles = useThemedStyles(styleSheet);
  const responsive = useResponsiveLayout();
  const floatingTabBarInset = useFloatingTabBarInset();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea} testID={testID}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        testID="screen-shell-scroll-view"
      >
        <View style={styles.page}>
          <View pointerEvents="none" style={styles.backgroundLayer}>
            {background}
            <SacredAtmosphere />
          </View>
          <View
            style={[
              styles.content,
              { paddingHorizontal: responsive.gutter },
              floatingTabBarInset ? { paddingBottom: theme.spacing[8] + floatingTabBarInset } : null,
              contentContainerStyle,
            ]}
          >
            <PageHeader
              actions={actions}
              backAccessibilityLabel={backAccessibilityLabel}
              description={description}
              eyebrow={eyebrow}
              onBack={onBack}
              showLogo={showLogo}
              title={title}
              variant={headerVariant}
            />
            {children}
          </View>
        </View>
      </ScrollView>
      <SacredAtmosphere layer="foregroundDust" testID="sacred-atmosphere-foreground" />
      {bottomAction ? (
        <SafeAreaView edges={["bottom"]} style={styles.bottomAction} testID="screen-shell-bottom-action">
          <View style={[styles.bottomActionContent, { paddingHorizontal: responsive.gutter }]}>{bottomAction}</View>
        </SafeAreaView>
      ) : null}
      {overlay ? (
        <View
          pointerEvents="box-none"
          style={[styles.overlay, { paddingHorizontal: responsive.gutter }]}
          testID="screen-shell-overlay"
        >
          <View style={styles.overlayContent}>{overlay}</View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  bottomAction: {
    backgroundColor: theme.colors.surface.primary,
    borderTopColor: theme.colors.border.default,
    borderTopWidth: theme.borderWidths.thin,
    zIndex: theme.zIndex.drawer,
  },
  bottomActionContent: {
    alignSelf: "center",
    maxWidth: theme.sizes.contentMaxWidth,
    paddingVertical: theme.spacing[3],
    width: "100%",
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    position: "relative",
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollView: { flex: 1 },
  page: {
    flexGrow: 1,
    position: "relative",
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    alignSelf: "center",
    maxWidth: theme.sizes.contentMaxWidth,
    paddingBottom: theme.spacing[8],
    paddingHorizontal: theme.spacing[4],
    position: "relative",
    width: "100%",
    zIndex: theme.zIndex.card,
  },
  overlay: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: theme.zIndex.modal,
  },
  overlayContent: {
    alignSelf: "center",
    maxWidth: theme.sizes.contentMaxWidth,
    paddingTop: theme.spacing[2],
    width: "100%",
  },
}));
