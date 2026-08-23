import type { RosaryMystery } from "@/types/rosary";

import { rosaryPrayers } from "./rosaryPrayers";

/**
 * Replace these local placeholders with licensed devotional artwork in
 * src/assets/rosary/ when the final art direction is available.
 */
export const rosaryMysteries: RosaryMystery[] = [
  {
    id: "annunciation",
    title: "The Annunciation",
    category: "Joyful Mystery",
    imageSource: require("../assets/saints/blessed-virgin-mary.png"),
    imageAlt: "A devotional image of Mary for the mystery of the Annunciation.",
    scriptureReference: "Luke 1:38",
    scriptureText:
      "Behold the handmaid of the Lord; be it done unto me according to thy word.",
    prayers: rosaryPrayers,
  },
  {
    id: "visitation",
    title: "The Visitation",
    category: "Joyful Mystery",
    imageSource: require("../assets/backgrounds/cathedralTablet.png"),
    imageAlt: "A quiet sacred space for the mystery of the Visitation.",
    scriptureReference: "Luke 1:42",
    scriptureText:
      "Blessed art thou among women, and blessed is the fruit of thy womb.",
    prayers: rosaryPrayers,
  },
  {
    id: "nativity",
    title: "The Nativity",
    category: "Joyful Mystery",
    imageSource: require("../assets/backgrounds/cathedralDesktop.png"),
    imageAlt: "A reverent church interior for the mystery of the Nativity.",
    scriptureReference: "Luke 2:7",
    scriptureText:
      "And she brought forth her firstborn son, and wrapped him in swaddling clothes.",
    prayers: rosaryPrayers,
  },
  {
    id: "presentation",
    title: "The Presentation",
    category: "Joyful Mystery",
    imageSource: require("../assets/flowers/whiteLily.png"),
    imageAlt: "White lilies representing the purity of the Presentation.",
    scriptureReference: "Luke 2:22",
    scriptureText:
      "They brought him to Jerusalem, to present him to the Lord.",
    prayers: rosaryPrayers,
  },
  {
    id: "finding-in-the-temple",
    title: "The Finding in the Temple",
    category: "Joyful Mystery",
    imageSource: require("../assets/virtues/bible.png"),
    imageAlt: "A Bible representing the mystery of Finding Jesus in the Temple.",
    scriptureReference: "Luke 2:46",
    scriptureText:
      "After three days they found him in the temple, sitting in the midst of the doctors.",
    prayers: rosaryPrayers,
  },
];
