import { AuthResponse, createClient } from "@supabase/supabase-js";
import { NAV_APP_LINKS } from "../constants";
import type { Database } from "@/interfaces/database";

const supabaseUrl = "https://uieyknteyflglukepcdy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZXlrbnRleWZsZ2x1a2VwY2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2NjM2OTYsImV4cCI6MjAyMDIzOTY5Nn0.-EFzqWmh1pyJLPUZ3P9rk_GxBUJmtIUHS-wCXTwBio0";
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

class SupabaseDB {
  constructor() {}
  get() {
    return supabase;
  }
  getEvents = () => {
    return supabase.from("Events");
  };
  updatePassword = async (password: string) => {
    return await supabase.auth.updateUser({ password });
  };
  restPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
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
    return await supabase.auth.signUp({
      email: userInput.email,
      password: userInput.password,
      options: {
        data: {
          firstName: userInput.firstName,
          lastName: userInput.lastName,
          gender: userInput.genderMale ? "male" : "female",
        },
        emailRedirectTo: redirectTo,
      },
    });
  };
}

export const db = new SupabaseDB();
