import type { ImageSourcePropType } from "react-native";

import type { RosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import { englishRosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import type {
  RosaryArtStyle,
  RosaryMystery,
  RosaryMysterySet,
  RosaryMysteryType,
} from "@/features/prayer/rosary/types";

import * as mysteryCartoonImages from "../../../../../assets/images/mysteriesCartoon";
import * as mysteryClassicArt from "../../../../../assets/images/mysteriesClassicArt";

import { getRosaryPrayers } from "./rosaryPrayers";

const mysteryTypeOrder: RosaryMysteryType[] = ["joyful", "sorrowful", "glorious", "luminous"];

const mysteryImageSources: Record<string, ImageSourcePropType> = {
  fifth_glorious: mysteryCartoonImages.fifthGlorious,
  fifth_joyful: mysteryCartoonImages.fifthJoyful,
  fifth_luminous: mysteryCartoonImages.fifthLuminous,
  fifth_sorrowful: mysteryCartoonImages.fifthSorrowful,
  first_glorious: mysteryCartoonImages.firstGlorious,
  first_joyful: mysteryCartoonImages.firstJoyful,
  first_luminous: mysteryCartoonImages.firstLuminous,
  first_sorrowful: mysteryCartoonImages.firstSorrowful,
  fourth_glorious: mysteryCartoonImages.fourthGlorious,
  fourth_joyful: mysteryCartoonImages.fourthJoyful,
  fourth_luminous: mysteryCartoonImages.fourthLuminous,
  fourth_sorrowful: mysteryCartoonImages.fourthSorrowful,
  second_glorious: mysteryCartoonImages.secondGlorious,
  second_joyful: mysteryCartoonImages.secondJoyful,
  second_luminous: mysteryCartoonImages.secondLuminous,
  second_sorrowful: mysteryCartoonImages.secondSorrowful,
  third_glorious: mysteryCartoonImages.thirdGlorious,
  third_joyful: mysteryCartoonImages.thirdJoyful,
  third_luminous: mysteryCartoonImages.thirdLuminous,
  third_sorrowful: mysteryCartoonImages.thirdSorrowful,
};

const fallbackImageSource = mysteryCartoonImages.firstJoyful;

const classicMysteryImageSources: Record<string, readonly ImageSourcePropType[]> = {
  fifth_glorious: mysteryClassicArt.fifthGlorious,
  fifth_joyful: mysteryClassicArt.fifthJoyful,
  fifth_luminous: mysteryClassicArt.fifthLuminous,
  fifth_sorrowful: mysteryClassicArt.fifthSorrowful,
  first_glorious: mysteryClassicArt.firstGlorious,
  first_joyful: mysteryClassicArt.firstJoyful,
  first_luminous: mysteryClassicArt.firstLuminous,
  first_sorrowful: mysteryClassicArt.firstSorrowful,
  fourth_glorious: mysteryClassicArt.fourthGlorious,
  fourth_joyful: mysteryClassicArt.fourthJoyful,
  fourth_luminous: mysteryClassicArt.fourthLuminous,
  fourth_sorrowful: mysteryClassicArt.fourthSorrowful,
  second_glorious: mysteryClassicArt.secondGlorious,
  second_joyful: mysteryClassicArt.secondJoyful,
  second_luminous: mysteryClassicArt.secondLuminous,
  second_sorrowful: mysteryClassicArt.secondSorrowful,
  third_glorious: mysteryClassicArt.thirdGlorious,
  third_joyful: mysteryClassicArt.thirdJoyful,
  third_luminous: mysteryClassicArt.thirdLuminous,
  third_sorrowful: mysteryClassicArt.thirdSorrowful,
};

/** Returns a shuffled copy while leaving the bundled asset collection in its declared order. */
function shuffleImageSources(sources: readonly ImageSourcePropType[], random: () => number): ImageSourcePropType[] {
  const shuffled = [...sources];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.min(index, Math.max(0, Math.floor(random() * (index + 1))));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

/**
 * Returns the artwork collection available to one mystery in a stable caller-owned order.
 * Classical collections are shuffled without mutation; comic mysteries retain their single illustration.
 */
export function getRosaryMysteryImageSources(
  appImageKey: string,
  artStyle: RosaryArtStyle = "comic",
  random: () => number = Math.random,
): readonly ImageSourcePropType[] {
  if (artStyle === "classic") {
    const images = classicMysteryImageSources[appImageKey];
    if (images?.length) return shuffleImageSources(images, random);
  }
  return [mysteryImageSources[appImageKey] ?? fallbackImageSource];
}

/** Resolves one bundled image for a mystery, choosing a new classic artwork when requested. */
export function getRosaryMysteryImageSource(
  appImageKey: string,
  artStyle: RosaryArtStyle = "comic",
  random: () => number = Math.random,
): ImageSourcePropType {
  if (artStyle === "classic") {
    const images = classicMysteryImageSources[appImageKey];
    if (images?.length) return images[Math.min(images.length - 1, Math.floor(random() * images.length))];
  }
  return mysteryImageSources[appImageKey] ?? fallbackImageSource;
}

/** Builds one localized mystery set with a stable artwork order for the mounted prayer session. */
function createMysterySet(
  content: RosaryContent,
  type: RosaryMysteryType,
  artStyle: RosaryArtStyle = "comic",
  random: () => number = Math.random,
): RosaryMysterySet | undefined {
  const contentSet = content.mystery_sets.find((set) => set.id === type);
  if (!contentSet) return undefined;

  const category = contentSet.title;
  const prayers = getRosaryPrayers(content);
  const mysteries: RosaryMystery[] = contentSet.mysteries.map((mystery) => {
    const backgroundImageSources = getRosaryMysteryImageSources(mystery.app_image_key, artStyle, random);
    return {
      id: mystery.id,
      title: mystery.title,
      category,
      backgroundImageSources,
      fruit: mystery.fruit,
      fruitDescription: mystery.fruit_description,
      imageSource: backgroundImageSources.at(-1) ?? fallbackImageSource,
      imageAlt: mystery.image_alt,
      scriptureReference: mystery.primary_scripture,
      scriptureText: mystery.scripture_text,
      prayers,
    };
  });

  return {
    type,
    title: contentSet.title,
    subtitle: mysteries[0]?.title ?? contentSet.title,
    imageSource: mysteries[0]?.imageSource ?? fallbackImageSource,
    imageAlt: mysteries[0]?.imageAlt ?? `${contentSet.title} devotional image.`,
    mysteries,
  };
}

/** Returns the localized mysteries and session-stable artwork for one Rosary mystery type. */
export function getRosaryMysteriesFromContent(
  content: RosaryContent,
  type: RosaryMysteryType,
  artStyle: RosaryArtStyle = "comic",
  random: () => number = Math.random,
) {
  return createMysterySet(content, type, artStyle, random)?.mysteries ?? [];
}

/** Builds all four localized mystery sets while retaining their stable ordering. */
export function getRosaryMysterySetsFromContent(
  content: RosaryContent,
  artStyle: RosaryArtStyle = "comic",
  random: () => number = Math.random,
): RosaryMysterySet[] {
  return mysteryTypeOrder.flatMap((type) => {
    const mysterySet = createMysterySet(content, type, artStyle, random);
    return mysterySet ? [mysterySet] : [];
  });
}

export const rosaryMysterySets: RosaryMysterySet[] = getRosaryMysterySetsFromContent(englishRosaryContent);

export const rosaryMysteries = getRosaryMysteriesFromContent(englishRosaryContent, "joyful");

export function getRosaryMysterySet(type: RosaryMysteryType) {
  return rosaryMysterySets.find((set) => set.type === type) ?? rosaryMysterySets[0];
}

/** Returns one mystery set from a localized bundle, falling back to its first available set. */
export function getRosaryMysterySetFromContent(
  content: RosaryContent,
  type: RosaryMysteryType,
  artStyle: RosaryArtStyle = "comic",
  random: () => number = Math.random,
) {
  const sets = getRosaryMysterySetsFromContent(content, artStyle, random);
  return sets.find((set) => set.type === type) ?? sets[0];
}

export function getRosaryMysteries(type: RosaryMysteryType) {
  return getRosaryMysterySet(type).mysteries;
}
