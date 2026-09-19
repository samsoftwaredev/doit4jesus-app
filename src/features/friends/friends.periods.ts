import type { LeaderboardPeriodType } from "./friends.types";

export const leaderboardPeriodOptions: readonly LeaderboardPeriodType[] = ["weekly", "yearly"];

/** Returns the client-owned translation key for a supported leaderboard period. */
export function getLeaderboardPeriodLabelKey(periodType: LeaderboardPeriodType) {
  return periodType === "yearly" ? "friends.leaderboard.thisYear" : "friends.leaderboard.thisWeek";
}
