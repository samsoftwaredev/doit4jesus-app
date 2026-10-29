import { useWindowDimensions } from "react-native";

import { useAppTheme } from "@/theme/AppThemeProvider";
import { theme } from "@/theme/tokens";

export type ResponsiveSize = "phone" | "tablet" | "desktop";

export type ResponsiveLayout = {
  contentWidth: number;
  fontScale: number;
  gutter: number;
  height: number;
  isDesktop: boolean;
  isLandscape: boolean;
  isLargeText: boolean;
  isNarrowPhone: boolean;
  isTablet: boolean;
  size: ResponsiveSize;
  width: number;
};

type Viewport = {
  fontScale: number;
  height: number;
  width: number;
};

/** Converts reactive window measurements into the app's shared responsive contract. */
export function getResponsiveLayout({ fontScale, height, width }: Viewport): ResponsiveLayout {
  const isDesktop = width >= theme.breakpoints.desktop;
  const isTablet = width >= theme.breakpoints.tablet;
  const availableWidth = Math.max(width - (isDesktop ? theme.sizes.sidebarWidth : 0), 0);
  const size: ResponsiveSize = isDesktop ? "desktop" : isTablet ? "tablet" : "phone";

  return {
    contentWidth: Math.min(availableWidth, theme.sizes.contentMaxWidth),
    fontScale,
    gutter: isDesktop ? theme.spacing[8] : isTablet ? theme.spacing[6] : theme.spacing[4],
    height,
    isDesktop,
    isLandscape: width > height,
    isLargeText: fontScale >= 1.3,
    isNarrowPhone: width < theme.breakpoints.smallPhone,
    isTablet,
    size,
    width,
  };
}

/** Combines the operating-system accessibility scale with the bounded in-app multiplier. */
export function getEffectiveFontScale(deviceFontScale: number, appTextScale: number): number {
  return deviceFontScale * appTextScale;
}

/** Returns breakpoint, orientation, and text-scale state that updates with the active window. */
export function useResponsiveLayout(): ResponsiveLayout {
  const viewport = useWindowDimensions();
  const { textScale } = useAppTheme();
  return getResponsiveLayout({
    ...viewport,
    fontScale: getEffectiveFontScale(viewport.fontScale, textScale),
  });
}
