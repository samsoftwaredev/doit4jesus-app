import { englishRosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import {
  getRosaryMysteriesFromContent,
  getRosaryMysteryImageSources,
} from "@/features/prayer/rosary/data/rosaryMysteries";
import { getRosaryBackgroundImageSource } from "@/features/prayer/rosary/data/rosaryBackgrounds";
import type { RosaryBead } from "@/features/prayer/rosary/types";

import * as mysteryCartoonImages from "../../../../../assets/images/mysteriesCartoon";
import * as mysteryClassicArt from "../../../../../assets/images/mysteriesClassicArt";

function createBead(overrides: Partial<RosaryBead>): RosaryBead {
  return {
    id: "test-bead",
    prayerId: "our-father",
    sequence: 1,
    type: "ourFather",
    ...overrides,
  };
}

describe("Rosary backgrounds", () => {
  it("builds a stable shuffled collection without mutating the bundled classic artwork", () => {
    const original = [...mysteryClassicArt.firstJoyful];

    const first = getRosaryMysteryImageSources("first_joyful", "classic", () => 0.25);
    const second = getRosaryMysteryImageSources("first_joyful", "classic", () => 0.25);

    expect(first).toEqual(second);
    expect(first).toHaveLength(original.length);
    expect(new Set(first).size).toBe(first.length);
    expect(mysteryClassicArt.firstJoyful).toEqual(original);
  });

  it("retains a single comic image instead of rotating classic artwork", () => {
    expect(getRosaryMysteryImageSources("first_joyful", "comic")).toEqual([mysteryCartoonImages.firstJoyful]);
  });

  it("provides at least ten unique classic images for every mystery", () => {
    const imageKeys = englishRosaryContent.mystery_sets.flatMap((set) =>
      set.mysteries.map((mystery) => mystery.app_image_key),
    );

    for (const imageKey of imageKeys) {
      const images = getRosaryMysteryImageSources(imageKey, "classic", () => 0.5);
      expect(images.length).toBeGreaterThanOrEqual(10);
      expect(new Set(images).size).toBe(images.length);
    }
  });

  it("omits known byte-identical files from selectable image collections", () => {
    expect(mysteryClassicArt.secondLuminous).not.toContain(
      require("../../../../../assets/images/mysteriesClassicArt/luminous/weddingAtCana/secondLuminous07.jpg"),
    );
    expect(mysteryClassicArt.secondLuminous).not.toContain(
      require("../../../../../assets/images/mysteriesClassicArt/luminous/weddingAtCana/secondLuminous14.jpg"),
    );
    expect(mysteryClassicArt.fourthLuminous).not.toContain(
      require("../../../../../assets/images/mysteriesClassicArt/luminous/transfiguration/fourthLuminous14.png"),
    );
    expect(mysteryClassicArt.fifthLuminous).not.toContain(
      require("../../../../../assets/images/mysteriesClassicArt/luminous/institutionOfTheEucharist/fifthLuminous13.jpg"),
    );
    expect(mysteryClassicArt.secondGlorious).not.toContain(
      require("../../../../../assets/images/mysteriesClassicArt/glorious/ascension/secondGlorious13.jpg"),
    );
    expect(mysteryClassicArt.thirdSorrowful).not.toContain(
      require("../../../../../assets/images/mysteriesClassicArt/sorrowful/crowningWithThorns/thirdSorrowful16.jpg"),
    );
  });

  it("uses ten different mystery images for the decade Hail Mary beads", () => {
    const mystery = getRosaryMysteriesFromContent(englishRosaryContent, "joyful", "classic", () => 0.5)[0];
    const backgrounds = Array.from({ length: 10 }, (_, index) =>
      getRosaryBackgroundImageSource({
        artStyle: "classic",
        bead: createBead({ beadInDecade: index + 1, prayerId: "hail-mary", type: "hailMary" }),
        mystery,
      }),
    );

    expect(backgrounds).toEqual(mystery.backgroundImageSources.slice(0, 10));
    expect(new Set(backgrounds).size).toBe(10);
  });

  it("rotates the three opening Hail Marys through first-mystery artwork", () => {
    const mystery = getRosaryMysteriesFromContent(englishRosaryContent, "joyful", "classic", () => 0.5)[0];
    const backgrounds = [1, 2, 3].map((beadInDecade) =>
      getRosaryBackgroundImageSource({
        artStyle: "classic",
        bead: createBead({ beadInDecade, prayerId: "hail-mary", section: "opening", type: "hailMary" }),
        mystery,
      }),
    );

    expect(backgrounds).toEqual(mystery.backgroundImageSources.slice(0, 3));
    expect(new Set(backgrounds).size).toBe(3);
  });

  it("applies special classic prayer artwork with Pope-intention precedence", () => {
    const mystery = getRosaryMysteriesFromContent(englishRosaryContent, "joyful", "classic", () => 0.5)[0];

    expect(
      getRosaryBackgroundImageSource({
        artStyle: "classic",
        bead: createBead({ prayerId: "glory-be", type: "gloryBe" }),
        mystery,
      }),
    ).toBe(mysteryClassicArt.holyTrinity);
    expect(
      getRosaryBackgroundImageSource({
        artStyle: "classic",
        bead: createBead({ prayerId: "fatima-prayer", type: "fatimaPrayer" }),
        mystery,
      }),
    ).toBe(mysteryClassicArt.jesusCrownedWithThorns);

    for (const bead of [
      createBead({ id: "pope-intentions-our-father" }),
      createBead({ id: "pope-intentions-hail-mary", prayerId: "hail-mary", type: "hailMary" }),
      createBead({ id: "pope-intentions-glory-be", prayerId: "glory-be", type: "gloryBe" }),
    ]) {
      expect(getRosaryBackgroundImageSource({ artStyle: "classic", bead, mystery })).toBe(
        mysteryClassicArt.jesusGivesSaintPeterTheKeys,
      );
    }
  });

  it("keeps the mystery image for other classic prayers and every comic prayer", () => {
    const mystery = getRosaryMysteriesFromContent(englishRosaryContent, "joyful", "classic", () => 0.5)[0];
    const gloryBe = createBead({ prayerId: "glory-be", type: "gloryBe" });
    const ourFather = createBead({});

    expect(getRosaryBackgroundImageSource({ artStyle: "classic", bead: ourFather, mystery })).toBe(mystery.imageSource);
    expect(getRosaryBackgroundImageSource({ artStyle: "comic", bead: gloryBe, mystery })).toBe(mystery.imageSource);
  });
});
