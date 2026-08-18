import { useLocalSearchParams } from "expo-router";

import { FriendProfileScreen } from "@/features/friends/screens/FriendProfileScreen";

export default function FriendProfileRoute() {
  const { friendId } = useLocalSearchParams<{ friendId?: string | string[] }>();
  return <FriendProfileScreen friendId={typeof friendId === "string" ? friendId : undefined} />;
}
