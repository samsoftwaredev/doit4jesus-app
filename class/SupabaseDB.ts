import { AuthResponse, createClient } from "@supabase/supabase-js";
import { NAV_APP_LINKS } from "../constants";
import type { Database } from "@/interfaces/database";
import { GENDER_TYPES } from "@/interfaces/enum";
import { GenderEnumDB } from "@/interfaces/databaseTable";

const supabaseUrl = "https://uieyknteyflglukepcdy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZXlrbnRleWZsZ2x1a2VwY2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2NjM2OTYsImV4cCI6MjAyMDIzOTY5Nn0.-EFzqWmh1pyJLPUZ3P9rk_GxBUJmtIUHS-wCXTwBio0";
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

class SupabaseDB {
  constructor() {}
  get() {
    return supabase;
  }
  getProfiles = () => {
    return supabase.from("profiles");
  };
  getEvents = () => {
    return supabase.from("events");
  };
  getYouTubeVideo = () => {
    return supabase.from("youtube");
  };
  updatePassword = async (password: string) => {
    return await supabase.auth.updateUser({ password });
  };
  resetPassword = async (email: string) => {
    const redirectTo = window.location.origin + "/update-password";
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
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
      window.location.origin + NAV_APP_LINKS.app.link + "/account-setup";
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
          gender: userGender as any,
        },
        emailRedirectTo: redirectTo,
      },
    });
  };
}

export const db = new SupabaseDB();
