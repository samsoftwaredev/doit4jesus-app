import type { ImageSourcePropType } from "react-native";

import { artworkCredits, type ArtworkCredit } from "./artworkCredits";
import { artworkKeysBySource } from "./artworkRegistry";

/** Returns the trimmed title/artist for a bundled artwork, or undefined when none has been entered. */
export function getArtworkCredit(source?: ImageSourcePropType): ArtworkCredit | undefined {
  if (!source) return undefined;
  const key = artworkKeysBySource.get(source);
  const credit = key ? artworkCredits[key] : undefined;
  const title = credit?.title?.trim();
  const artist = credit?.artist?.trim();
  if (!title && !artist) return undefined;
  return { artist: artist || undefined, title: title || undefined };
}
