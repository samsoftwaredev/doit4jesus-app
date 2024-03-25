import { Database } from "./database";

export type EventsDB = Database["public"]["Tables"]["events"]["Row"];
export type ProfilesDB = Database["public"]["Tables"]["profiles"]["Row"];
export type PostsDB = Database["public"]["Tables"]["posts"]["Row"];
export type YouTubeDB = Database["public"]["Tables"]["youtube"]["Row"];
export type EventMessagesDB =
  Database["public"]["Tables"]["event_messages"]["Row"];

export type GenderEnumDB = Database["public"]["Enums"]["gender"];
