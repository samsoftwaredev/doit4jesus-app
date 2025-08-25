import { AuthResponse, createClient } from '@supabase/supabase-js';

import { NAV_APP_LINKS } from '@/constants';
import type { Database } from '@/interfaces/database';
import { GENDER_TYPES } from '@/interfaces/enum';

import { generateRandomStringId } from '../utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

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
  updatePassword = async (newPassword: string) => {
    return await supabase.auth.updateUser({ password: newPassword });
  };
  resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/update-password',
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
    const redirectTo =
      window.location.origin + NAV_APP_LINKS.dashboard.link + '?newUser=true';
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
            generateRandomStringId(3),
        },
        emailRedirectTo: redirectTo,
      },
    });
  };
}

const db = new SupabaseDB();
export { db, supabase };
