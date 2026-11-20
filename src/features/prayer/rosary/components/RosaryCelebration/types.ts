/** Stats shown on the Rosary completion celebration; any field is null while unknown or unavailable. */
export type RosaryCelebrationStats = {
  currentStreak: number | null;
  isNewRecord: boolean;
  levelName: string | null;
  levelNumber: number | null;
  longestStreak: number | null;
  rosariesPrayed: number | null;
};
