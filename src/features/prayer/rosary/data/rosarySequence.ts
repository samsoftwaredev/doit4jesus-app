import { englishRosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import type {
  RosaryContent,
  RosaryContentPrayerId,
  RosaryContentPrayerStep,
} from "@/features/prayer/rosary/data/rosaryContent";
import type { RosaryBead, RosaryBeadType, RosaryMysteryType } from "@/features/prayer/rosary/types";

const prayerIdByContentId: Record<RosaryContentPrayerId, string> = {
  apostles_creed: "apostles-creed",
  fatima_prayer: "fatima-prayer",
  glory_be: "glory-be",
  hail_holy_queen: "hail-holy-queen",
  hail_mary: "hail-mary",
  our_father: "our-father",
  sign_of_cross: "sign-of-cross",
};

const beadTypeByContentId: Record<RosaryContentPrayerId, RosaryBeadType> = {
  apostles_creed: "creed",
  fatima_prayer: "fatimaPrayer",
  glory_be: "gloryBe",
  hail_holy_queen: "hailHolyQueen",
  hail_mary: "hailMary",
  our_father: "ourFather",
  sign_of_cross: "signOfCross",
};

/** Converts one localized content step into the model consumed by the session and navigator. */
function createRosaryBead(step: RosaryContentPrayerStep): RosaryBead {
  const prayerId = prayerIdByContentId[step.prayer_type];
  const type = beadTypeByContentId[step.prayer_type];

  return {
    beadInDecade: step.bead_in_decade ?? undefined,
    decade: step.decade ?? undefined,
    id: step.id,
    isPhysicalBead: step.is_physical_bead,
    mysteryId: step.mystery_id ?? undefined,
    prayer: {
      beadType: type,
      id: prayerId,
      name: step.title,
      text: step.text,
    },
    prayerId,
    scriptureReference: step.scripture_reference ?? undefined,
    scriptureText: step.scripture_text ?? undefined,
    section: step.section,
    sequence: step.sequence,
    type,
  };
}

/**
 * Creates a reusable Hail Mary-only decade for the focused decade experience.
 *
 * @param decades Number of ten-bead decades to create; values below one resolve to one decade.
 * @returns Sequential physical Hail Mary beads independent of a particular mystery set.
 */
export function createRosarySequence(decades = 1): RosaryBead[] {
  const beadCount = Math.max(1, Math.floor(decades)) * 10;
  return Array.from({ length: beadCount }, (_, index) => ({
    beadInDecade: (index % 10) + 1,
    decade: Math.floor(index / 10) + 1,
    id: `hail-mary-${index + 1}`,
    isPhysicalBead: true,
    sequence: index + 1,
    prayerId: "hail-mary",
    section: "decade",
    type: "hailMary",
  }));
}

/**
 * Maps one mystery set's complete prayer sequence from localized Rosary content.
 * Every prayer step is retained, including prayers said on the crucifix, chain, and between physical beads.
 *
 * @param content Localized Rosary content containing mystery sets and their ordered prayer steps.
 * @param mysteryType Mystery set whose complete sequence should be returned.
 * @returns Ordered prayer steps with app prayer IDs, bead types, mystery links, and Scripture excerpts.
 */
export function getFullRosarySequence(content: RosaryContent, mysteryType: RosaryMysteryType): RosaryBead[] {
  const mysterySet = content.mystery_sets.find((set) => set.id === mysteryType);
  if (!mysterySet) return [];

  return mysterySet.prayer_sequence.map(createRosaryBead);
}

export const rosarySequence = createRosarySequence(1);
export const fullRosarySequence = getFullRosarySequence(englishRosaryContent, "joyful");
