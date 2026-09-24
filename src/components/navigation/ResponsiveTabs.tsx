import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { Platform, useWindowDimensions } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@/theme/AppThemeProvider";
import { createThemedStyles, useThemedStyles } from "@/theme/createThemedStyles";
import { theme } from "@/theme/tokens";

const tabArtworkSources = {
  community: require("../../../assets/images/tabs/community.svg"),
  home: require("../../../assets/images/tabs/home.svg"),
  prayer: require("../../../assets/images/tabs/prayer.svg"),
  profile: require("../../../assets/images/tabs/profile.svg"),
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
  const { t } = useTranslation();
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
        tabBarAccessibilityLabel: t("navigation.primary"),
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
          tabBarAccessibilityLabel: t("navigation.homeTab"),
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon focused={focused} size={size} source={tabArtworkSources.home} />
          ),
          title: t("navigation.home"),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          tabBarAccessibilityLabel: t("navigation.prayerTab"),
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon focused={focused} size={size} source={tabArtworkSources.prayer} />
          ),
          title: t("navigation.prayer"),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          tabBarAccessibilityLabel: t("navigation.communityTab"),
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon focused={focused} size={size} source={tabArtworkSources.community} />
          ),
          title: t("navigation.community"),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarAccessibilityLabel: t("navigation.profileTab"),
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon focused={focused} size={size} source={tabArtworkSources.profile} />
          ),
          title: t("navigation.profile"),
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
