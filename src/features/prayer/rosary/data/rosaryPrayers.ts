import type { RosaryPrayer } from "@/features/prayer/rosary/types";

import { englishRosaryContent } from "./rosaryContent";

const prayerDefinitions = [
  { contentId: "our_father", id: "our-father", beadType: "ourFather" },
  { contentId: "hail_mary", id: "hail-mary", beadType: "hailMary" },
  { contentId: "glory_be", id: "glory-be", beadType: "gloryBe" },
  { contentId: "fatima_prayer", id: "fatima-prayer", beadType: "fatimaPrayer" },
  { contentId: "apostles_creed", id: "apostles-creed", beadType: "creed" },
  { contentId: "hail_holy_queen", id: "hail-holy-queen", beadType: "hailHolyQueen" },
] as const;

export const rosaryPrayers: RosaryPrayer[] = prayerDefinitions.map(({ beadType, contentId, id }) => {
  const content = englishRosaryContent.prayer_library[contentId];

  return {
    id,
    name: content.title,
    beadType,
    text: content.text,
  };
});

export const prayerById = Object.fromEntries(rosaryPrayers.map((prayer) => [prayer.id, prayer])) as Record<
  string,
  RosaryPrayer
>;
