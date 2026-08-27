import { useLocalSearchParams } from "expo-router";

import { getTodayRosaryMysteryType } from "@/features/prayer/intentions";
import { RosaryPrayerScreen } from "@/features/prayer/rosary/screens/RosaryPrayerScreen";
import type { RosaryMysteryType } from "@/features/prayer/rosary/types";

function firstString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isMysteryType(value: string | undefined): value is RosaryMysteryType {
  return value === "joyful" || value === "sorrowful" || value === "glorious" || value === "luminous";
}

export default function RosaryRoute() {
  const params = useLocalSearchParams<{
    intentionId?: string | string[];
    isDecade?: string | string[];
    mysteryType?: string | string[];
    source?: string | string[];
  }>();
  const rawMysteryType = firstString(params.mysteryType);
  const mysteryType = isMysteryType(rawMysteryType) ? rawMysteryType : getTodayRosaryMysteryType();

  return (
    <RosaryPrayerScreen
      intentionId={firstString(params.intentionId)}
      isDecade={firstString(params.isDecade) === "true"}
      mysteryType={mysteryType}
      source={firstString(params.source)}
    />
  );
}
