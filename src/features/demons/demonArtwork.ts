import type { ImageSourcePropType } from "react-native";

import type { DemonCatalogItem } from "./demons.types";

const demonArtworkByCode = {
  BRAGGLESNOUT: require("../../assets/demons/pride.png"),
  FOGGLES: require("../../assets/demons/acedia.png"),
  GOSSIPGOB: require("../../assets/demons/gossip.png"),
  GRUMBLEPUFF: require("../../assets/demons/wrath.png"),
  PEEKABOOZE: require("../../assets/demons/envy.png"),
  SCROLLZILLA: require("../../assets/demons/distraction.png"),
  SHINYGRAB: require("../../assets/demons/greed.png"),
  SNEAKYPEEKY: require("../../assets/demons/lust.png"),
  SNACKASAURUS: require("../../assets/demons/gluttony.png"),
  SNOOZLEUMP: require("../../assets/demons/sloth.png"),
  WHISPERWHOMP: require("../../assets/demons/discouragement.png"),
  WOBBLEKNEES: require("../../assets/demons/fear.png"),
} as const satisfies Record<string, ImageSourcePropType>;

const demonArtworkByCategory = {
  ANGER: require("../../assets/demons/wrath.png"),
  CONFUSION: require("../../assets/demons/acedia.png"),
  DISCOURAGEMENT: require("../../assets/demons/discouragement.png"),
  DISTRACTION: require("../../assets/demons/distraction.png"),
  ENVY: require("../../assets/demons/envy.png"),
  FEAR: require("../../assets/demons/fear.png"),
  GLUTTONY: require("../../assets/demons/gluttony.png"),
  GOSSIP: require("../../assets/demons/gossip.png"),
  GREED: require("../../assets/demons/greed.png"),
  IMPURITY: require("../../assets/demons/lust.png"),
  PRIDE: require("../../assets/demons/pride.png"),
  SLOTH: require("../../assets/demons/sloth.png"),
} as const satisfies Record<string, ImageSourcePropType>;

export function getDemonArtwork({
  category,
  code,
}: Pick<DemonCatalogItem, "category" | "code">): ImageSourcePropType | undefined {
  return (
    demonArtworkByCode[code as keyof typeof demonArtworkByCode] ??
    demonArtworkByCategory[category as keyof typeof demonArtworkByCategory]
  );
}
