import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { theme } from "@/theme/tokens";

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
          paddingBottom: Platform.select({ ios: theme.spacing[6], default: theme.spacing[2] }),
          paddingTop: theme.spacing[1.5],
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="home" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: "Prayer",
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="heart" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="users" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather color={color} name="user" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
