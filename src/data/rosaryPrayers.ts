import type { RosaryPrayer } from "@/types/rosary";

export const rosaryPrayers: RosaryPrayer[] = [
  {
    id: "our-father",
    name: "Our Father",
    beadType: "ourFather",
    text: "Our Father, who art in heaven, hallowed be thy name.\n\nThy kingdom come, thy will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us.\n\nAnd lead us not into temptation, but deliver us from evil. Amen.",
  },
  {
    id: "hail-mary",
    name: "Hail Mary",
    beadType: "hailMary",
    text: "Hail Mary, full of grace,\nthe Lord is with thee.\nBlessed art thou among women,\nand blessed is the fruit of\nthy womb, Jesus.\n\nHoly Mary, Mother of God,\npray for us sinners, now and\nat the hour of our death.\nAmen.",
  },
  {
    id: "glory-be",
    name: "Glory Be",
    beadType: "gloryBe",
    text: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
  },
  {
    id: "fatima-prayer",
    name: "Fatima Prayer",
    beadType: "fatimaPrayer",
    text: "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those in most need of thy mercy. Amen.",
  },
  {
    id: "apostles-creed",
    name: "Apostles' Creed",
    beadType: "creed",
    text: "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord. Amen.",
  },
];

export const prayerById = Object.fromEntries(rosaryPrayers.map((prayer) => [prayer.id, prayer])) as Record<
  string,
  RosaryPrayer
>;
