import type { ImageSourcePropType } from "react-native";

import type { DemonCatalogItem } from "./demons.types";

const demonArtworkByCode = {
  BRAGGLESNOUT: require("../../../assets/images/demons/pride.png"),
  FOGGLES: require("../../../assets/images/demons/acedia.png"),
  GOSSIPGOB: require("../../../assets/images/demons/gossip.png"),
  GRUMBLEPUFF: require("../../../assets/images/demons/wrath.png"),
  PEEKABOOZE: require("../../../assets/images/demons/envy.png"),
  SCROLLZILLA: require("../../../assets/images/demons/distraction.png"),
  SHINYGRAB: require("../../../assets/images/demons/greed.png"),
  SNEAKYPEEKY: require("../../../assets/images/demons/lust.png"),
  SNACKASAURUS: require("../../../assets/images/demons/gluttony.png"),
  SNOOZLEUMP: require("../../../assets/images/demons/sloth.png"),
  WHISPERWHOMP: require("../../../assets/images/demons/discouragement.png"),
  WOBBLEKNEES: require("../../../assets/images/demons/fear.png"),
} as const satisfies Record<string, ImageSourcePropType>;

const demonArtworkByCategory = {
  ANGER: require("../../../assets/images/demons/wrath.png"),
  CONFUSION: require("../../../assets/images/demons/acedia.png"),
  DISCOURAGEMENT: require("../../../assets/images/demons/discouragement.png"),
  DISTRACTION: require("../../../assets/images/demons/distraction.png"),
  ENVY: require("../../../assets/images/demons/envy.png"),
  FEAR: require("../../../assets/images/demons/fear.png"),
  GLUTTONY: require("../../../assets/images/demons/gluttony.png"),
  GOSSIP: require("../../../assets/images/demons/gossip.png"),
  GREED: require("../../../assets/images/demons/greed.png"),
  IMPURITY: require("../../../assets/images/demons/lust.png"),
  PRIDE: require("../../../assets/images/demons/pride.png"),
  SLOTH: require("../../../assets/images/demons/sloth.png"),
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
