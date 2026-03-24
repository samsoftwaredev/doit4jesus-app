import { FriendProfile } from '../interfaces';
import { getUserProfileLocally, storeUserProfileLocally } from '../utils';
import { fetchProfilesByIds } from './friendsApi';

/**
 * Will only make API call to retrieve user profile if users is not in sessionStorage.
 * @param {string[]} - Array of strings
 * @returns {} - returns user profiles or error
 */
export const getUserProfileAPI = async (
  userIds: string[],
): Promise<[FriendProfile[] | null, Error | null]> => {
  try {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      console.error('getUserProfileAPI: Invalid userIds provided', userIds);
      return [[], null];
    }

    const emptyProfilesIds: string[] = [];
    const profiles = userIds.map((uid) => {
      const profile = getUserProfileLocally(uid);
      if (profile === undefined) {
        emptyProfilesIds.push(uid);
        return undefined;
      }
      return profile;
    });
    const localProfiles: FriendProfile[] = profiles.filter(
      (profile): profile is FriendProfile => profile !== undefined,
    );

    if (emptyProfilesIds.length > 0) {
      try {
        const friendData = await fetchProfilesByIds(emptyProfilesIds);
        storeUserProfileLocally(friendData);
        return [[...friendData, ...localProfiles], null];
      } catch (error) {
        console.error('Error fetching user profiles from API:', {
          userIds: emptyProfilesIds,
          error,
        });
        return [localProfiles, error as Error];
      }
    }
    return [localProfiles, null];
  } catch (error) {
    console.error('getUserProfileAPI: Unexpected error', error);
    return [[], null];
  }
};

export * from './globalPrayerMap';
export * from './dailyScripture';
export * from './examOfConscience';
export * from './spiritualXp';
export * from './weeklyLeaderboard';
export * from './prayerMap';
