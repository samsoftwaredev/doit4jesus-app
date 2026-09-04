import type { ImageSourcePropType } from "react-native";

import type { RosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import { englishRosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import type {
  RosaryMystery,
  RosaryMysteryCategory,
  RosaryMysterySet,
  RosaryMysteryType,
} from "@/features/prayer/rosary/types";

import { rosaryPrayers } from "./rosaryPrayers";

const mysteryTypeOrder: RosaryMysteryType[] = ["joyful", "sorrowful", "glorious", "luminous"];

const categoryByType: Record<RosaryMysteryType, RosaryMysteryCategory> = {
  joyful: "Joyful Mysteries",
  luminous: "Luminous Mysteries",
  sorrowful: "Sorrowful Mysteries",
  glorious: "Glorious Mysteries",
};

const mysteryImageSources: Record<string, ImageSourcePropType> = {
  bible: require("../../../../assets/virtues/bible.png"),
  blessed_virgin_mary: require("../../../../assets/saints/blessed-virgin-mary.png"),
  cathedral_desktop: require("../../../../assets/backgrounds/cathedralDesktop.png"),
  cathedral_tablet: require("../../../../assets/backgrounds/cathedralTablet.png"),
  our_lady_queen_of_heaven: require("../../../../assets/saints/our-lady-queen-of-heaven.png"),
  saint_francis_of_assisi: require("../../../../assets/saints/saint-francis-of-assisi.png"),
  saint_francis_xavier: require("../../../../assets/saints/saint-francis-xavier.png"),
  saint_joan_of_arc: require("../../../../assets/saints/saint-joan-of-arc.png"),
  saint_john_the_evangelist: require("../../../../assets/saints/saint-john-the-evangelist.png"),
  saint_joseph: require("../../../../assets/saints/saint-joseph.png"),
  saint_michael_the_archangel: require("../../../../assets/saints/saint-michael-the-archangel.png"),
  saint_monica: require("../../../../assets/saints/saint-monica.png"),
  saint_padre_pio: require("../../../../assets/saints/saint-padre-pio.png"),
  saint_paul: require("../../../../assets/saints/saint-paul.png"),
  saint_peter: require("../../../../assets/saints/saint-peter.png"),
  saint_sebastian: require("../../../../assets/saints/saint-sebastian.png"),
  white_lily: require("../../../../assets/flowers/whiteLily.png"),
};

const fallbackImageSource = mysteryImageSources.blessed_virgin_mary;

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
