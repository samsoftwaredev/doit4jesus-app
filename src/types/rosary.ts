import type { ImageSourcePropType } from "react-native";

export type RosaryMysteryCategory =
  "Joyful Mysteries" | "Luminous Mysteries" | "Sorrowful Mysteries" | "Glorious Mysteries";

export type RosaryMysteryType = "joyful" | "luminous" | "sorrowful" | "glorious";

export type RosaryBeadType = "ourFather" | "hailMary" | "gloryBe" | "fatimaPrayer" | "creed";

export type BeadState = "completed" | "active" | "upcoming";

export interface RosaryPrayer {
  id: string;
  name: string;
  text: string;
  beadType: RosaryBeadType;
}

export interface RosaryBead {
  id: string;
  sequence: number;
  prayerId: string;
  type: RosaryBeadType;
}

export interface RosaryMystery {
  id: string;
  title: string;
  category: RosaryMysteryCategory;
  imageSource: ImageSourcePropType;
  imageAlt: string;
  scriptureReference: string;
  scriptureText: string;
  prayers: RosaryPrayer[];
}

export interface RosaryMysterySet {
  type: RosaryMysteryType;
  title: string;
  subtitle: string;
  imageSource: ImageSourcePropType;
  imageAlt: string;
  mysteries: RosaryMystery[];
}

export interface PrayerProgress {
  currentIndex: number;
  total: number;
  prayerName: string;
}

export interface RosarySessionState {
  currentMysteryIndex: number;
  currentPrayerIndex: number;
  currentBeadIndex: number;
  completedBeadIds: string[];
  isTransitioning: boolean;
}

export interface PersistedRosarySession {
  currentMysteryIndex: number;
  currentBeadIndex: number;
  completedBeadIds: string[];
  dateLastPrayed: string | null;
  isRosaryCompleted: boolean;
}
