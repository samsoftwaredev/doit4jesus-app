import type { RosaryMystery, RosaryMysterySet, RosaryMysteryType } from "@/features/prayer/rosary/types";

import { rosaryPrayers } from "./rosaryPrayers";

type MysterySeed = Omit<RosaryMystery, "category" | "prayers">;

function createMysteries(category: RosaryMystery["category"], mysteries: MysterySeed[]): RosaryMystery[] {
  return mysteries.map((mystery) => ({ ...mystery, category, prayers: rosaryPrayers }));
}

const joyfulMysteries = createMysteries("Joyful Mysteries", [
  {
    id: "annunciation",
    title: "The Annunciation",
    imageSource: require("../../../../assets/saints/blessed-virgin-mary.png"),
    imageAlt: "A devotional image of Mary for the mystery of the Annunciation.",
    scriptureReference: "Luke 1:38",
    scriptureText: "Behold the handmaid of the Lord; be it done unto me according to thy word.",
  },
  {
    id: "visitation",
    title: "The Visitation",
    imageSource: require("../../../../assets/saints/saint-monica.png"),
    imageAlt: "A devotional image for the mystery of the Visitation.",
    scriptureReference: "Luke 1:42",
    scriptureText: "Blessed art thou among women, and blessed is the fruit of thy womb.",
  },
  {
    id: "nativity",
    title: "The Nativity",
    imageSource: require("../../../../assets/backgrounds/cathedralDesktop.png"),
    imageAlt: "A sacred church interior for the mystery of the Nativity.",
    scriptureReference: "Luke 2:7",
    scriptureText: "And she brought forth her firstborn son, and wrapped him in swaddling clothes.",
  },
  {
    id: "presentation",
    title: "The Presentation",
    imageSource: require("../../../../assets/flowers/whiteLily.png"),
    imageAlt: "White lilies representing the mystery of the Presentation.",
    scriptureReference: "Luke 2:22",
    scriptureText: "They brought him to Jerusalem, to present him to the Lord.",
  },
  {
    id: "finding-in-the-temple",
    title: "The Finding in the Temple",
    imageSource: require("../../../../assets/virtues/bible.png"),
    imageAlt: "A Bible representing the mystery of Finding Jesus in the Temple.",
    scriptureReference: "Luke 2:46",
    scriptureText: "After three days they found him in the temple, sitting in the midst of the doctors.",
  },
]);

const sorrowfulMysteries = createMysteries("Sorrowful Mysteries", [
  {
    id: "agony-in-the-garden",
    title: "The Agony in the Garden",
    imageSource: require("../../../../assets/saints/saint-padre-pio.png"),
    imageAlt: "A devotional image for the Agony in the Garden.",
    scriptureReference: "Luke 22:44",
    scriptureText: "And being in an agony he prayed the longer.",
  },
  {
    id: "scourging-at-the-pillar",
    title: "The Scourging at the Pillar",
    imageSource: require("../../../../assets/saints/saint-sebastian.png"),
    imageAlt: "A devotional image for the Scourging at the Pillar.",
    scriptureReference: "John 19:1",
    scriptureText: "Then therefore Pilate took Jesus, and scourged him.",
  },
  {
    id: "crowning-with-thorns",
    title: "The Crowning with Thorns",
    imageSource: require("../../../../assets/saints/saint-joan-of-arc.png"),
    imageAlt: "A devotional image for the Crowning with Thorns.",
    scriptureReference: "Mark 15:17",
    scriptureText: "And they clothed him with purple, and plaiting a crown of thorns, put it upon him.",
  },
  {
    id: "carrying-of-the-cross",
    title: "The Carrying of the Cross",
    imageSource: require("../../../../assets/saints/saint-francis-xavier.png"),
    imageAlt: "A devotional image for the Carrying of the Cross.",
    scriptureReference: "Luke 23:26",
    scriptureText: "They laid the cross on him, to carry after Jesus.",
  },
  {
    id: "crucifixion",
    title: "The Crucifixion",
    imageSource: require("../../../../assets/backgrounds/cathedralTablet.png"),
    imageAlt: "A sacred church interior for the Crucifixion.",
    scriptureReference: "Luke 23:46",
    scriptureText: "Father, into thy hands I commend my spirit.",
  },
]);

const gloriousMysteries = createMysteries("Glorious Mysteries", [
  {
    id: "resurrection",
    title: "The Resurrection",
    imageSource: require("../../../../assets/saints/saint-michael-the-archangel.png"),
    imageAlt: "A devotional image for the Resurrection.",
    scriptureReference: "Matthew 28:6",
    scriptureText: "He is not here, for he is risen, as he said.",
  },
  {
    id: "ascension",
    title: "The Ascension",
    imageSource: require("../../../../assets/saints/saint-paul.png"),
    imageAlt: "A devotional image for the Ascension.",
    scriptureReference: "Acts 1:9",
    scriptureText: "And when he had said these things, while they looked on, he was raised up.",
  },
  {
    id: "descent-of-the-holy-spirit",
    title: "The Descent of the Holy Spirit",
    imageSource: require("../../../../assets/saints/saint-peter.png"),
    imageAlt: "A devotional image for the Descent of the Holy Spirit.",
    scriptureReference: "Acts 2:4",
    scriptureText: "And they were all filled with the Holy Ghost.",
  },
  {
    id: "assumption",
    title: "The Assumption",
    imageSource: require("../../../../assets/saints/our-lady-queen-of-heaven.png"),
    imageAlt: "A devotional image of Mary for the Assumption.",
    scriptureReference: "Revelation 12:1",
    scriptureText: "A great sign appeared in heaven: a woman clothed with the sun.",
  },
  {
    id: "coronation-of-mary",
    title: "The Coronation of Mary",
    imageSource: require("../../../../assets/saints/blessed-virgin-mary.png"),
    imageAlt: "A devotional image of Mary for her Coronation.",
    scriptureReference: "Revelation 12:1",
    scriptureText: "Upon her head a crown of twelve stars.",
  },
]);

const luminousMysteries = createMysteries("Luminous Mysteries", [
  {
    id: "baptism-in-the-jordan",
    title: "The Baptism in the Jordan",
    imageSource: require("../../../../assets/saints/saint-john-the-evangelist.png"),
    imageAlt: "A devotional image for the Baptism in the Jordan.",
    scriptureReference: "Matthew 3:16",
    scriptureText: "And Jesus being baptized, forthwith came out of the water.",
  },
  {
    id: "wedding-at-cana",
    title: "The Wedding at Cana",
    imageSource: require("../../../../assets/saints/saint-joseph.png"),
    imageAlt: "A devotional image for the Wedding at Cana.",
    scriptureReference: "John 2:5",
    scriptureText: "Whatsoever he shall say to you, do ye.",
  },
  {
    id: "proclamation-of-the-kingdom",
    title: "The Proclamation of the Kingdom",
    imageSource: require("../../../../assets/virtues/bible.png"),
    imageAlt: "A Bible representing the Proclamation of the Kingdom.",
    scriptureReference: "Mark 1:15",
    scriptureText: "The kingdom of God is at hand: repent, and believe the gospel.",
  },
  {
    id: "transfiguration",
    title: "The Transfiguration",
    imageSource: require("../../../../assets/saints/saint-francis-of-assisi.png"),
    imageAlt: "A devotional image for the Transfiguration.",
    scriptureReference: "Matthew 17:2",
    scriptureText: "And he was transfigured before them.",
  },
  {
    id: "institution-of-the-eucharist",
    title: "The Institution of the Eucharist",
    imageSource: require("../../../../assets/backgrounds/cathedralDesktop.png"),
    imageAlt: "A sacred church interior for the Institution of the Eucharist.",
    scriptureReference: "Luke 22:19",
    scriptureText: "This is my body, which is given for you. Do this for a commemoration of me.",
  },
]);

export const rosaryMysterySets: RosaryMysterySet[] = [
  {
    type: "joyful",
    title: "Joyful Mysteries",
    subtitle: joyfulMysteries[0].title,
    imageSource: require("../../../../assets/saints/blessed-virgin-mary.png"),
    imageAlt: "A Marian devotional image for the Joyful Mysteries.",
    mysteries: joyfulMysteries,
  },
  {
    type: "sorrowful",
    title: "Sorrowful Mysteries",
    subtitle: sorrowfulMysteries[0].title,
    imageSource: require("../../../../assets/saints/saint-padre-pio.png"),
    imageAlt: "A devotional image for the Sorrowful Mysteries.",
    mysteries: sorrowfulMysteries,
  },
  {
    type: "glorious",
    title: "Glorious Mysteries",
    subtitle: gloriousMysteries[0].title,
    imageSource: require("../../../../assets/saints/saint-michael-the-archangel.png"),
    imageAlt: "A devotional image for the Glorious Mysteries.",
    mysteries: gloriousMysteries,
  },
  {
    type: "luminous",
    title: "Luminous Mysteries",
    subtitle: luminousMysteries[0].title,
    imageSource: require("../../../../assets/saints/saint-john-the-evangelist.png"),
    imageAlt: "A devotional image for the Luminous Mysteries.",
    mysteries: luminousMysteries,
  },
];

export const rosaryMysteries = joyfulMysteries;

export function getRosaryMysterySet(type: RosaryMysteryType) {
  return rosaryMysterySets.find((set) => set.type === type) ?? rosaryMysterySets[0];
}

export function getRosaryMysteries(type: RosaryMysteryType) {
  return getRosaryMysterySet(type).mysteries;
}
