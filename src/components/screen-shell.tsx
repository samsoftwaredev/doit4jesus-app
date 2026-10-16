import type { PropsWithChildren, ReactNode, RefObject } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PageHeader } from "@/components";
import type { PageHeaderVariant } from "@/components";
import { SacredAtmosphere } from "@/components/ui/SacredAtmosphere";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

type ScreenShellProps = PropsWithChildren<{
  actions?: ReactNode;
  backAccessibilityLabel?: string;
  background?: ReactNode;
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
 * @param props Header, body, optional background content, and an interactive viewport overlay for the screen.
 * @returns A safe-area screen shell with its content above the background.
 */
export function ScreenShell({
  actions,
  backAccessibilityLabel,
  background,
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

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea} testID={testID}>
      <ScrollView contentContainerStyle={styles.scrollContent} ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View pointerEvents="none" style={styles.backgroundLayer}>
            {background}
            <SacredAtmosphere />
          </View>
          <View style={[styles.content, { paddingHorizontal: responsive.gutter }, contentContainerStyle]}>
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
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    position: "relative",
  },
  scrollContent: {
    flexGrow: 1,
  },
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
