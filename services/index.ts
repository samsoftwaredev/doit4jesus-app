import { supabase } from '@/classes';

import { FriendProfile, PostgrestError } from '../interfaces';
import {
  getUserProfileLocally,
  normalizeFriendProfile,
  storeUserProfileLocally,
} from '../utils';

/**
 * Will only make API call to retrieve user profile if users is not in sessionStorage.
 * @param {string[]} - Array of strings
 * @returns {} - returns user profiles or error
 */
export const getUserProfileAPI = async (
  userIds: string[],
): Promise<[FriendProfile[] | null, PostgrestError | null]> => {
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
    const localProfiles: any[] = profiles.filter(
      (profile) => profile !== undefined,
    );

    if (emptyProfilesIds.length > 0) {
      let { data, error } = await supabase.rpc('get_profiles_by_user_ids', {
        user_ids: emptyProfilesIds,
      });

      if (error) {
        console.error('Error fetching user profiles from RPC:', {
          userIds: emptyProfilesIds,
          error,
        });
        return [[], error];
      }

      if (data) {
        try {
          const friendData = normalizeFriendProfile(data ?? []);
          storeUserProfileLocally(friendData);
          return [[...friendData, ...localProfiles], null];
        } catch (normalizeError) {
          console.error('Error normalizing friend profiles:', normalizeError);
          return [localProfiles, null];
        }
      }
      return [[], error];
    }
    return [localProfiles, null];
  } catch (error) {
    console.error('getUserProfileAPI: Unexpected error', error);
    return [[], null];
  }
};

export * from './globalPrayerMap';
export * from './spiritualXp';
