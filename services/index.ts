import { supabase } from '../classes';
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
  const emptyProfilesIds: string[] = [];

  const localProfiles = userIds
    .map((uid) => {
      const profile = getUserProfileLocally(uid);
      if (profile === undefined) {
        emptyProfilesIds.push(uid);
        return undefined;
      } else {
        return profile;
      }
    })
    .filter((profile) => profile !== undefined);

  if (emptyProfilesIds) {
    let { data, error } = await supabase.rpc('get_profiles_by_user_ids', {
      user_ids: emptyProfilesIds,
    });

    if (data) {
      const friendData = normalizeFriendProfile(data ?? []);
      storeUserProfileLocally(friendData);
      return [[...friendData, ...localProfiles], null];
    }
    return [null, error];
  }
  return [localProfiles, null];
};
