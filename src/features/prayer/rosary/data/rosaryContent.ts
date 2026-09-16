import englishRosaryJson from "@/data/en.rosary.json";
import type { RosaryMysteryType } from "@/features/prayer/rosary/types";

export type RosaryContentPrayerId =
  | "apostles_creed"
  | "our_father"
  | "hail_mary"
  | "glory_be"
  | "fatima_prayer"
  | "hail_holy_queen"
  | "sign_of_cross"
  | "saint_michael"
  | "litany_of_loreto";

export interface RosaryContentPrayer {
  title: string;
  text: string;
}

export type RosaryAudioLanguage = "en" | "es";

export interface RosaryAudioAsset {
  language: RosaryAudioLanguage;
  path: string;
  variant: "primary" | "alternate" | "fragment";
}

export interface RosaryMysteryAudioReferences {
  description?: string;
  fruit?: string;
  title?: string;
}

export interface RosaryAudioCatalog {
  assets: Record<string, RosaryAudioAsset>;
  prayer_primary: Partial<Record<RosaryContentPrayerId, Partial<Record<RosaryAudioLanguage, string>>>>;
  mystery_primary: Partial<
    Record<RosaryMysteryType, Record<string, Partial<Record<RosaryAudioLanguage, RosaryMysteryAudioReferences>>>>
  >;
}

export interface RosaryContentMystery {
  id: string;
  title: string;
  fruit: string;
  fruit_description: string;
  primary_scripture: string;
  scripture_text: string;
  app_image_key: string;
  image_alt: string;
}

export interface RosaryContentMysterySet {
  id: RosaryMysteryType;
  title: string;
  traditional_days: string[];
  mysteries: RosaryContentMystery[];
  prayer_sequence: RosaryContentPrayerStep[];
}

export interface RosaryContentPrayerStep {
  id: string;
  sequence: number;
  section: "opening" | "decade" | "closing";
  decade: number | null;
  bead_in_decade: number | null;
  prayer_type: RosaryContentPrayerId;
  title: string;
  text: string;
  mystery_id: string | null;
  scripture_reference: string | null;
  scripture_text: string | null;
  is_physical_bead: boolean;
}

export interface RosaryContent {
  schema_version: string;
  language: string;
  audio_catalog: RosaryAudioCatalog;
  prayer_library: Record<RosaryContentPrayerId, RosaryContentPrayer>;
  mystery_sets: RosaryContentMysterySet[];
}

export const englishRosaryContent = englishRosaryJson as unknown as RosaryContent;
