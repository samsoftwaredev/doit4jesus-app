import type { RosaryPrayer } from "@/features/prayer/rosary/types";

import { englishRosaryContent } from "./rosaryContent";

const prayerDefinitions = [
  { contentId: "our_father", id: "our-father", beadType: "ourFather" },
  { contentId: "hail_mary", id: "hail-mary", beadType: "hailMary" },
  { contentId: "glory_be", id: "glory-be", beadType: "gloryBe" },
  { contentId: "fatima_prayer", id: "fatima-prayer", beadType: "fatimaPrayer" },
  { contentId: "apostles_creed", id: "apostles-creed", beadType: "creed" },
  { contentId: "hail_holy_queen", id: "hail-holy-queen", beadType: "hailHolyQueen" },
  { contentId: "sign_of_cross", id: "sign-of-cross", beadType: "signOfCross" },
  { contentId: "saint_michael", id: "saint-michael", beadType: "closingPrayer" },
  { contentId: "litany_of_loreto", id: "litany-of-loreto", beadType: "closingPrayer" },
] as const;

/** Maps one localized prayer library to the prayer model used by cards and mysteries. */
export function getRosaryPrayers(contentBundle = englishRosaryContent): RosaryPrayer[] {
  return prayerDefinitions.map(({ beadType, contentId, id }) => {
    const content = contentBundle.prayer_library[contentId];

    return {
      id,
      name: content.title,
      beadType,
      text: content.text,
    };
  });
}

export const rosaryPrayers: RosaryPrayer[] = getRosaryPrayers();

export const prayerById = Object.fromEntries(rosaryPrayers.map((prayer) => [prayer.id, prayer])) as Record<
  string,
  RosaryPrayer
>;
