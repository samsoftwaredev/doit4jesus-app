import type { ComponentProps, PropsWithChildren } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SacredAtmosphere } from "@/components/ui/SacredAtmosphere";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";

type AtmosphericSafeAreaViewProps = PropsWithChildren<
  ComponentProps<typeof SafeAreaView> & {
    includeAtmosphere?: boolean;
  }
>;

/**
 * Provides shared background light and foreground dust for a safe-area screen.
 * The wrapper preserves every SafeAreaView prop while the dust remains
 * non-interactive above normal screen content.
 *
 * @param props Standard SafeAreaView props, screen content, and optional atmosphere placement control.
 * @returns A safe-area screen with the shared atmospheric background.
 */
export function AtmosphericSafeAreaView({
  children,
  includeAtmosphere = true,
  style,
  ...safeAreaProps
}: AtmosphericSafeAreaViewProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <SafeAreaView {...safeAreaProps} style={[style, styles.safeArea]}>
      {includeAtmosphere ? <SacredAtmosphere /> : null}
      <View style={styles.content}>{children}</View>
      <SacredAtmosphere layer="foregroundDust" testID="sacred-atmosphere-foreground" />
    </SafeAreaView>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  safeArea: {
    position: "relative",
  },
  content: {
    flex: 1,
    zIndex: theme.zIndex.card,
  },
}));
