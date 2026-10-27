import type { AudioSource } from "expo-audio";
import type { ImageSourcePropType } from "react-native";

import type { SupportedLanguage } from "@/localization";

export interface BackgroundMusicTrack {
  audioSource: AudioSource;
  artwork: ImageSourcePropType;
  id: string;
  title: Readonly<Record<SupportedLanguage, string>>;
}

/** Bundled devotional music in the order used by automatic and manual advancement. */
export const BACKGROUND_MUSIC_PLAYLIST = [
  {
    audioSource: require("../../../../assets/audios/music/angusDeiPolyphony.mp4"),
    artwork: require("../../../../assets/images/music/agnus-dei-polyphony.png"),
    id: "agnus-dei-polyphony",
    title: { en: "Agnus Dei — Polyphony", es: "Agnus Dei — Polifonía" },
  },
  {
    audioSource: require("../../../../assets/audios/music/diesIrae.mp4"),
    artwork: require("../../../../assets/images/music/dies-irae.png"),
    id: "dies-irae",
    title: { en: "Dies Irae", es: "Dies Irae" },
  },
  {
    audioSource: require("../../../../assets/audios/music/kyrieChant.mp4"),
    artwork: require("../../../../assets/images/music/kyrie-chant.png"),
    id: "kyrie-chant",
    title: { en: "Kyrie — Chant", es: "Kyrie — Canto" },
  },
  {
    audioSource: require("../../../../assets/audios/music/sanctusPolyphony.mp4"),
    artwork: require("../../../../assets/images/music/sanctus-polyphony.png"),
    id: "sanctus-polyphony",
    title: { en: "Sanctus — Polyphony", es: "Sanctus — Polifonía" },
  },
] as const satisfies readonly BackgroundMusicTrack[];
