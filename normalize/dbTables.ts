import { EventTypes, Event, VideoEvent } from "@/interfaces";
import { Json } from "@/interfaces/database";
import { EventsDB, YouTubeDB } from "@/interfaces/databaseTable";
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
      createdAt: nullToDate(data.created_at),
      description: nullToString(data.description),
      eventType: getEventType(data.event_type),
      pictureUrl: nullToString(data.picture_url),
      price: nullToNumber(data.price),
      slug: nullToString(data.slug),
      startsAt: nullToDate(data.starts_at),
      title: nullToString(data.title),
      updatedAt: nullToDate(data.updated_at),
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
