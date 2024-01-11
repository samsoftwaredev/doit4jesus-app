import { AuthResponse, createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uieyknteyflglukepcdy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZXlrbnRleWZsZ2x1a2VwY2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2NjM2OTYsImV4cCI6MjAyMDIzOTY5Nn0.-EFzqWmh1pyJLPUZ3P9rk_GxBUJmtIUHS-wCXTwBio0";
const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseDB {
  constructor() {}
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
  signUp = async (email: string, password: string): Promise<AuthResponse> => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "/account-setup",
      },
    });
  };
}

const db = new SupabaseDB();

export default db;
