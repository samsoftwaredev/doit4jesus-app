import { useLocalSearchParams } from "expo-router";

import { getTodayRosaryMysteryType } from "@/features/prayer/rosary/data/schedule";
import { getRosaryVideoId } from "@/features/prayer/rosary/data/rosaryVideos";
import { RosaryVideoScreen } from "@/features/prayer/rosary/screens/RosaryVideoScreen";
import type { RosaryMysteryType } from "@/features/prayer/rosary/types";
import { useAppLanguage } from "@/localization";

/** Returns the first query value when Expo Router supplies a repeated parameter. */
function firstString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Narrows route input to the four supported Rosary mystery identifiers. */
function isMysteryType(value: string | undefined): value is RosaryMysteryType {
  return value === "joyful" || value === "sorrowful" || value === "glorious" || value === "luminous";
}

/** Resolves the localized video for an explicit mystery or today's local schedule. */
export default function RosaryVideoRoute() {
  const { language } = useAppLanguage();
  const params = useLocalSearchParams<{ mysteryType?: string | string[] }>();
  const rawMysteryType = firstString(params.mysteryType);
  const mysteryType = isMysteryType(rawMysteryType) ? rawMysteryType : getTodayRosaryMysteryType();

  return (
    <RosaryVideoScreen
      key={`${language}-${mysteryType}`}
      language={language}
      mysteryType={mysteryType}
      videoId={getRosaryVideoId(language, mysteryType)}
    />
  );
}
