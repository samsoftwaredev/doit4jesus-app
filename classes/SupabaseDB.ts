import { AuthResponse, createClient } from '@supabase/supabase-js';

import { NAV_APP_LINKS, NAV_MAIN_LINKS } from '@/constants/nav';
import { NEW_USER_REDIRECT } from '@/constants/pages';
import type { Database } from '@/interfaces/database';
import { GENDER_TYPES } from '@/interfaces/enum';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const generateRandomStringId = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

class SupabaseDB {
  constructor() {}
  get() {
    return supabase;
  }
  getProfiles = () => {
    return supabase.from('profiles');
  };
  getGroups = () => {
    return supabase.from('groups');
  };
  getFriends = () => {
    return supabase.from('friends');
  };
  getGlobalPrayerSessions = () => {
    return supabase.from('global_prayer_sessions');
  };
  getRosaryStats = () => {
    return supabase.from('rosary_stats');
  };
  getEvents = () => {
    return supabase.from('events');
  };
  getPosts = () => {
    return supabase.from('posts');
  };
  getYouTubeVideo = () => {
    return supabase.from('youtube');
  };
  getEventMessages = () => {
    return supabase.from('event_messages');
  };
  getEventMessagesActions = () => {
    return supabase.from('event_messages_actions');
  };
  getFriendRequests = () => {
    return supabase.from('friend_requests');
  };
  getBadgeDefinitions = () => {
    return supabase.from('badge_definitions');
  };
  getUserBadges = () => {
    return supabase.from('user_badges');
  };
  getUserMilestones = () => {
    return supabase.from('user_milestones');
  };
  getUserXP = () => {
    return supabase.from('user_xp');
  };
  getXPEvents = () => {
    return supabase.from('xp_events');
  };
  getXPRules = () => {
    return supabase.from('xp_rules');
  };
  getXPLevelsConfig = () => {
    return supabase.from('xp_levels_config');
  };
  updatePassword = async (newPassword: string) => {
    return await supabase.auth.updateUser({ password: newPassword });
  };
  updateLanguage = async (userId: string, language: string) => {
    return await supabase
      .from('profiles')
      .update({ language })
      .eq('id', userId);
  };
  resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + NAV_MAIN_LINKS.updatePassword.link,
    });
  };
  logOut = async () => await supabase.auth.signOut();
  logIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };
  signUp = async (userInput: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    genderMale: boolean;
  }): Promise<AuthResponse> => {
    const redirectTo = window.location.origin + NEW_USER_REDIRECT;
    const userGender = userInput.genderMale
      ? GENDER_TYPES.male
      : GENDER_TYPES.female;
    return await supabase.auth.signUp({
      email: userInput.email,
      password: userInput.password,
      options: {
        data: {
          first_name: userInput.firstName,
          last_name: userInput.lastName,
          gender: userGender,
          username:
            userInput.firstName +
            userInput.lastName +
            generateRandomStringId(9),
        },
        emailRedirectTo: redirectTo,
      },
    });
  };
}

const db = new SupabaseDB();
export { db, supabase };
