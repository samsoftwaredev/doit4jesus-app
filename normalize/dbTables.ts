import { EventTypes, Event, VideoEvent, User, OnlineUser } from "@/interfaces";
import { Json } from "@/interfaces/database";
import { EventsDB, ProfilesDB, YouTubeDB } from "@/interfaces/databaseTable";
import moment from "moment";

const nullToString = (val: string | null) => (val === null ? "" : val);
const nullToNumber = (val: number | null) => (val === null ? 0 : val);
const nullToDate = (val: string | null) =>
  val === null ? "" : moment(val).format("MM/DD/YYYY");

export const normalizeEvent = (dataList: EventsDB[]): Event[] => {
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

export const normalizeUserProfile = (data: ProfilesDB): User => {
  return {
    updateAt: nullToDate(data.updated_at),
    userId: nullToString(data.id),
    firstName: nullToString(data.first_name),
    lastName: nullToString(data.last_name),
    genderMale: data.gender === "male",
    dateOfBirth: nullToDate(data.birth_date),
    pictureUrl: nullToString(data.picture_url),
  };
};

export const normalizeOnlineUsers = (users: any[]): OnlineUser[] => {
  return users.map(({ full_name, userId, picture_url }) => ({
    userId: userId,
    pictureUrl: picture_url,
    fullName: full_name,
  }));
};
