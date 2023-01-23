export enum INTERFACE_AUDIO_TYPE {
  AUDIO_FILE = "AUDIO FILE",
  YOUTUBE_LINK = "YOUTUBE LINK",
}

export enum INTERFACE_VIEW_SIZE {
  SMALL = "sm",
  MEDIUM = "md",
}

export enum INTERFACE_AUDIO_STATE {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  VIDEO_CUED = 5,
}

export enum INTERFACE_BACKGROUND_ITEM {
  NONE = "NONE",
  AVE_MARIA = "AVE_MARIA",
  OCEAN_WAVE = "OCEAN_WAVE",
  LIGHT_PIANO = "LIGHT_PIANO",
  GENTLE_RAIN = "GENTLE_RAIN",
}

export interface INTERFACE_AUDIO_PROPS {
  audio: string;
  visible: boolean;
  audioVolume: number;
}
