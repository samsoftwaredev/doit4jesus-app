import { INTERFACE_BACKGROUND_ITEM } from '@/interfaces';

export const ROSARY_DAYS = {
  // the days of the week start with sunday
  sunday: 'glorious',
  monday: 'joyful',
  tuesday: 'sorrowful',
  wednesday: 'glorious',
  thursday: 'luminous',
  friday: 'sorrowful',
  saturday: 'joyful',
};

export const ROSARY_MYSTERIES = ['glorious', 'sorrowful', 'joyful', 'luminous'];

export const ROSARY_AUDIOS = {
  glorious: {
    es: 'FJFYQzDqWiI',
    en: 'F7I4KTiYoOE',
  },
  sorrowful: {
    es: 'hjZCpxnkEFA',
    en: 'ZVxA-2qfykQ',
  },
  joyful: {
    es: 'jmpdz27YAgg',
    en: 'if85VqzxHYg',
  },
  luminous: {
    es: 'rozmRSvZuhs',
    en: 'z0gJ_J4BKeo',
  },
};

export const ROSARY_LENGTH = {
  short: 'short',
  medium: 'medium',
  long: 'long',
};

export const VIEW_SIZE = {
  small: 'sm',
  medium: 'md',
};

export const INITIAL_VOLUME = 21;

export const BG_AUDIOS = [
  {
    id: INTERFACE_BACKGROUND_ITEM.AVE_MARIA,
    label: 'Ave Maria',
    audio: '7XO9uLEz2WY',
  },
  {
    id: INTERFACE_BACKGROUND_ITEM.OCEAN_WAVE,
    label: 'Ocean Waves',
    audio: 'vPhg6sc1Mk4',
  },
  {
    id: INTERFACE_BACKGROUND_ITEM.LIGHT_PIANO,
    label: 'Light Piano',
    audio: 'fOB73qRVGJs',
  },
  {
    id: INTERFACE_BACKGROUND_ITEM.GENTLE_RAIN,
    label: 'Gentle Rain',
    audio: 'q76bMs-NwRk',
  },
];
