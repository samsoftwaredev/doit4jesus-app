import englishRosaryJson from "@/data/en.rosary.json";
import { englishRosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import { getRosaryContent } from "@/features/prayer/rosary/data/localizedRosaryContent";
import {
  getRosaryMysteriesFromContent,
  getRosaryMysteryImageSource,
  getRosaryMysterySetsFromContent,
  rosaryMysterySets,
} from "@/features/prayer/rosary/data/rosaryMysteries";
import { getRosaryPrayers, prayerById } from "@/features/prayer/rosary/data/rosaryPrayers";
import { getFullRosarySequence, getRosarySequenceForLength } from "@/features/prayer/rosary/data/rosarySequence";
import { ROSARY_AUDIO_DURATIONS } from "@/features/prayer/rosary/data/rosaryAudioTiming";

import * as mysteryCartoonImages from "../../../../../assets/images/mysteriesCartoon";
import * as mysteryClassicArt from "../../../../../assets/images/mysteriesClassicArt";
import { ROSARY_AUDIO_SOURCES } from "../../../../../assets/audios";

describe("English Rosary content", () => {
  it("catalogs every canonical M4A asset exactly once under its matching language", () => {
    const files = Object.keys(ROSARY_AUDIO_SOURCES).sort();
    const catalogPaths = Object.values(englishRosaryContent.audio_catalog.assets)
      .map((asset) => asset.path)
      .sort();

    expect(files).toHaveLength(122);
    expect(catalogPaths).toEqual(files);
    expect(new Set(catalogPaths).size).toBe(122);
    expect(Object.keys(ROSARY_AUDIO_DURATIONS).sort()).toEqual(files);
    expect(Object.values(ROSARY_AUDIO_DURATIONS).every((duration) => duration > 0)).toBe(true);
    expect(
      Object.values(englishRosaryContent.audio_catalog.assets).every(
        (asset) =>
          asset.path.startsWith(`/assets/audios/${asset.language}/`) &&
          asset.path.endsWith(".m4a") &&
          Boolean(ROSARY_AUDIO_SOURCES[asset.path]),
      ),
    ).toBe(true);
    expect(JSON.stringify(englishRosaryContent)).not.toContain("/assets/rosary/audio/");
  });

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

  it("selects supplied classic artwork while retaining comic images as the default", () => {
    expect(getRosaryMysteryImageSource("first_joyful")).toBe(mysteryCartoonImages.firstJoyful);
    expect(getRosaryMysteryImageSource("first_joyful", "classic", () => 0)).toBe(mysteryClassicArt.firstJoyful[0]);
    expect(getRosaryMysteryImageSource("first_joyful", "classic", () => 0.999)).toBe(
      mysteryClassicArt.firstJoyful[mysteryClassicArt.firstJoyful.length - 1],
    );
  });

  it.each([
    {
      expectedImages: [
        mysteryCartoonImages.firstJoyful,
        mysteryCartoonImages.secondJoyful,
        mysteryCartoonImages.thirdJoyful,
        mysteryCartoonImages.fourthJoyful,
        mysteryCartoonImages.fifthJoyful,
      ],
      expectedKeys: ["first_joyful", "second_joyful", "third_joyful", "fourth_joyful", "fifth_joyful"],
      type: "joyful",
    },
    {
      expectedImages: [
        mysteryCartoonImages.firstLuminous,
        mysteryCartoonImages.secondLuminous,
        mysteryCartoonImages.thirdLuminous,
        mysteryCartoonImages.fourthLuminous,
        mysteryCartoonImages.fifthLuminous,
      ],
      expectedKeys: ["first_luminous", "second_luminous", "third_luminous", "fourth_luminous", "fifth_luminous"],
      type: "luminous",
    },
    {
      expectedImages: [
        mysteryCartoonImages.firstSorrowful,
        mysteryCartoonImages.secondSorrowful,
        mysteryCartoonImages.thirdSorrowful,
        mysteryCartoonImages.fourthSorrowful,
        mysteryCartoonImages.fifthSorrowful,
      ],
      expectedKeys: ["first_sorrowful", "second_sorrowful", "third_sorrowful", "fourth_sorrowful", "fifth_sorrowful"],
      type: "sorrowful",
    },
    {
      expectedImages: [
        mysteryCartoonImages.firstGlorious,
        mysteryCartoonImages.secondGlorious,
        mysteryCartoonImages.thirdGlorious,
        mysteryCartoonImages.fourthGlorious,
        mysteryCartoonImages.fifthGlorious,
      ],
      expectedKeys: ["first_glorious", "second_glorious", "third_glorious", "fourth_glorious", "fifth_glorious"],
      type: "glorious",
    },
  ] as const)("maps every $type mystery to its bundled cartoon image", ({ expectedImages, expectedKeys, type }) => {
    const jsonSet = englishRosaryJson.mystery_sets.find((set) => set.id === type);
    const mysteries = getRosaryMysteriesFromContent(englishRosaryContent, type);
    const typeName = `${type[0].toUpperCase()}${type.slice(1)}`;
    const expectedPaths = expectedKeys.map((key) => {
      const ordinal = key.split("_")[0];
      return `/assets/images/mysteriesCartoon/${type}/${ordinal}${typeName}.svg`;
    });

    expect(jsonSet?.mysteries.map((mystery) => mystery.app_image_key)).toEqual(expectedKeys);
    expect(jsonSet?.mysteries.map((mystery) => mystery.image)).toEqual(expectedPaths);
    expect(mysteries.map((mystery) => mystery.imageSource)).toEqual(expectedImages);
    expect(mysteries.map((mystery) => mystery.imageAlt)).toEqual(
      mysteries.map((mystery) => `An illustration for the Rosary mystery "${mystery.title}".`),
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

  it("resolves English mystery introductions before the current prayer", () => {
    const sequence = getFullRosarySequence(englishRosaryContent, "joyful");
    const firstMystery = sequence.find((bead) => bead.mysteryId === "the_annunciation" && bead.beadInDecade === 0);

    expect(firstMystery?.audioQueue).toEqual([
      "/assets/audios/en/mysteries/joyful/firstJoyfulMysteryTitle.m4a",
      "/assets/audios/en/mysteries/joyful/firstJoyfulMysteryDescription.m4a",
      "/assets/audios/en/prayers/ourFather.m4a",
    ]);
  });

  it("adds the selected closing prayers without adding physical beads", () => {
    const short = getRosarySequenceForLength(englishRosaryContent, "joyful", "short");
    const medium = getRosarySequenceForLength(englishRosaryContent, "joyful", "medium");
    const long = getRosarySequenceForLength(englishRosaryContent, "joyful", "long");

    expect([short.length, medium.length, long.length]).toEqual([68, 78, 79]);
    expect([short, medium, long].map((sequence) => sequence.filter((step) => step.isPhysicalBead).length)).toEqual([
      59, 59, 59,
    ]);
    expect(short.at(-1)?.prayerId).toBe("sign-of-cross");
    expect(medium.slice(-5).map((step) => step.id)).toEqual([
      "pope-intentions-our-father",
      "pope-intentions-hail-mary",
      "pope-intentions-glory-be",
      "saint-michael",
      "joyful_sign_of_cross_closing",
    ]);
    expect(medium.find((step) => step.id === "saint-michael")?.audioQueue).toEqual([
      "/assets/audios/en/prayers/saintMichel.m4a",
    ]);
    expect(long.slice(-6).map((step) => step.id)).toEqual([
      "pope-intentions-our-father",
      "pope-intentions-hail-mary",
      "pope-intentions-glory-be",
      "saint-michael",
      "litany-of-loreto",
      "joyful_sign_of_cross_closing",
    ]);
    expect(long.slice(-6, -1).every((step) => step.isPhysicalBead === false)).toBe(true);
    expect(long.at(-2)?.prayer?.text).toContain("Mother of Hope");
    expect(long.find((step) => step.id === "saint-michael")?.audioQueue).toEqual([
      "/assets/audios/en/prayers/saintMichel.m4a",
    ]);
  });

  it("omits Fatima Prayers and Hail, Holy Queen from the short Rosary", () => {
    const sequence = getRosarySequenceForLength(englishRosaryContent, "joyful", "short");

    expect(sequence).toHaveLength(68);
    expect(sequence.filter((step) => step.isPhysicalBead)).toHaveLength(59);
    expect(sequence.some((step) => step.type === "fatimaPrayer" || step.type === "hailHolyQueen")).toBe(false);
    expect(sequence.at(-1)).toEqual(
      expect.objectContaining({ prayerId: "sign-of-cross", section: "closing", type: "signOfCross" }),
    );
  });
});

describe("Spanish Rosary content", () => {
  const content = getRosaryContent("es");

  it("keeps the complete structure and stable identifiers while translating all four sets", () => {
    expect(content.language).toBe("es");
    expect(content.mystery_sets.map((set) => set.id)).toEqual(englishRosaryContent.mystery_sets.map((set) => set.id));
    expect(getRosaryMysterySetsFromContent(content).map((set) => set.title)).toEqual([
      "Misterios Gozosos",
      "Misterios Dolorosos",
      "Misterios Gloriosos",
      "Misterios Luminosos",
    ]);
  });

  it("uses Spanish prayers, mystery reflections, and Scripture at every displayed Scripture step", () => {
    expect(getRosaryPrayers(content).find((prayer) => prayer.id === "hail-mary")).toEqual(
      expect.objectContaining({ name: "Ave María", text: expect.stringContaining("Dios te salve, María") }),
    );
    expect(getRosaryMysteriesFromContent(content, "joyful")[0]).toEqual(
      expect.objectContaining({ fruit: "Humildad", title: "La Anunciación" }),
    );

    const sequence = getFullRosarySequence(content, "joyful");
    expect(sequence).toHaveLength(74);
    expect(sequence.filter((step) => step.scriptureText).every((step) => !step.scriptureText?.includes("The "))).toBe(
      true,
    );
    expect(sequence.find((step) => step.scriptureReference === "Luke 1:28")?.scriptureText).toContain(
      "El ángel Gabriel",
    );
  });

  it("uses only Spanish audio and tolerates the missing first Sorrowful description", () => {
    const sequence = getFullRosarySequence(content, "sorrowful");
    const firstMystery = sequence.find((bead) => bead.mysteryId === "agony_in_the_garden" && bead.beadInDecade === 0);

    expect(firstMystery?.audioQueue).toEqual([
      "/assets/audios/es/mysteries/sorrowful/firstSorrowfulMysteryFruit.m4a",
      "/assets/audios/es/prayers/ourFather.m4a",
    ]);
    expect(sequence.flatMap((bead) => bead.audioQueue ?? []).every((path) => path.includes("/audios/es/"))).toBe(true);
  });

  it("plays localized Saint Michael audio in Classic and Long Rosaries", () => {
    const classic = getRosarySequenceForLength(content, "joyful", "medium");
    const long = getRosarySequenceForLength(content, "joyful", "long");

    expect(classic.find((bead) => bead.id === "saint-michael")?.audioQueue).toEqual([
      "/assets/audios/es/prayers/sanMiguel.m4a",
    ]);
    expect(long.find((bead) => bead.id === "saint-michael")?.audioQueue).toEqual([
      "/assets/audios/es/prayers/sanMiguel.m4a",
    ]);
    expect(long.find((bead) => bead.id === "litany-of-loreto")?.audioQueue).toEqual([
      "/assets/audios/es/prayers/litanyOfLoreto.m4a",
    ]);
  });

  it("localizes the additional closing prayers for medium and long sessions", () => {
    const sequence = getRosarySequenceForLength(content, "joyful", "long");
    expect(sequence.find((step) => step.id === "pope-intentions-our-father")?.prayer?.name).toBe(
      "Padre Nuestro por las intenciones del Papa",
    );
    expect(sequence.find((step) => step.id === "litany-of-loreto")?.prayer?.text).toContain("Reina de la paz");
  });
});
