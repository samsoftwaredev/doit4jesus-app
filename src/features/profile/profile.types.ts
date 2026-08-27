export type Gender = "female" | "male";

export interface CurrentUserProfile {
  avatarUrl: string | null;
  cityId: string | null;
  cityName: string | null;
  countryCode: string;
  createdAt: string;
  displayName: string;
  gender: Gender;
  leaderboardVisibility: string;
  preferredLanguage: string;
  prayerMapVisibility: string;
  saintAvatarId: string | null;
  state: string | null;
  timezone: string;
  title: string;
  updatedAt: string;
  userId: string;
  username: string;
}

export type UpdateCurrentUserProfile = Pick<CurrentUserProfile, "displayName" | "gender" | "saintAvatarId">;
