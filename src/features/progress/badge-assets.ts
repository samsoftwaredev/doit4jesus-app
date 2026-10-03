import type { ImageSource } from "expo-image";

import { logDevelopmentError } from "@/lib/development-logger";

export type BadgeArtworkSource = ImageSource | number;

const localBadgeArtwork: Record<string, BadgeArtworkSource> = {
  BELT_OF_TRUTH: require("../../../assets/images/badges/belt_of_truth.png"),
  BOOTS_OF_READINESS: require("../../../assets/images/badges/boots_of_readiness.png"),
  BREASTPLATE_OF_RIGHTEOUSNESS: require("../../../assets/images/badges/breastplate_of_righteousness.png"),
  CHURCH_SCHEDULE_STEWARD: require("../../../assets/images/badges/church_schedule_steward.png"),
  COMMUNITY_HELPER: require("../../../assets/images/badges/community_helper.png"),
  FIRST_ROSARY: require("../../../assets/images/badges/first_rosary.png"),
  HELMET_OF_SALVATION: require("../../../assets/images/badges/helmet_of_salvation.png"),
  PRAYER_INTENTION_1: require("../../../assets/images/badges/first_intention.png"),
  PRAYER_INTENTION_3: require("../../../assets/images/badges/faithful_intecessor.png"),
  PRAYER_INTENTION_7: require("../../../assets/images/badges/prayer_advocate.png"),
  PRAYER_STREAK: require("../../../assets/images/badges/prayer_streak.png"),
  SCRIPTURE_SEEKER: require("../../../assets/images/badges/scripture_seeker.png"),
  SHIELD_OF_FAITH: require("../../../assets/images/badges/shield_of_faith.png"),
  SWORD_OF_THE_SPIRIT: require("../../../assets/images/badges/sword_of_the_spirit.png"),
};

const loopbackHosts = new Set(["127.0.0.1", "localhost", "[::1]", "::1"]);

/** Returns bundled artwork for a known backend badge code. */
export function getLocalBadgeArtwork(code: string): BadgeArtworkSource | null {
  return localBadgeArtwork[code] ?? null;
}

/** Resolves an API image URL and redirects development loopback storage URLs when configured. */
function resolveRemoteBadgeUrl(iconUrl: string | null): string | null {
  if (!iconUrl) return null;

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  try {
    const absoluteUrl = new URL(iconUrl);
    if (!/^https?:$/.test(absoluteUrl.protocol)) return null;

    if (loopbackHosts.has(absoluteUrl.hostname.toLowerCase()) && supabaseUrl) {
      return new URL(`${absoluteUrl.pathname}${absoluteUrl.search}${absoluteUrl.hash}`, supabaseUrl).toString();
    }

    return iconUrl;
  } catch (error) {
    logDevelopmentError("loading a badge asset", error);
    const assetBaseUrl = supabaseUrl ?? process.env.EXPO_PUBLIC_API_URL;
    if (!assetBaseUrl) return null;

    try {
      return new URL(iconUrl, `${assetBaseUrl.replace(/\/$/, "")}/`).toString();
    } catch (error) {
      logDevelopmentError("loading a fallback badge asset", error);
      return null;
    }
  }
}

/** Prefers bundled artwork, then returns a safe remote source for future badge codes. */
export function resolveBadgeArtwork(code: string, iconUrl: string | null): BadgeArtworkSource | null {
  const localArtwork = getLocalBadgeArtwork(code);
  if (localArtwork !== null) return localArtwork;

  const remoteUrl = resolveRemoteBadgeUrl(iconUrl);
  return remoteUrl ? { uri: remoteUrl } : null;
}
