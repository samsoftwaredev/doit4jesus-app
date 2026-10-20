import type { ImageSourcePropType } from "react-native";

import type { RosaryArtStyle, RosaryBead, RosaryMystery } from "@/features/prayer/rosary/types";

import {
  holyTrinity,
  jesusCrownedWithThorns,
  jesusGivesSaintPeterTheKeys,
} from "../../../../../assets/images/mysteriesClassicArt";

interface RosaryBackgroundOptions {
  artStyle: RosaryArtStyle;
  bead?: RosaryBead;
  mystery?: RosaryMystery;
}

/**
 * Resolves the decorative background for the active Rosary step.
 * Comic sessions always keep their mystery image; classical sessions prioritize Pope intentions,
 * dedicated prayer artwork, and then bead-specific Hail Mary artwork in that order.
 */
export function getRosaryBackgroundImageSource({
  artStyle,
  bead,
  mystery,
}: RosaryBackgroundOptions): ImageSourcePropType | undefined {
  if (!mystery) return undefined;
  if (artStyle !== "classic") return mystery.imageSource;

  if (bead?.id.startsWith("pope-intentions-")) return jesusGivesSaintPeterTheKeys;
  if (bead?.prayerId === "glory-be") return holyTrinity;
  if (bead?.prayerId === "fatima-prayer") return jesusCrownedWithThorns;

  if (bead?.prayerId === "hail-mary" && bead.beadInDecade && bead.beadInDecade > 0) {
    const imageIndex = (bead.beadInDecade - 1) % mystery.backgroundImageSources.length;
    return mystery.backgroundImageSources[imageIndex] ?? mystery.imageSource;
  }

  return mystery.imageSource;
}
