import type { ComponentProps } from "react";

import Feather from "@expo/vector-icons/Feather";

type FeatherIconName = ComponentProps<typeof Feather>["name"];

export type PrayerIntentionTheme = {
  icon: FeatherIconName;
  surface: string;
  surfaceLight: string;
};

const themes: Record<string, PrayerIntentionTheme> = {
  candle: { icon: "sun", surface: "#572B35", surfaceLight: "#8B4B48" },
  dove: { icon: "feather", surface: "#3C365D", surfaceLight: "#7368A0" },
  olive_branch: { icon: "git-branch", surface: "#3B4C33", surfaceLight: "#708C58" },
  cross: { icon: "plus", surface: "#594520", surfaceLight: "#A57B38" },
};

const fallbackTheme: PrayerIntentionTheme = {
  icon: "heart",
  surface: "#15364F",
  surfaceLight: "#4C7895",
};

export function getPrayerIntentionTheme(symbol: string | null | undefined): PrayerIntentionTheme {
  return (symbol && themes[symbol]) || fallbackTheme;
}
