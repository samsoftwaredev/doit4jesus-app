import englishRosaryJson from "@/data/en.rosary.json";
import { englishRosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import { getRosaryMysteriesFromContent, rosaryMysterySets } from "@/features/prayer/rosary/data/rosaryMysteries";
import { prayerById } from "@/features/prayer/rosary/data/rosaryPrayers";
import { getFullRosarySequence } from "@/features/prayer/rosary/data/rosarySequence";

describe("English Rosary content", () => {
  it("builds the four app mystery sets from the JSON data while preserving their display order", () => {
    expect(rosaryMysterySets.map((set) => set.type)).toEqual(["joyful", "sorrowful", "glorious", "luminous"]);
    expect(rosaryMysterySets.every((set) => set.mysteries.length === 5)).toBe(true);
    expect(
      rosaryMysterySets
        .flatMap((set) => set.mysteries)
        .every((mystery) => mystery.fruit.trim() && mystery.fruitDescription.trim()),
    ).toBe(true);
  });

  it("maps mystery content and bundled image metadata from the JSON data", () => {
    const joyfulJson = englishRosaryJson.mystery_sets.find((set) => set.id === "joyful");
    const mysteries = getRosaryMysteriesFromContent(englishRosaryContent, "joyful");

    expect(mysteries[0]).toEqual(
      expect.objectContaining({
        id: joyfulJson?.mysteries[0].id,
        title: joyfulJson?.mysteries[0].title,
        imageAlt: joyfulJson?.mysteries[0].image_alt,
        fruit: "Humility",
        fruitDescription:
          "Mary receives God's message with trust and calls herself his servant. Ask for grace to surrender pride and welcome God's will with a humble heart.",
        scriptureReference: joyfulJson?.mysteries[0].primary_scripture,
        scriptureText: joyfulJson?.mysteries[0].scripture_text,
      }),
    );
    expect(mysteries[0].imageSource).toBeTruthy();
    expect(mysteries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fruit: "Poverty of Spirit",
          fruitDescription:
            "Jesus is born in a humble manger, revealing that true riches are found in God. Ask for grace to loosen attachment to material wealth and treasure what draws the heart toward him.",
          title: "The Nativity",
        }),
      ]),
    );
  });

  it("uses the JSON prayer library as the prayer text source", () => {
    expect(prayerById["hail-mary"]).toEqual(
      expect.objectContaining({
        name: englishRosaryJson.prayer_library.hail_mary.title,
        text: englishRosaryJson.prayer_library.hail_mary.text,
      }),
    );
    expect(englishRosaryJson.prayer_library).toHaveProperty("sign_of_cross", {
      title: "Sign of the Cross",
      text: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
    });
  });

  it.each(["joyful", "luminous", "sorrowful", "glorious"] as const)(
    "builds the complete %s Rosary prayer sequence from the JSON data",
    (mysteryType) => {
      const sequence = getFullRosarySequence(englishRosaryContent, mysteryType);

      expect(sequence).toHaveLength(74);
      expect(sequence.filter((bead) => bead.isPhysicalBead)).toHaveLength(59);
      expect(sequence.map((bead) => bead.type)).toEqual(
        expect.arrayContaining([
          "signOfCross",
          "creed",
          "ourFather",
          "hailMary",
          "gloryBe",
          "fatimaPrayer",
          "hailHolyQueen",
        ]),
      );
      expect(sequence[0]).toEqual(
        expect.objectContaining({
          prayer: expect.objectContaining({
            name: "Sign of the Cross",
            text: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
          }),
          isPhysicalBead: false,
          prayerId: "sign-of-cross",
          section: "opening",
          type: "signOfCross",
        }),
      );
      expect(sequence[1]).toEqual(
        expect.objectContaining({ prayerId: "apostles-creed", section: "opening", type: "creed" }),
      );
      expect(sequence.at(-2)).toEqual(
        expect.objectContaining({ prayerId: "hail-holy-queen", section: "closing", type: "hailHolyQueen" }),
      );
      expect(sequence.at(-1)).toEqual(
        expect.objectContaining({
          isPhysicalBead: false,
          prayerId: "sign-of-cross",
          section: "closing",
          type: "signOfCross",
        }),
      );
    },
  );

  it("preserves the bead-specific mystery and Scripture content from the JSON data", () => {
    const sequence = getFullRosarySequence(englishRosaryContent, "joyful");

    expect(sequence.find((bead) => bead.scriptureReference === "Luke 1:28")).toEqual(
      expect.objectContaining({
        decade: 1,
        mysteryId: "the_annunciation",
        prayerId: "hail-mary",
        scriptureReference: "Luke 1:28",
        scriptureText: "Hail, thou that art highly favoured, the Lord is with thee: blessed art thou among women.",
      }),
    );
  });
});
