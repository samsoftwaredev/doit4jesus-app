import type { PropsWithChildren, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  subtitle: string;
  headerAccessory?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export function ScreenShell({
  eyebrow,
  title,
  subtitle,
  headerAccessory,
  children,
  contentContainerStyle,
}: ScreenShellProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.content}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF8FC",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    alignSelf: "center",
    maxWidth: 760,
    paddingBottom: 32,
    paddingHorizontal: 20,
    width: "100%",
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 26,
    paddingTop: 20,
  },
  heading: {
    flex: 1,
    paddingRight: 14,
  },
  eyebrow: {
    color: "#8A719D",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  title: {
    color: "#28232E",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  subtitle: {
    color: "#736D78",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 7,
  },
});
