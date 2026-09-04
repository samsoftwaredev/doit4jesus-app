import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { PropsWithChildren, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SacredAtmosphere } from "@/components/ui/SacredAtmosphere";
import { theme } from "@/theme/tokens";

type ScreenShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  subtitle: string;
  headerAccessory?: ReactNode;
  background?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

/**
 * Displays the shared application header and a scrollable screen body.
 * Warm light remains behind the UI while non-interactive dust passes above
 * normal screen content.
 *
 * @param props Header, body, and optional background content for the screen.
 * @returns A safe-area screen shell with its content above the background.
 */
export function ScreenShell({
  eyebrow,
  title,
  subtitle,
  headerAccessory,
  background,
  children,
  contentContainerStyle,
}: ScreenShellProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View pointerEvents="none" style={styles.backgroundLayer}>
            {background}
            <SacredAtmosphere />
          </View>
          <View style={[styles.content, contentContainerStyle]}>
            <View style={styles.header}>
              <View style={styles.brandRow}>
                <View style={styles.brandIcon}>
                  <MaterialCommunityIcons
                    color={theme.colors.gold.pale}
                    name="shield-cross"
                    size={theme.sizes.iconMedium}
                  />
                </View>
                <Text style={styles.brand}>doit4Jesus</Text>
              </View>
              <View style={styles.headingRow}>
                <View style={styles.heading}>
                  {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
                {headerAccessory}
              </View>
            </View>
            {children}
          </View>
        </View>
      </ScrollView>
      <SacredAtmosphere layer="foregroundDust" testID="sacred-atmosphere-foreground" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  brand: {
    ...theme.typography.heading3,
    color: theme.colors.text.primary,
  },
  brandIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surface.tertiary,
    borderColor: theme.colors.gold.strong,
    borderRadius: theme.radii.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.sizes.touchTarget,
    justifyContent: "center",
    width: theme.sizes.touchTarget,
  },
  brandRow: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  header: {
    paddingBottom: theme.spacing[6],
    paddingTop: theme.spacing[5],
  },
  headingRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    flex: 1,
    minWidth: theme.spacing[0],
    paddingRight: theme.spacing[3],
  },
  eyebrow: {
    ...theme.typography.labelSmall,
    color: theme.colors.text.link,
    marginBottom: theme.spacing[1],
  },
  title: {
    ...theme.typography.heading1,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.muted,
    marginTop: theme.spacing[1],
  },
});
