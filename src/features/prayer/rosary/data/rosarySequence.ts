import { englishRosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import type {
  RosaryContent,
  RosaryContentPrayerId,
  RosaryContentPrayerStep,
} from "@/features/prayer/rosary/data/rosaryContent";
import {
  getMysteryAudioTracks,
  getPrayerAudioPath,
  getRosaryIntroAudioPath,
} from "@/features/prayer/rosary/data/rosaryAudio";
import type { RosaryMysteryAudioKind } from "@/features/prayer/rosary/data/rosaryAudio";
import type { RosaryBead, RosaryBeadType, RosaryLength, RosaryMysteryType } from "@/features/prayer/rosary/types";
import { resources } from "@/localization/resources";

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

/** Returns the localized labels used by audio-only Rosary steps. */
function getNarrationLabels(content: RosaryContent) {
  return content.language === "es"
    ? resources.es.translation.rosary.narration
    : resources.en.translation.rosary.narration;
}

/** Finds the localized title for a mystery narration recording. */
function getMysteryTitle(content: RosaryContent, mysteryId: string) {
  return content.mystery_sets.flatMap((set) => set.mysteries).find((mystery) => mystery.id === mysteryId)?.title;
}

/** Resolves a descriptive title for one semantic mystery recording. */
function getMysteryNarrationName(content: RosaryContent, mysteryId: string, kind: RosaryMysteryAudioKind) {
  const labels = getNarrationLabels(content);
  if (kind === "title") return getMysteryTitle(content, mysteryId) ?? labels.reflection;
  return labels[kind];
}

/** Creates an audio-only step that carries prayer context without adding a physical Rosary bead. */
function createNarrationBead({
  audioPath,
  id,
  name,
  sourceStep,
}: {
  audioPath: string;
  id: string;
  name: string;
  sourceStep: RosaryContentPrayerStep;
}): RosaryBead {
  return {
    audioQueue: [audioPath],
    beadInDecade: sourceStep.bead_in_decade ?? undefined,
    decade: sourceStep.decade ?? undefined,
    id,
    isPhysicalBead: false,
    mysteryId: sourceStep.mystery_id ?? undefined,
    prayer: {
      beadType: "narration",
      id,
      name,
      text: "",
    },
    prayerId: id,
    section: sourceStep.section,
    sequence: sourceStep.sequence,
    type: "narration",
  };
}

/** Converts one localized content step into its narration entries followed by the original prayer. */
function createRosarySteps(step: RosaryContentPrayerStep, content: RosaryContent): RosaryBead[] {
  const prayerId = prayerIdByContentId[step.prayer_type];
  const type = beadTypeByContentId[step.prayer_type];

  const prayerAudio = getPrayerAudioPath(content, step.prayer_type);
  const mysteryAudio =
    step.mystery_id && step.bead_in_decade === 0 ? getMysteryAudioTracks(content, step.mystery_id) : [];
  const openingGroupAudio =
    step.section === "opening" && step.prayer_type === "hail_mary" && step.bead_in_decade === 1
      ? getRosaryIntroAudioPath(content, "threeHailMaryFruits")
      : undefined;

  const narrationSteps = mysteryAudio.map((track) =>
    createNarrationBead({
      audioPath: track.path,
      id: `${step.id}-mystery-${track.kind}`,
      name: getMysteryNarrationName(content, step.mystery_id!, track.kind),
      sourceStep: step,
    }),
  );
  if (openingGroupAudio) {
    narrationSteps.push(
      createNarrationBead({
        audioPath: openingGroupAudio,
        id: `${step.id}-three-hail-mary-fruits`,
        name: getNarrationLabels(content).threeHailMaryFruits,
        sourceStep: step,
      }),
    );
  }

  const prayerStep: RosaryBead = {
    audioQueue: prayerAudio ? [prayerAudio] : [],
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

  return [...narrationSteps, prayerStep];
}

/** Reassigns display sequence numbers after optional narration and length-specific steps are inserted. */
function reindexSequence(beads: RosaryBead[]) {
  return beads.map((bead, index) => ({ ...bead, sequence: index + 1 }));
}

/**
 * Creates a reusable Hail Mary-only decade for the focused decade experience.
 *
 * @param decades Number of ten-bead decades to create; values below one resolve to one decade.
 * @returns Sequential physical Hail Mary beads independent of a particular mystery set.
 */
export function createRosarySequence(decades = 1, content: RosaryContent = englishRosaryContent): RosaryBead[] {
  const beadCount = Math.max(1, Math.floor(decades)) * 10;
  const hailMaryAudio = getPrayerAudioPath(content, "hail_mary");
  return Array.from({ length: beadCount }, (_, index) => ({
    audioQueue: hailMaryAudio ? [hailMaryAudio] : [],
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

  return reindexSequence(mysterySet.prayer_sequence.flatMap((step) => createRosarySteps(step, content)));
}

/** Creates one non-bead closing prayer with only its own prayer recording. */
function createClosingPrayer(
  content: RosaryContent,
  definition: ClosingPrayerDefinition,
  sequence: number,
): RosaryBead {
  const prayer = content.prayer_library[definition.contentId];
  const prayerAudio = getPrayerAudioPath(content, definition.contentId);

  return {
    audioQueue: prayerAudio ? [prayerAudio] : [],
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

/** Creates the Pope-intentions introduction as a standalone closing narration when audio is bundled. */
function createPopeIntentionsNarration(content: RosaryContent, sequence: number): RosaryBead[] {
  const audioPath = getRosaryIntroAudioPath(content, "popeIntentions");
  if (!audioPath) return [];

  const id = "pope-intentions-narration";
  return [
    {
      audioQueue: [audioPath],
      id,
      isPhysicalBead: false,
      prayer: {
        beadType: "narration",
        id,
        name: getNarrationLabels(content).popeIntentions,
        text: "",
      },
      prayerId: id,
      section: "closing",
      sequence,
      type: "narration",
    },
  ];
}

/**
 * Composes a Rosary for the selected length.
 * The Short Rosary omits Fatima Prayer and Hail, Holy Queen; Medium and Long add their
 * respective closing prayers to the complete base sequence. The final Sign of the Cross
 * remains last and physical-bead numbering is unchanged.
 */
export function getRosarySequenceForLength(
  content: RosaryContent,
  mysteryType: RosaryMysteryType,
  length: RosaryLength,
): RosaryBead[] {
  const baseSequence = getFullRosarySequence(content, mysteryType);
  if (baseSequence.length === 0) return baseSequence;
  if (length === "short") {
    return reindexSequence(
      baseSequence.filter((step) => step.type !== "fatimaPrayer" && step.type !== "hailHolyQueen"),
    );
  }

  const finalStep = baseSequence.at(-1);
  if (!finalStep || finalStep.type !== "signOfCross" || finalStep.section !== "closing") return baseSequence;

  const sharedSteps = baseSequence.slice(0, -1);
  const definitions = length === "long" ? longClosingPrayers : mediumClosingPrayers;
  const popeNarration = createPopeIntentionsNarration(content, sharedSteps.length + 1);
  const addedSteps = definitions.map((definition, index) =>
    createClosingPrayer(content, definition, sharedSteps.length + popeNarration.length + index + 1),
  );

  return reindexSequence([...sharedSteps, ...popeNarration, ...addedSteps, finalStep]);
}

export const rosarySequence = createRosarySequence(1);
export const fullRosarySequence = getFullRosarySequence(englishRosaryContent, "joyful");
