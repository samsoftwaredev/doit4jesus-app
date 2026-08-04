import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";

import { theme } from "@/theme/tokens";

const tabArtworkSources = {
  home: require("../../assets/tabs/home.png"),
  prayer: require("../../assets/tabs/prayer.png"),
  community: require("../../assets/tabs/community.png"),
  battle: require("../../assets/tabs/battle.png"),
  profile: require("../../assets/tabs/profile.png"),
} as const;

function TabArtworkIcon({
  focused,
  size,
  source,
}: {
  focused: boolean;
  size: number;
  source: number;
}) {
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

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        tabBarActiveTintColor: theme.colors.icon.active,
        tabBarInactiveTintColor: theme.colors.icon.muted,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontFamily: theme.fontFamilies.bodyMedium,
          fontSize: theme.fontSizes.xs,
          fontWeight: theme.fontWeights.semibold,
          letterSpacing: theme.letterSpacing.wide,
          lineHeight: theme.lineHeights.xs,
          marginTop: theme.spacing[0.5],
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface.navigation,
          borderTopColor: theme.colors.border.default,
          height: Platform.select({
            ios: theme.sizes.bottomNavigationHeight + theme.spacing[5],
            default: theme.sizes.bottomNavigationHeight,
          }),
          paddingBottom: Platform.select({
            ios: theme.spacing[6],
            default: theme.spacing[2],
          }),
          paddingTop: theme.spacing[1.5],
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon
              focused={focused}
              size={size}
              source={tabArtworkSources.home}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="battle"
        options={{
          title: "Battle",
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon
              focused={focused}
              size={size}
              source={tabArtworkSources.battle}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: "Prayer",
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon
              focused={focused}
              size={size}
              source={tabArtworkSources.prayer}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon
              focused={focused}
              size={size}
              source={tabArtworkSources.community}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, size }) => (
            <TabArtworkIcon
              focused={focused}
              size={size}
              source={tabArtworkSources.profile}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabArtwork: {
    borderRadius: theme.radii.xs,
  },
});
