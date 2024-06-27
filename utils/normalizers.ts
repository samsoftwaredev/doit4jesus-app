import {
  EventTypes,
  DataEvent,
  VideoEvent,
  User,
  OnlineUser,
  EventMessages,
  ResourcePost,
  ResourceContent,
} from "@/interfaces";
import { User as UserSupabase } from "@supabase/supabase-js";
import { Json } from "@/interfaces/database";
import {
  EventMessagesActionsDB,
  EventMessagesDB,
  EventsDB,
  PostsDB,
  RosaryStatsDB,
  ProfilesDB,
  YouTubeDB,
} from "@/interfaces/databaseTable";
import moment from "moment";
import { numberToDollar } from "./helpers";
import dayjs from "dayjs";

const nullToString = (val: string | null) => (val === null ? "" : val);
const nullToNumber = (val: number | null) => (val === null ? 0 : val);
const nullToDate = (val: string | null) =>
  val === null ? "" : moment(val).format("MM/DD/YYYY");

export const normalizeEvent = (dataList: EventsDB[]): DataEvent[] => {
  return dataList.map((data) => {
    const getNumberOfAttendees = (attendees: Json | null) =>
      attendees ? Object.keys(attendees).length : 0;
    const getEventType = (type: string | null): EventTypes => {
      switch (type) {
        case "youtube_video":
          return "youtubeVideo" as EventTypes;
        default:
          return "text" as EventTypes;
      }
    };
    return {
      eventId: data.id,
      attendees: getNumberOfAttendees(data.attendees),
      description: nullToString(data.description),
      eventType: getEventType(data.event_type),
      pictureUrl: nullToString(data.picture_url),
      price: nullToNumber(data.price),
      slug: nullToString(data.slug),
      title: nullToString(data.title),
      createdAt: data.created_at,
      startedAt: data.started_at,
      updatedAt: data.updated_at,
      eventSource: data.event_source,
    };
  });
};

export const normalizeVideo = (dataList: YouTubeDB[]): VideoEvent[] => {
  return dataList.map((data) => {
    return {
      videoEventId: nullToString(data.id),
      description: nullToString(data.description),
      videoId: nullToString(data.video_id),
      title: nullToString(data.title),
    };
  });
};

export const normalizeUserProfile = (
  userProfile: ProfilesDB,
  rosaryStats: RosaryStatsDB[] | null
): User => {
  const generateRosaryCount = (stats: RosaryStatsDB[] | null) => {
    if (stats === null) {
      return { rosaryTotalCount: 0, joinedRosary: [] };
    }
    console.log("stats:", stats);
    const joinedRosary = stats
      .filter((s) => s.join_rosary_user_id !== null)
      .map((s) => ({
        userId: s.join_rosary_user_id,
        date: dayjs(s.completed_at).format("MM/DD/YYYY"),
      }));

    return {
      rosaryTotalCount: stats.length,
      joinedRosary: joinedRosary ?? [],
    };
  };

  return {
    updateAt: nullToDate(userProfile.updated_at),
    userId: nullToString(userProfile.id),
    firstName: nullToString(userProfile.first_name),
    lastName: nullToString(userProfile.last_name),
    genderMale: userProfile.gender === "male",
    dateOfBirth: nullToDate(userProfile.birth_date),
    pictureUrl: nullToString(userProfile.picture_url),
    stats: generateRosaryCount(rosaryStats),
  };
};

export const normalizeOnlineUsers = (users: any[]): OnlineUser[] => {
  return users.map(({ full_name, userId, picture_url }) => ({
    userId: userId,
    pictureUrl: picture_url,
    fullName: full_name,
  }));
};

type EventMessagesJoinActions = EventMessagesDB & {
  event_messages_actions?: EventMessagesActionsDB | null;
};

export const normalizeEventMessages = (
  data: EventMessagesJoinActions[]
): EventMessages[] => {
  return data.map((message) => ({
    firstName: message.first_name,
    lastName: message.last_name,
    id: message.id,
    createdAt: message.created_at,
    message: message.message,
    updatedAt: message.updated_at,
    userId: message.user_id,
    deletedAt: message.deleted_at,
    eventId: message.event_id,
    donationAmount: message.donation_amount
      ? numberToDollar(message.donation_amount)
      : null,
    replyId: message.reply_id,
    likes: message?.event_messages_actions?.likes,
    flagged: message?.event_messages_actions?.flagged,
    isFlagged: !!message?.event_messages_actions?.flagged,
  }));
};

export const normalizeAuthDB = (userData: UserSupabase | null) => {
  return {
    id: userData?.id,
    email: userData?.email,
    isConfirmed: !!userData?.confirmed_at,
  };
};

export const normalizePost = (posts: PostsDB[]): ResourcePost[] => {
  return posts.map((data) => ({
    author: data.author,
    content: data.content as ResourceContent,
    createdAt: data.created_at,
    id: data.id,
    keywords: data.keywords,
    publishedAt: data.published_at,
    slug: data.slug,
    updatedAt: data.updated_at,
  }));
};
