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
  audio: string;
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

export type Events = {
  attendees: number;
  createdAt: string;
  description: string;
  eventType: EventTypes | null;
  pictureUrl: string;
  price: number;
  slug: string;
  startsAt: string;
  title: string;
  updatedAt: string;
};
