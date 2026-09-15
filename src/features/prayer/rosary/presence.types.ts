export type RosaryPresenceConnectionState = "connecting" | "connected" | "error" | "idle";

export type RosaryPresenceUser = {
  avatarUrl: string | null;
  countryCode: string | null;
  displayName: string;
  joinedAt: string;
  saintAvatarId: string | null;
  title: string | null;
  userId: string;
  username: string;
};
