import { EventTypes, Events } from "@/interfaces";
import { Json } from "@/interfaces/database";
import { EventsDB } from "@/interfaces/databaseTable";
import moment from "moment";

const nullToString = (val: string | null) => (val === null ? "" : val);
const nullToNumber = (val: number | null) => (val === null ? 0 : val);
const nullToDate = (val: string | null) =>
  val === null ? "" : moment(val).format("MM/DD/YYYY");

export const normalizeEvent = (eventList: EventsDB[]): Events[] => {
  return eventList.map((data) => {
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
    };
  });
};
