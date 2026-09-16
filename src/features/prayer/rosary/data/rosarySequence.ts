import { englishRosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import type {
  RosaryContent,
  RosaryContentPrayerId,
  RosaryContentPrayerStep,
} from "@/features/prayer/rosary/data/rosaryContent";
import type { RosaryBead, RosaryBeadType, RosaryLength, RosaryMysteryType } from "@/features/prayer/rosary/types";

const prayerIdByContentId: Record<RosaryContentPrayerId, string> = {
  apostles_creed: "apostles-creed",
  fatima_prayer: "fatima-prayer",
  glory_be: "glory-be",
  hail_holy_queen: "hail-holy-queen",
  hail_mary: "hail-mary",
  our_father: "our-father",
  sign_of_cross: "sign-of-cross",
  saint_michael: "saint-michael",
  litany_of_loreto: "litany-of-loreto",
};

const beadTypeByContentId: Record<RosaryContentPrayerId, RosaryBeadType> = {
  apostles_creed: "creed",
  fatima_prayer: "fatimaPrayer",
  glory_be: "gloryBe",
  hail_holy_queen: "hailHolyQueen",
  hail_mary: "hailMary",
  our_father: "ourFather",
  sign_of_cross: "signOfCross",
  saint_michael: "closingPrayer",
  litany_of_loreto: "closingPrayer",
};

interface ClosingPrayerDefinition {
  beadType: RosaryBeadType;
  contentId: RosaryContentPrayerId;
  id: string;
  prayerId: string;
  title?: string;
  spanishTitle?: string;
}

const mediumClosingPrayers: readonly ClosingPrayerDefinition[] = [
  {
    beadType: "ourFather",
    contentId: "our_father",
    id: "pope-intentions-our-father",
    prayerId: "our-father",
    title: "Our Father for the Pope’s Intentions",
    spanishTitle: "Padre Nuestro por las intenciones del Papa",
  },
  {
    beadType: "hailMary",
    contentId: "hail_mary",
    id: "pope-intentions-hail-mary",
    prayerId: "hail-mary",
    title: "Hail Mary for the Pope’s Intentions",
    spanishTitle: "Ave María por las intenciones del Papa",
  },
  {
    beadType: "gloryBe",
    contentId: "glory_be",
    id: "pope-intentions-glory-be",
    prayerId: "glory-be",
    title: "Glory Be for the Pope’s Intentions",
    spanishTitle: "Gloria por las intenciones del Papa",
  },
  {
    beadType: "closingPrayer",
    contentId: "saint_michael",
    id: "saint-michael",
    prayerId: "saint-michael",
  },
];

const longClosingPrayers: readonly ClosingPrayerDefinition[] = [
  ...mediumClosingPrayers,
  {
    beadType: "closingPrayer",
    contentId: "litany_of_loreto",
    id: "litany-of-loreto",
    prayerId: "litany-of-loreto",
  },
];

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

/** Creates one non-bead closing step from the localized prayer library. */
function createClosingPrayer(
  content: RosaryContent,
  definition: ClosingPrayerDefinition,
  sequence: number,
): RosaryBead {
  const prayer = content.prayer_library[definition.contentId];

  return {
    id: definition.id,
    isPhysicalBead: false,
    prayer: {
      beadType: definition.beadType,
      id: definition.prayerId,
      name: content.language === "es" ? (definition.spanishTitle ?? prayer.title) : (definition.title ?? prayer.title),
      text: prayer.text,
    },
    prayerId: definition.prayerId,
    section: "closing",
    sequence,
    type: definition.beadType,
  };
}

/**
 * Composes a full Rosary with the selected cumulative set of non-bead closing prayers.
 * The final Sign of the Cross always remains last and physical-bead numbering is unchanged.
 */
export function getRosarySequenceForLength(
  content: RosaryContent,
  mysteryType: RosaryMysteryType,
  length: RosaryLength,
): RosaryBead[] {
  const baseSequence = getFullRosarySequence(content, mysteryType);
  if (length === "short" || baseSequence.length === 0) return baseSequence;

  const finalStep = baseSequence.at(-1);
  if (!finalStep || finalStep.type !== "signOfCross" || finalStep.section !== "closing") return baseSequence;

  const sharedSteps = baseSequence.slice(0, -1);
  const definitions = length === "long" ? longClosingPrayers : mediumClosingPrayers;
  const addedSteps = definitions.map((definition, index) =>
    createClosingPrayer(content, definition, sharedSteps.length + index + 1),
  );

  return [...sharedSteps, ...addedSteps, { ...finalStep, sequence: sharedSteps.length + addedSteps.length + 1 }];
}

export const rosarySequence = createRosarySequence(1);
export const fullRosarySequence = getFullRosarySequence(englishRosaryContent, "joyful");
