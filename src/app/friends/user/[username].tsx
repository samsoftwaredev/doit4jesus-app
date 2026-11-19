import { useLocalSearchParams } from "expo-router";

import { UserProfileScreen } from "@/features/friends/screens/UserProfileScreen";

/** Opens any user's public profile by username. */
export default function UserProfileRoute() {
  const { username } = useLocalSearchParams<{ username?: string | string[] }>();
  return <UserProfileScreen username={typeof username === "string" ? username : undefined} />;
}
