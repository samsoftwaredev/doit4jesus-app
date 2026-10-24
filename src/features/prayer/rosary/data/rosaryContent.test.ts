import englishRosaryJson from "@/data/en.rosary.json";
import { getRosaryContent } from "@/features/prayer/rosary/data/localizedRosaryContent";
import { ROSARY_AUDIO_DURATIONS } from "@/features/prayer/rosary/data/rosaryAudioTiming";
import { englishRosaryContent } from "@/features/prayer/rosary/data/rosaryContent";
import {
  getRosaryMysteriesFromContent,
  getRosaryMysteryImageSource,
  getRosaryMysterySetsFromContent,
  rosaryMysterySets,
} from "@/features/prayer/rosary/data/rosaryMysteries";
import { getRosaryPrayers, prayerById } from "@/features/prayer/rosary/data/rosaryPrayers";
import { getRosaryIntroAudioPath } from "@/features/prayer/rosary/data/rosaryAudio";
import {
  createRosarySequence,
  getFullRosarySequence,
  getRosarySequenceForLength,
} from "@/features/prayer/rosary/data/rosarySequence";

import { ROSARY_AUDIO_SOURCES } from "../../../../../assets/audios";
import * as mysteryCartoonImages from "../../../../../assets/images/mysteriesCartoon";
import * as mysteryClassicArt from "../../../../../assets/images/mysteriesClassicArt";

const expectedNabreHailMaryReferences: Record<string, readonly string[]> = {
  the_annunciation: [
    "Luke 1:26b",
    "Luke 1:27a",
    "Luke 1:27b",
    "Luke 1:28",
    "Luke 1:30b",
    "Luke 1:31",
    "Luke 1:34",
    "Luke 1:35b",
    "Luke 1:35",
    "Luke 1:38a",
  ],
  the_visitation: [
    "Luke 1:39b",
    "Luke 1:40",
    "Luke 1:41a",
    "Luke 1:41b,42a",
    "Luke 1:42b",
    "Luke 1:45",
    "Luke 1:46-47",
    "Luke 1:48a",
    "Luke 1:49",
    "Luke 1:56",
  ],
  the_nativity: [
    "Luke 2:1",
    "Luke 2:4a",
    "Luke 2:5",
    "Luke 2:6",
    "John 1:14a",
    "Luke 2:7b",
    "Luke 2:8a,b",
    "Luke 2:10a",
    "Luke 2:11",
    "Matthew 2:2b",
  ],
  the_presentation: [
    "Luke 2:22b",
    "Luke 2:23b",
    "Luke 2:25a",
    "Luke 2:25b",
    "Luke 2:26",
    "Luke 2:27a",
    "Luke 2:28",
    "Luke 2:29",
    "Luke 2:30-31",
    "Luke 2:32",
  ],
  finding_jesus_in_the_temple: [
    "Luke 2:41",
    "Luke 2:42",
    "Luke 2:43a",
    "Luke 2:44a",
    "Luke 2:45",
    "Luke 2:46",
    "Luke 2:47",
    "Luke 2:48b",
    "Luke 2:49a",
    "Luke 2:49b",
  ],
  baptism_of_jesus: [
    "Matthew 3:1",
    "Mark 1:5a,b",
    "Mark 1:7b",
    "Matthew 3:13",
    "John 1:29b",
    "Matthew 3:14b",
    "Matthew 3:15",
    "John 1:32b",
    "John 1:33b",
    "Matthew 3:17b",
  ],
  wedding_at_cana: [
    "John 2:1",
    "John 2:3b",
    "John 2:4b",
    "John 2:5",
    "John 2:7",
    "John 2:8",
    "John 2:9a",
    "John 2:9b,10a",
    "John 2:10a",
    "John 2:11",
  ],
  proclamation_of_the_kingdom: [
    "Mark 1:14",
    "Mark 1:15a",
    "Mark 1:15b",
    "Matthew 6:33a",
    "Matthew 5:10",
    "Matthew 13:33b",
    "Matthew 13:44a",
    "Matthew 13:44b",
    "Matthew 18:3b",
    "John 18:36a",
  ],
  the_transfiguration: [
    "Luke 9:28b",
    "Luke 9:29",
    "Mark 9:2b",
    "Luke 9:30",
    "Mark 9:5a",
    "Matthew 17:5a",
    "Mark 9:7b",
    "Matthew 17:6",
    "Matthew 17:7",
    "Matthew 17:8",
  ],
  institution_of_the_eucharist: [
    "Luke 22:14",
    "Luke 22:15",
    "Luke 22:16",
    "Mark 14:22a",
    "Luke 22:19b",
    "Matthew 26:27",
    "Matthew 26:28a",
    "Matthew 26:28b",
    "John 6:56",
    "Matthew 26:30",
  ],
  agony_in_the_garden: [
    "John 18:1a",
    "Luke 22:40",
    "Mark 14:34b",
    "Matthew 26:39",
    "Mark 14:36a",
    "Mark 14:36b",
    "Luke 22:44b",
    "Matthew 26:40b",
    "Matthew 26:41b",
    "Matthew 26:46",
  ],
  scourging_at_the_pillar: [
    "Matthew 26:59a",
    "Mark 14:61b",
    "Mark 14:62a",
    "Mark 14:64b",
    "Luke 23:20",
    "Luke 23:22b",
    "Luke 23:22b",
    "John 19:1",
    "Luke 23:23",
    "Matthew 27:25b",
  ],
  crowning_with_thorns: [
    "Mark 15:16a",
    "Matthew 27:27b",
    "Mark 15:17a",
    "John 19:2a",
    "Matthew 27:29b",
    "Matthew 27:30",
    "Mark 15:19b",
    "John 19:5",
    "Matthew 27:31a",
    "Matthew 27:31b",
  ],
  carrying_of_the_cross: [
    "Luke 23:25b",
    "John 19:17a",
    "Luke 23:26a",
    "Luke 23:26b",
    "Luke 23:27",
    "Luke 23:28a",
    "Luke 23:28b",
    "Luke 23:29a",
    "Luke 23:31",
    "Mark 15:22",
  ],
  the_crucifixion: [
    "Luke 23:33b",
    "Mark 15:26",
    "Luke 23:34a",
    "Luke 23:34b",
    "Luke 23:42",
    "Luke 23:43",
    "Mark 15:29a, 30",
    "John 19:28b",
    "Luke 23:46b",
    "John 19:34",
  ],
  the_resurrection: [
    "Luke 24:1",
    "Mark 16:3a",
    "Matthew 28:2b",
    "Matthew 28:4",
    "Luke 24:3",
    "Matthew 28:5b",
    "Matthew 28:6a",
    "Mark 16:7b",
    "Matthew 28:8a,8b",
    "Matthew 28:9",
  ],
  the_ascension: [
    "John 16:28a",
    "John 16:28b",
    "John 20:17b",
    "John 14:1a, 2a",
    "Luke 24:51",
    "Mark 16:19a, 19b",
    "Acts 1:10b",
    "Acts 1:11a",
    "Acts 1:11b",
    "Luke 24:52-53",
  ],
  descent_of_the_holy_spirit: [
    "Luke 24:49a",
    "John 14:17a",
    "John 14:17b",
    "Acts 2:1",
    "Acts 2:2",
    "Acts 2:3",
    "Acts 2:4a",
    "Acts 2:7b",
    "Acts 2:11b",
    "Acts 2:12",
  ],
  the_assumption: [
    "Leviticus 19:3",
    "John 5:21",
    "John 10:28a",
    "Song of Songs 2:10b",
    "1 Cor 15:54b",
    "John 17:24a",
    "Romans 8:11b",
    "John 14:3b",
    "Luke 1:48b",
    "Rev 11:19a",
  ],
  the_coronation: [
    "Revelation 12:1",
    "Wisdom 5:16a",
    "2 Timothy 2:12",
    "1 Kings 2:19b",
    "1 Kings 2:20b",
    "Psalm 45:10b",
    "Proverbs 31:29",
    "Job 36:7",
    "1 Peter 5:4",
    "Isaiah 61:10b",
  ],
};

const expectedPrimaryReferences: Record<string, string> = {
  the_annunciation: "Luke 1:26-38",
  the_visitation: "Luke 1:39-56",
  the_nativity: "Luke 2:1-20",
  the_presentation: "Luke 2:22-38",
  finding_jesus_in_the_temple: "Luke 2:41-52",
  baptism_of_jesus: "Matthew 3:13-17",
  wedding_at_cana: "John 2:1-12",
  proclamation_of_the_kingdom: "Mark 1:15, 2:3-13",
  the_transfiguration: "Mark 9:2-10",
  institution_of_the_eucharist: "Luke 22:14-20",
  agony_in_the_garden: "Mark 14:32-42",
  scourging_at_the_pillar: "Matthew 27:11-26",
  crowning_with_thorns: "Matthew 27:27-31",
  carrying_of_the_cross: "Luke 23:26-32",
  the_crucifixion: "John 19:17-37",
  the_resurrection: "Luke 24:1-12",
  the_ascension: "Acts 1:6-12",
  descent_of_the_holy_spirit: "Acts 2:1-13",
  the_assumption: "Revelation 11:19",
  the_coronation: "Revelation 12:1-5",
};

describe("English Rosary content", () => {
  it("catalogs every playback M4A asset exactly once under its matching language", () => {
    const files = Object.keys(ROSARY_AUDIO_SOURCES)
      .filter((path) => !path.startsWith("/assets/audios/en/mysteries/") || !path.endsWith("MysteryDescription.m4a"))
      .sort();
    const catalogPaths = Object.values(englishRosaryContent.audio_catalog.assets)
      .map((asset) => asset.path)
      .sort();

    expect(files).toHaveLength(101);
    expect(catalogPaths).toEqual(files);
    expect(new Set(catalogPaths).size).toBe(101);
    expect(
      Object.keys(ROSARY_AUDIO_DURATIONS)
        .filter((path) => !path.startsWith("/assets/audios/en/mysteries/") || !path.endsWith("MysteryDescription.m4a"))
        .sort(),
    ).toEqual(files);
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

  it.each(["joyful", "luminous", "sorrowful", "glorious"] as const)(
    "uses the alternate Fatima Prayer recording in the complete %s Rosary",
    (mysteryType) => {
      const fatimaPrayerSteps = getFullRosarySequence(englishRosaryContent, mysteryType).filter(
        (step) => step.prayerId === "fatima-prayer",
      );

      expect(fatimaPrayerSteps).toHaveLength(5);
      expect(fatimaPrayerSteps.map((step) => step.audioQueue)).toEqual(
        Array.from({ length: 5 }, () => ["/assets/audios/en/prayers/fatimaPrayerAlternate.m4a"]),
      );
    },
  );

  it("maps the PDF's 200 NABRE passages to the ten ordered Hail Marys in every mystery", () => {
    const mysteries = englishRosaryContent.mystery_sets.flatMap((set) => set.mysteries);

    for (const set of englishRosaryContent.mystery_sets) {
      for (const mystery of set.mysteries) {
        const hailMarySteps = set.prayer_sequence.filter(
          (step) => step.mystery_id === mystery.id && step.prayer_type === "hail_mary",
        );

        expect(hailMarySteps).toHaveLength(10);
        expect(hailMarySteps.map((step) => step.scripture_reference)).toEqual(
          expectedNabreHailMaryReferences[mystery.id],
        );
        expect(hailMarySteps.every((step) => Boolean(step.scripture_text?.trim()))).toBe(true);
        expect(
          set.prayer_sequence.filter((step) => step.mystery_id === mystery.id && step.scripture_text),
        ).toHaveLength(13);
        expect(mystery.scripture_text).toBe(hailMarySteps[0].scripture_text);
      }
    }

    expect(mysteries).toHaveLength(20);
    expect(mysteries.map((mystery) => [mystery.id, mystery.primary_scripture])).toEqual(
      mysteries.map((mystery) => [mystery.id, expectedPrimaryReferences[mystery.id]]),
    );
  });

  it("preserves NABRE wording, punctuation, brackets, and verse suffixes", () => {
    const sequences = englishRosaryContent.mystery_sets.flatMap((set) =>
      getFullRosarySequence(englishRosaryContent, set.id),
    );

    expect(sequences.find((bead) => bead.scriptureReference === "Luke 1:28")).toEqual(
      expect.objectContaining({
        decade: 1,
        mysteryId: "the_annunciation",
        prayerId: "hail-mary",
        scriptureReference: "Luke 1:28",
        scriptureText: "And coming to her, he said, “Hail, favored one! The Lord is with you.”",
      }),
    );
    expect(sequences.find((bead) => bead.scriptureReference === "Luke 23:34a")?.scriptureText).toBe(
      "[Then Jesus said, “Father, forgive them, they know not what they do.”]",
    );
    expect(sequences.find((bead) => bead.scriptureReference === "Rev 11:19a")?.scriptureText).toBe(
      "Then God’s temple in heaven was opened, and the ark of his covenant could be seen in the temple. ...",
    );
    expect(sequences.find((bead) => bead.scriptureReference === "Isaiah 61:10b")?.scriptureText).toBe(
      "... and wrapped me in a robe of justice, Like a bridegroom adorned with a diadem, as a bride adorns herself with her jewels.",
    );
    expect(
      [
        "joyful_bead_08",
        "joyful_bead_69",
        "luminous_bead_08",
        "luminous_bead_69",
        "sorrowful_bead_08",
        "sorrowful_bead_69",
        "glorious_bead_08",
        "glorious_bead_69",
      ].map((id) => sequences.find((bead) => bead.id === id)?.scriptureText),
    ).toEqual([
      "...the angel Gabriel was sent from God to a town of Galilee called Nazareth,",
      "Did you not know that I must be in my Father’s house?”",
      "In those days John the Baptist appeared, preaching in the desert of Judea",
      "Then, after singing a hymn, they went out to the Mount of Olives.",
      "... Jesus went out with his disciples across the Kidron valley to where there was a garden...",
      "but one soldier thrust his lance into his side, and immediately blood and water flowed out.",
      "But at daybreak on the first day of the week they took the spices they had prepared and went to the tomb.",
      "... and wrapped me in a robe of justice, Like a bridegroom adorned with a diadem, as a bride adorns herself with her jewels.",
    ]);
  });

  it("keeps the retained Our Father, Glory Be, and Fatima Scripture unchanged", () => {
    const sequence = getFullRosarySequence(englishRosaryContent, "joyful");
    expect(
      sequence
        .filter(
          (step) =>
            step.mysteryId === "the_annunciation" && ["ourFather", "gloryBe", "fatimaPrayer"].includes(step.type),
        )
        .map((step) => [step.id, step.scriptureReference, step.scriptureText]),
    ).toEqual([
      ["joyful_bead_07", "Luke 1:26", "The angel Gabriel was sent from God unto a city of Galilee, named Nazareth."],
      ["joyful_bead_18", "Luke 1:37", "For with God nothing shall be impossible."],
      ["joyful_bead_19", "Luke 1:38", "Behold the handmaid of the Lord; be it unto me according to thy word."],
    ]);
  });

  it("resolves English mystery introductions before the current prayer", () => {
    const sequence = getFullRosarySequence(englishRosaryContent, "joyful");
    const firstMystery = sequence.find((bead) => bead.mysteryId === "the_annunciation" && bead.beadInDecade === 0);

    expect(firstMystery?.audioQueue).toEqual([
      "/assets/audios/en/mysteries/joyful/firstJoyfulMysteryTitle.m4a",
      "/assets/audios/en/prayers/ourFather.m4a",
    ]);
  });

  it.each(["joyful", "luminous", "sorrowful", "glorious"] as const)(
    "plays the English three-Hail-Marys introduction once at the start of the %s opening group",
    (mysteryType) => {
      const openingHailMarys = getFullRosarySequence(englishRosaryContent, mysteryType).filter(
        (step) => step.section === "opening" && step.prayerId === "hail-mary",
      );

      expect(getRosaryIntroAudioPath(englishRosaryContent, "threeHailMaryFruits")).toBe(
        "/assets/audios/en/prayers/threeHailMaryFruits.m4a",
      );
      expect(openingHailMarys.map((step) => step.audioQueue)).toEqual([
        ["/assets/audios/en/prayers/threeHailMaryFruits.m4a", "/assets/audios/en/prayers/hailMary.m4a"],
        ["/assets/audios/en/prayers/hailMary.m4a"],
        ["/assets/audios/en/prayers/hailMary.m4a"],
      ]);
    },
  );

  it("keeps the focused decade free of the full-Rosary opening introduction", () => {
    expect(createRosarySequence(1, englishRosaryContent).flatMap((step) => step.audioQueue ?? [])).toEqual(
      Array.from({ length: 10 }, () => "/assets/audios/en/prayers/hailMary.m4a"),
    );
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

  it.each(["medium", "long"] as const)(
    "plays the English Pope-intentions introduction once before the closing Our Father in the %s Rosary",
    (length) => {
      const sequence = getRosarySequenceForLength(englishRosaryContent, "joyful", length);
      const popeGroup = sequence.filter((step) => step.id.startsWith("pope-intentions-"));

      expect(getRosaryIntroAudioPath(englishRosaryContent, "popeIntentions")).toBe(
        "/assets/audios/en/prayers/popeIntentions.m4a",
      );
      expect(popeGroup.map((step) => step.audioQueue)).toEqual([
        ["/assets/audios/en/prayers/popeIntentions.m4a", "/assets/audios/en/prayers/ourFather.m4a"],
        ["/assets/audios/en/prayers/hailMary.m4a"],
        ["/assets/audios/en/prayers/gloryBe.m4a"],
      ]);
    },
  );

  it("does not add the Pope-intentions group to the short Rosary", () => {
    expect(
      getRosarySequenceForLength(englishRosaryContent, "joyful", "short").some((step) =>
        step.id.startsWith("pope-intentions-"),
      ),
    ).toBe(false);
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

  it("uses Spanish prayers, mystery reflections, and step-specific Scripture at every displayed Scripture step", () => {
    expect(getRosaryPrayers(content).find((prayer) => prayer.id === "hail-mary")).toEqual(
      expect.objectContaining({ name: "Ave María", text: expect.stringContaining("Dios te salve, María") }),
    );
    expect(getRosaryMysteriesFromContent(content, "joyful")[0]).toEqual(
      expect.objectContaining({
        fruit: "Humildad",
        scriptureReference: "Lucas 1:26-38",
        scriptureText: "...el ángel Gabriel fue enviado por Dios a una ciudad de Galilea llamada Nazaret,",
        title: "La Anunciación",
      }),
    );

    const sequences = content.mystery_sets.flatMap((set) => getFullRosarySequence(content, set.id));
    const scriptureSteps = sequences.filter((step) => step.scriptureText);

    expect(scriptureSteps).toHaveLength(260);
    expect(scriptureSteps.every((step) => Boolean(step.scriptureReference?.trim() && step.scriptureText?.trim()))).toBe(
      true,
    );
    expect(
      scriptureSteps.every(
        (step) =>
          !/^(Luke|Matthew|Mark|John|Acts|Revelation|Wisdom|Song of Songs|Romans|Leviticus|Psalm|Proverbs|Isaiah)\b/.test(
            step.scriptureReference ?? "",
          ),
      ),
    ).toBe(true);
    expect(
      scriptureSteps.every(
        (step) =>
          !["1 Cor ", "1 Peter ", "2 Timothy ", "1 Kings ", "Rev "].some((book) =>
            step.scriptureReference?.startsWith(book),
          ),
      ),
    ).toBe(true);
    expect(sequences.find((step) => step.id === "joyful_bead_11")).toEqual(
      expect.objectContaining({
        scriptureReference: "Lucas 1:28",
        scriptureText: "Y entrando donde ella estaba, le dijo: “¡Salve, favorecida! El Señor está contigo.”",
      }),
    );
    expect(sequences.find((step) => step.id === "sorrowful_bead_62")?.scriptureText).toBe(
      "[Entonces Jesús dijo: “Padre, perdónalos, porque no saben lo que hacen.”]",
    );
    expect(sequences.find((step) => step.id === "glorious_bead_56")?.scriptureReference).toBe("Apocalipsis 11:19a");

    for (const set of content.mystery_sets) {
      for (const mystery of set.mysteries) {
        const mysteryScripture = set.prayer_sequence.filter(
          (step) => step.mystery_id === mystery.id && step.scripture_text,
        );
        expect(mysteryScripture).toHaveLength(13);
        expect(new Set(mysteryScripture.map((step) => step.scripture_text)).size).toBeGreaterThanOrEqual(11);
      }
    }
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

  it.each(["joyful", "luminous", "sorrowful", "glorious"] as const)(
    "plays the Spanish three-Hail-Marys introduction once at the start of the %s opening group",
    (mysteryType) => {
      const openingHailMarys = getFullRosarySequence(content, mysteryType).filter(
        (step) => step.section === "opening" && step.prayerId === "hail-mary",
      );

      expect(getRosaryIntroAudioPath(content, "threeHailMaryFruits")).toBe(
        "/assets/audios/es/prayers/threeHailMaryFruits.m4a",
      );
      expect(openingHailMarys.map((step) => step.audioQueue)).toEqual([
        ["/assets/audios/es/prayers/threeHailMaryFruits.m4a", "/assets/audios/es/prayers/hailMary.m4a"],
        ["/assets/audios/es/prayers/hailMary.m4a"],
        ["/assets/audios/es/prayers/hailMary.m4a"],
      ]);
      expect(
        openingHailMarys.flatMap((step) => step.audioQueue ?? []).every((path) => path.includes("/audios/es/")),
      ).toBe(true);
    },
  );

  it("plays localized Saint Michael audio in Classic and Long Rosaries", () => {
    const classic = getRosarySequenceForLength(content, "joyful", "medium");
    const long = getRosarySequenceForLength(content, "joyful", "long");

    expect(classic.find((bead) => bead.id === "saint-michael")?.audioQueue).toEqual([
      "/assets/audios/es/prayers/saintMichel.m4a",
    ]);
    expect(long.find((bead) => bead.id === "saint-michael")?.audioQueue).toEqual([
      "/assets/audios/es/prayers/saintMichel.m4a",
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

  it.each(["medium", "long"] as const)(
    "plays the Spanish Pope-intentions introduction once before the closing Our Father in the %s Rosary",
    (length) => {
      const sequence = getRosarySequenceForLength(content, "joyful", length);
      const popeGroup = sequence.filter((step) => step.id.startsWith("pope-intentions-"));

      expect(getRosaryIntroAudioPath(content, "popeIntentions")).toBe("/assets/audios/es/prayers/popeIntentions.m4a");
      expect(popeGroup.map((step) => step.audioQueue)).toEqual([
        ["/assets/audios/es/prayers/popeIntentions.m4a", "/assets/audios/es/prayers/ourFather.m4a"],
        ["/assets/audios/es/prayers/hailMary.m4a"],
        ["/assets/audios/es/prayers/gloryBe.m4a"],
      ]);
      expect(popeGroup.flatMap((step) => step.audioQueue ?? []).every((path) => path.includes("/audios/es/"))).toBe(
        true,
      );
    },
  );
});
