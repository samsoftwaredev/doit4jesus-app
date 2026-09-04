import type { ComponentProps } from "react";

import Feather from "@expo/vector-icons/Feather";

import type { ResolvedColorScheme } from "@/theme/AppThemeProvider";

type FeatherIconName = ComponentProps<typeof Feather>["name"];

export type PrayerIntentionTheme = {
  icon: FeatherIconName;
  surface: string;
  surfaceLight: string;
};

const darkThemes: Record<string, PrayerIntentionTheme> = {
  candle: { icon: "sun", surface: "#572B35", surfaceLight: "#8B4B48" },
  dove: { icon: "feather", surface: "#3C365D", surfaceLight: "#7368A0" },
  olive_branch: { icon: "git-branch", surface: "#3B4C33", surfaceLight: "#708C58" },
  cross: { icon: "plus", surface: "#594520", surfaceLight: "#A57B38" },
};

const darkFallbackTheme: PrayerIntentionTheme = {
  icon: "heart",
  surface: "#15364F",
  surfaceLight: "#4C7895",
};

const lightThemes: Record<string, PrayerIntentionTheme> = {
  candle: { icon: "sun", surface: "#F5E0E1", surfaceLight: "#B65E66" },
  dove: { icon: "feather", surface: "#EAE4F2", surfaceLight: "#76639A" },
  olive_branch: { icon: "git-branch", surface: "#DDECE3", surfaceLight: "#5D8C72" },
  cross: { icon: "plus", surface: "#F2E5C8", surfaceLight: "#A98449" },
};

const lightFallbackTheme: PrayerIntentionTheme = {
  icon: "heart",
  surface: "#DDE9F0",
  surfaceLight: "#5A819B",
};

/** Resolves a prayer symbol to colors that remain readable in the requested appearance. */
export function getPrayerIntentionTheme(
  symbol: string | null | undefined,
  colorScheme: ResolvedColorScheme,
): PrayerIntentionTheme {
  const isLight = colorScheme === "light";
  const themes = isLight ? lightThemes : darkThemes;
  const fallbackTheme = isLight ? lightFallbackTheme : darkFallbackTheme;
  return (symbol && themes[symbol]) || fallbackTheme;
}
