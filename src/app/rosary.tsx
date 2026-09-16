import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

import { getRosaryContent } from "@/features/prayer/rosary/data/localizedRosaryContent";
import { getRosaryMysteriesFromContent } from "@/features/prayer/rosary/data/rosaryMysteries";
import { getTodayRosaryMysteryType } from "@/features/prayer/rosary/data/schedule";
import { RosaryPrayerScreen } from "@/features/prayer/rosary/screens/RosaryPrayerScreen";
import type { RosaryMysteryType } from "@/features/prayer/rosary/types";
import { useAppLanguage } from "@/localization";

function firstString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isMysteryType(value: string | undefined): value is RosaryMysteryType {
  return value === "joyful" || value === "sorrowful" || value === "glorious" || value === "luminous";
}

export default function RosaryRoute() {
  const { language } = useAppLanguage();
  const params = useLocalSearchParams<{
    intentionId?: string | string[];
    isDecade?: string | string[];
    mysteryType?: string | string[];
    source?: string | string[];
  }>();
  const rawMysteryType = firstString(params.mysteryType);
  const mysteryType = isMysteryType(rawMysteryType) ? rawMysteryType : getTodayRosaryMysteryType();
  const content = useMemo(() => getRosaryContent(language), [language]);
  const mysteries = useMemo(() => getRosaryMysteriesFromContent(content, mysteryType), [content, mysteryType]);

  return (
    <RosaryPrayerScreen
      intentionId={firstString(params.intentionId)}
      isDecade={false}
      mysteries={mysteries}
      mysteryType={mysteryType}
      source={firstString(params.source)}
    />
  );
}
