import { Database } from './database';

export type EventsDB = Database['public']['Tables']['events']['Row'];
export type ProfilesDB = Database['public']['Tables']['profiles']['Row'];
export type RosaryStatsDB = Database['public']['Tables']['rosary_stats']['Row'];
export type PostsDB = Database['public']['Tables']['posts']['Row'];
export type GroupsDB = Database['public']['Tables']['groups']['Row'];
export type FriendsGroupsDB = Database['public']['Tables']['friends']['Row'];
export type YouTubeDB = Database['public']['Tables']['youtube']['Row'];
export type FriendsDB = Database['public']['Tables']['friends']['Row'];
export type FriendRequestsDB =
  Database['public']['Tables']['friend_requests']['Row'];
export type EventMessagesDB =
  Database['public']['Tables']['event_messages']['Row'];
export type EventMessagesActionsDB =
  Database['public']['Tables']['event_messages_actions']['Row'];

export type GenderEnumDB = Database['public']['Enums']['gender'];
