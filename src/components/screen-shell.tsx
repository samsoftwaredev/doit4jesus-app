import type { PropsWithChildren, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "@/theme/tokens";

type ScreenShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  subtitle: string;
  headerAccessory?: ReactNode;
  background?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

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
          {background ? (
            <View pointerEvents="none" style={styles.backgroundLayer}>
              {background}
            </View>
          ) : null}
          <View style={[styles.content, contentContainerStyle]}>
            <View style={styles.header}>
              <View style={styles.heading}>
                {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
              {headerAccessory}
            </View>
            {children}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
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
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: theme.spacing[6],
    paddingTop: theme.spacing[5],
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
