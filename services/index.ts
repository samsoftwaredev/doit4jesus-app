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

    if (data) {
      const friendData = normalizeFriendProfile(data ?? []);
      storeUserProfileLocally(friendData);
      return [[...friendData, ...localProfiles], null];
    }
    return [[], error];
  }
  return [localProfiles, null];
};
