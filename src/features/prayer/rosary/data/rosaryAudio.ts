import type {
  RosaryAudioLanguage,
  RosaryContent,
  RosaryContentPrayerId,
} from "@/features/prayer/rosary/data/rosaryContent";

const introAssetIds = {
  popeIntentions: {
    en: "en_prayers_popeIntentions",
    es: "es_prayers_popeIntentions",
  },
  threeHailMaryFruits: {
    en: "en_prayers_threeHailMaryFruits",
    es: "es_prayers_threeHailMaryFruits",
  },
} as const;

export type RosaryIntroAudioId = keyof typeof introAssetIds;

export type RosaryMysteryAudioKind = "title" | "reflection" | "fruit";

export interface RosaryMysteryAudioTrack {
  kind: RosaryMysteryAudioKind;
  path: string;
}

/** Returns the supported audio language represented by localized Rosary content. */
function getAudioLanguage(content: RosaryContent): RosaryAudioLanguage {
  return content.language === "es" ? "es" : "en";
}

/** Resolves one catalog identifier to a same-language bundled asset path. */
function resolveAssetPath(content: RosaryContent, assetId?: string): string | undefined {
  if (!assetId) return undefined;
  const asset = content.audio_catalog.assets[assetId];
  return asset?.language === getAudioLanguage(content) ? asset.path : undefined;
}

/** Resolves the primary same-language recording for one prayer, if bundled. */
export function getPrayerAudioPath(content: RosaryContent, prayerId: RosaryContentPrayerId): string | undefined {
  const language = getAudioLanguage(content);
  return resolveAssetPath(content, content.audio_catalog.prayer_primary[prayerId]?.[language]);
}

/** Resolves a Rosary group introduction to the bundled recording matching the content language. */
export function getRosaryIntroAudioPath(content: RosaryContent, introId: RosaryIntroAudioId): string | undefined {
  const language = getAudioLanguage(content);
  return resolveAssetPath(content, introAssetIds[introId][language]);
}

/** Resolves localized mystery recordings with the meaning needed to label each narration step. */
export function getMysteryAudioTracks(content: RosaryContent, mysteryId: string): RosaryMysteryAudioTrack[] {
  const language = getAudioLanguage(content);
  const mystery = Object.values(content.audio_catalog.mystery_primary)
    .flatMap((set) => Object.entries(set ?? {}))
    .find(([id]) => id === mysteryId)?.[1]?.[language];
  if (!mystery) return [];

  const tracks: readonly { assetId?: string; kind: RosaryMysteryAudioKind }[] =
    language === "es"
      ? [
          { assetId: mystery.description, kind: "reflection" },
          { assetId: mystery.fruit, kind: "fruit" },
        ]
      : [
          { assetId: mystery.title, kind: "title" },
          { assetId: mystery.description, kind: "reflection" },
        ];

  return tracks.flatMap(({ assetId, kind }) => {
    const path = resolveAssetPath(content, assetId);
    return path ? [{ kind, path }] : [];
  });
}

/** Builds the localized transition queue for a mystery, omitting any unavailable optional recording. */
export function getMysteryAudioPaths(content: RosaryContent, mysteryId: string): string[] {
  return getMysteryAudioTracks(content, mysteryId).map((track) => track.path);
}
