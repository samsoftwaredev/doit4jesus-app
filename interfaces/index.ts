import { Json } from "./database";

export interface CardProps {
  title: string;
  question: string;
  description?: string | JSX.Element | JSX.Element[];
  img?: string;
}

export interface ExamTypes {
  child: { label: string; value: CardProps[] };
  teen: { label: string; value: CardProps[] };
  adult: { label: string; value: CardProps[] };
}

export enum INTERFACE_AUDIO_TYPE {
  AUDIO_FILE = "AUDIO FILE",
  YOUTUBE_LINK = "YOUTUBE LINK",
}

export enum INTERFACE_VIEW_SIZE {
  SMALL = "sm",
  MEDIUM = "md",
}

export enum INTERFACE_LANGUAGES {
  es = "es",
  la = "la",
  en = "en",
}

export enum INTERFACE_AUDIO_STATE {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  VIDEO_CUED = 5,
}

export enum INTERFACE_AUDIO_SEEK {
  BACKWARDS = -1,
  NEUTRAL = 0,
  FORWARDS = 1,
}

export enum INTERFACE_BACKGROUND_ITEM {
  NONE = "NONE",
  AVE_MARIA = "AVE_MARIA",
  OCEAN_WAVE = "OCEAN_WAVE",
  LIGHT_PIANO = "LIGHT_PIANO",
  GENTLE_RAIN = "GENTLE_RAIN",
}

export enum INTERFACE_ROSARY_MYSTERIES {
  GLORIOUS = "glorious",
  SORROWFUL = "sorrowful",
  JOYFUL = "joyful",
  LUMINOUS = "luminous",
}

export enum INTERFACE_AUDIO_SPEED {
  VERY_SLOW = 0.25,
  SLOW = 0.5,
  NORMAL = 1,
  FAST = 1.5,
  VERY_FAST = 2,
}

export interface INTERFACE_AUDIO_PROPS {
  id?: string;
  audio?: string;
  audioTitle?: string;
  audioVolume?: number;
  audioLoop?: boolean;
  audioSeek?: INTERFACE_AUDIO_SEEK;
  audioSpeed?: INTERFACE_AUDIO_SPEED;
}
export interface INTERFACE_ROSARY_STATE {
  mystery: string;
  audioCover: string;
  title: string;
  mysteryAudio: string;
}

export enum EventTypes {
  youtubeVideo = "youtubeVideo",
  text = "text",
}

export type DataEvent = {
  eventId: number;
  attendees: number;
  createdAt: string;
  description: string;
  eventType: EventTypes | null;
  pictureUrl: string;
  price: number;
  slug: string;
  startedAt: string | null;
  title: string;
  updatedAt: string | null;
  eventSource: string | null;
};

export type VideoEvent = {
  videoEventId: string;
  description: string;
  videoId: string;
  title: string;
};

export interface User {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  genderMale?: boolean;
  dateOfBirth?: string;
  pictureUrl?: string;
  isConfirmed?: boolean;
  updateAt?: string;
  stats: {
    rosaryTotalCount: number;
    joinedRosary: {
      userId: string | null;
      date: string;
    }[];
  };
}
export interface OnlineUser {
  userId: string;
  pictureUrl: string;
  fullName: string;
}

export interface EventMessages {
  id: string;
  createdAt: string;
  message: string | null;
  updatedAt: string | null;
  userId: string | null;
  deletedAt: string | null;
  eventId: number | null;
  donationAmount: number | null;
  replyId: string | null;
  firstName: string | null;
  lastName: string | null;
  flagged?: string | null;
  likes?: Json;
  isFlagged: boolean;
}

export type ResourceSection = {
  body: string;
  title: string;
  image: string;
  imgAlt: string;
  references: { url: string; resource: string }[];
};

export type ResourceContent = {
  image: string;
  description: string;
  title: string;
  imgAlt: string;
  sections: ResourceSection[];
};

export interface ResourcePost {
  author: string | null;
  content: ResourceContent;
  createdAt: string;
  id: string;
  keywords: string | null;
  publishedAt: string | null;
  slug: string;
  updatedAt: string | null;
}
