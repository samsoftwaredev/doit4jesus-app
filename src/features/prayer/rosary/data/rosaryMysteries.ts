import type { ImageSourcePropType } from "react-native";

import type { RosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import { englishRosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import type {
  RosaryMystery,
  RosaryMysteryCategory,
  RosaryMysterySet,
  RosaryMysteryType,
} from "@/features/prayer/rosary/types";

import * as mysteryCartoonImages from "../../../../../assets/images/mysteriesCartoon";

import { rosaryPrayers } from "./rosaryPrayers";

const mysteryTypeOrder: RosaryMysteryType[] = ["joyful", "sorrowful", "glorious", "luminous"];

const categoryByType: Record<RosaryMysteryType, RosaryMysteryCategory> = {
  joyful: "Joyful Mysteries",
  luminous: "Luminous Mysteries",
  sorrowful: "Sorrowful Mysteries",
  glorious: "Glorious Mysteries",
};

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

function createMysterySet(content: RosaryContent, type: RosaryMysteryType): RosaryMysterySet | undefined {
  const contentSet = content.mystery_sets.find((set) => set.id === type);
  if (!contentSet) return undefined;

  const category = categoryByType[type];
  const mysteries: RosaryMystery[] = contentSet.mysteries.map((mystery) => ({
    id: mystery.id,
    title: mystery.title,
    category,
    fruit: mystery.fruit,
    fruitDescription: mystery.fruit_description,
    imageSource: mysteryImageSources[mystery.app_image_key] ?? fallbackImageSource,
    imageAlt: mystery.image_alt,
    scriptureReference: mystery.primary_scripture,
    scriptureText: mystery.scripture_text,
    prayers: rosaryPrayers,
  }));

  return {
    type,
    title: contentSet.title,
    subtitle: mysteries[0]?.title ?? contentSet.title,
    imageSource: mysteries[0]?.imageSource ?? fallbackImageSource,
    imageAlt: mysteries[0]?.imageAlt ?? `${contentSet.title} devotional image.`,
    mysteries,
  };
}

export function getRosaryMysteriesFromContent(content: RosaryContent, type: RosaryMysteryType) {
  return createMysterySet(content, type)?.mysteries ?? [];
}

export const rosaryMysterySets: RosaryMysterySet[] = mysteryTypeOrder.flatMap((type) => {
  const mysterySet = createMysterySet(englishRosaryContent, type);
  return mysterySet ? [mysterySet] : [];
});

export const rosaryMysteries = getRosaryMysteriesFromContent(englishRosaryContent, "joyful");

export function getRosaryMysterySet(type: RosaryMysteryType) {
  return rosaryMysterySets.find((set) => set.type === type) ?? rosaryMysterySets[0];
}

export function getRosaryMysteries(type: RosaryMysteryType) {
  return getRosaryMysterySet(type).mysteries;
}
