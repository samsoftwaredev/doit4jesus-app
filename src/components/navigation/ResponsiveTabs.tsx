import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { Platform, useWindowDimensions } from "react-native";

import { useAppTheme } from "@/theme/AppThemeProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const tabArtworkSources = {
  community: require("../../assets/tabs/community.png"),
  home: require("../../assets/tabs/home.png"),
  prayer: require("../../assets/tabs/prayer.png"),
  profile: require("../../assets/tabs/profile.png"),
} as const;

type TabArtworkIconProps = {
  focused: boolean;
  size: number;
  source: number;
};

/** Renders decorative tab artwork while leaving the route label as the accessible name. */
function TabArtworkIcon({ focused, size, source }: TabArtworkIconProps) {
  const styles = useThemedStyles(styleSheet);
  return (
    <Image
      accessible={false}
      contentFit="cover"
      source={source}
      style={[
        styles.tabArtwork,
        {
          height: size,
          opacity: focused ? theme.opacity.full : theme.opacity.muted,
          width: size,
        },
      ]}
    />
  );
}

/** Keeps bottom tabs through tablet widths and presents an expanded side rail on desktop. */
export function ResponsiveTabs() {
  const { theme: appTheme } = useAppTheme();
  const { fontScale, width } = useWindowDimensions();
  const isDesktop = width >= theme.breakpoints.desktop;
  const scaledBottomBarHeight =
    theme.sizes.bottomNavigationHeight +
    (Platform.OS === "ios" ? theme.spacing[5] : 0) +
    Math.max(0, Math.ceil((fontScale - 1) * theme.spacing[5]));

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: appTheme.colors.background.primary,
        },
        tabBarAccessibilityLabel: "Primary navigation",
        tabBarActiveTintColor: appTheme.colors.icon.active,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: appTheme.colors.icon.muted,
        tabBarItemStyle: isDesktop
          ? {
              borderRadius: theme.radii.md,
              flexGrow: 0,
              minHeight: fontScale >= 1.3 ? theme.spacing[16] : theme.spacing[14],
              width: "100%",
            }
          : { minHeight: theme.sizes.touchTarget },
        tabBarLabelPosition: isDesktop ? "beside-icon" : "below-icon",
        tabBarLabelStyle: {
          fontFamily: theme.fontFamilies.bodyMedium,
          fontSize: theme.fontSizes.xs,
          fontWeight: theme.fontWeights.semibold,
          letterSpacing: theme.letterSpacing.wide,
          lineHeight: theme.lineHeights.xs,
          marginTop: isDesktop ? theme.spacing[0] : theme.spacing[0.5],
          textAlign: isDesktop ? "left" : "center",
        },
        tabBarPosition: isDesktop ? "left" : "bottom",
        tabBarStyle: isDesktop
          ? {
              backgroundColor: appTheme.colors.surface.navigation,
              borderRightColor: appTheme.colors.border.default,
              borderRightWidth: theme.borderWidths.thin,
              borderTopWidth: theme.spacing[0],
              height: "100%",
              paddingHorizontal: theme.spacing[3],
              paddingVertical: theme.spacing[5],
              width: theme.sizes.sidebarWidth,
            }
          : {
              backgroundColor: appTheme.colors.surface.navigation,
              borderTopColor: appTheme.colors.border.default,
              height: scaledBottomBarHeight,
              paddingBottom: Platform.OS === "ios" ? theme.spacing[6] : theme.spacing[2],
              paddingTop: theme.spacing[1.5],
            },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarAccessibilityLabel: "Home tab",
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon focused={focused} size={size} source={tabArtworkSources.home} />
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          tabBarAccessibilityLabel: "Prayer tab",
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon focused={focused} size={size} source={tabArtworkSources.prayer} />
          ),
          title: "Prayer",
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          tabBarAccessibilityLabel: "Community tab",
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon focused={focused} size={size} source={tabArtworkSources.community} />
          ),
          title: "Community",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarAccessibilityLabel: "Profile tab",
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon focused={focused} size={size} source={tabArtworkSources.profile} />
          ),
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

const styleSheet = createThemedStyles((theme) => ({
  tabArtwork: {
    borderRadius: theme.radii.xs,
  },
}));
