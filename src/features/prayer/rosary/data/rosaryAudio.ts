import type {
  RosaryAudioLanguage,
  RosaryContent,
  RosaryContentPrayerId,
} from "@/features/prayer/rosary/data/rosaryContent";

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

/** Builds the localized transition queue for a mystery, omitting any unavailable optional recording. */
export function getMysteryAudioPaths(content: RosaryContent, mysteryId: string): string[] {
  const language = getAudioLanguage(content);
  const mystery = Object.values(content.audio_catalog.mystery_primary)
    .flatMap((set) => Object.entries(set ?? {}))
    .find(([id]) => id === mysteryId)?.[1]?.[language];
  if (!mystery) return [];

  const assetIds = language === "es" ? [mystery.description, mystery.fruit] : [mystery.title, mystery.description];
  return assetIds.map((assetId) => resolveAssetPath(content, assetId)).filter((path): path is string => Boolean(path));
}
