import { Database } from "./database";

export type EventsDB = Database["public"]["Tables"]["Events"]["Row"];
export type ProfilesDB = Database["public"]["Tables"]["Profiles"]["Row"];
export type PostsDB = Database["public"]["Tables"]["Posts"]["Row"];
