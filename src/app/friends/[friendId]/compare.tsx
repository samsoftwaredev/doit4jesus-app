import { useLocalSearchParams } from "expo-router";

import { CompareStatsScreen } from "@/features/friends/screens/CompareStatsScreen";

export default function CompareStatsRoute() {
  const { friendId } = useLocalSearchParams<{ friendId?: string | string[] }>();
  return <CompareStatsScreen friendId={typeof friendId === "string" ? friendId : undefined} />;
}
