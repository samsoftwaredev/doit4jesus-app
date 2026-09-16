import type { ImageSourcePropType } from "react-native";

import type { SupportedLanguage } from "@/localization";

export type SaintAvatar = {
  id: string;
  image: ImageSourcePropType;
  name: string;
};

export const saintAvatars: readonly SaintAvatar[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    name: "St. Ignatius of Loyola",
    image: require("../../assets/saints/saint-ignatius-of-loyola.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000002",
    name: "St. Joseph",
    image: require("../../assets/saints/saint-joseph.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000004",
    name: "St. Thérèse of Lisieux",
    image: require("../../assets/saints/saint-therese-of-lisieux.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000005",
    name: "St. Benedict of Nursia",
    image: require("../../assets/saints/saint-benedict-of-nursia.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000006",
    name: "St. Francis of Assisi",
    image: require("../../assets/saints/saint-francis-of-assisi.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000007",
    name: "St. Joan of Arc",
    image: require("../../assets/saints/saint-joan-of-arc.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000008",
    name: "St. Peter",
    image: require("../../assets/saints/saint-peter.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000010",
    name: "St. Lawrence",
    image: require("../../assets/saints/saint-lawrence.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000012",
    name: "Blessed Virgin Mary",
    image: require("../../assets/saints/blessed-virgin-mary.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000013",
    name: "Our Lady, Queen of Heaven",
    image: require("../../assets/saints/our-lady-queen-of-heaven.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000014",
    name: "St. Anthony of Padua",
    image: require("../../assets/saints/saint-anthony-of-padua.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000015",
    name: "St. Augustine of Hippo",
    image: require("../../assets/saints/saint-augustine-of-hippo.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000016",
    name: "St. Catherine of Siena",
    image: require("../../assets/saints/saint-catherine-of-siena.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000017",
    name: "St. Cecilia",
    image: require("../../assets/saints/saint-cecilia.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000018",
    name: "St. Dominic",
    image: require("../../assets/saints/saint-dominic.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000019",
    name: "St. Dymphna",
    image: require("../../assets/saints/saint-dymphna.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000020",
    name: "St. Francis Xavier",
    image: require("../../assets/saints/saint-francis-xavier.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000021",
    name: "St. John Paul II",
    image: require("../../assets/saints/saint-john-paul-ii.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000022",
    name: "St. John the Evangelist",
    image: require("../../assets/saints/saint-john-the-evangelist.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000023",
    name: "St. Juan Diego",
    image: require("../../assets/saints/saint-juan-diego.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000024",
    name: "St. Maximilian Kolbe",
    image: require("../../assets/saints/saint-maximilian-kolbe.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000025",
    name: "St. Michael the Archangel",
    image: require("../../assets/saints/saint-michael-the-archangel.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000026",
    name: "St. Monica",
    image: require("../../assets/saints/saint-monica.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000027",
    name: "St. Nicholas",
    image: require("../../assets/saints/saint-nicholas.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000028",
    name: "St. Padre Pio",
    image: require("../../assets/saints/saint-padre-pio.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000029",
    name: "St. Patrick",
    image: require("../../assets/saints/saint-patrick.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000030",
    name: "St. Paul",
    image: require("../../assets/saints/saint-paul.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000031",
    name: "St. Sebastian",
    image: require("../../assets/saints/saint-sebastian.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000032",
    name: "St. Teresa of Ávila",
    image: require("../../assets/saints/saint-teresa-of-avila.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000033",
    name: "St. Teresa of Calcutta",
    image: require("../../assets/saints/saint-teresa-of-calcutta.png"),
  },
  {
    id: "a1000000-0000-4000-8000-000000000034",
    name: "St. Thomas Aquinas",
    image: require("../../assets/saints/saint-thomas-aquinas.png"),
  },
] as const;

const spanishSaintNames: Readonly<Record<string, string>> = {
  "a1000000-0000-4000-8000-000000000001": "San Ignacio de Loyola",
  "a1000000-0000-4000-8000-000000000002": "San José",
  "a1000000-0000-4000-8000-000000000004": "Santa Teresa de Lisieux",
  "a1000000-0000-4000-8000-000000000005": "San Benito de Nursia",
  "a1000000-0000-4000-8000-000000000006": "San Francisco de Asís",
  "a1000000-0000-4000-8000-000000000007": "Santa Juana de Arco",
  "a1000000-0000-4000-8000-000000000008": "San Pedro",
  "a1000000-0000-4000-8000-000000000010": "San Lorenzo",
  "a1000000-0000-4000-8000-000000000012": "Santísima Virgen María",
  "a1000000-0000-4000-8000-000000000013": "Nuestra Señora, Reina del Cielo",
  "a1000000-0000-4000-8000-000000000014": "San Antonio de Padua",
  "a1000000-0000-4000-8000-000000000015": "San Agustín de Hipona",
  "a1000000-0000-4000-8000-000000000016": "Santa Catalina de Siena",
  "a1000000-0000-4000-8000-000000000017": "Santa Cecilia",
  "a1000000-0000-4000-8000-000000000018": "Santo Domingo",
  "a1000000-0000-4000-8000-000000000019": "Santa Dimpna",
  "a1000000-0000-4000-8000-000000000020": "San Francisco Javier",
  "a1000000-0000-4000-8000-000000000021": "San Juan Pablo II",
  "a1000000-0000-4000-8000-000000000022": "San Juan Evangelista",
  "a1000000-0000-4000-8000-000000000023": "San Juan Diego",
  "a1000000-0000-4000-8000-000000000024": "San Maximiliano Kolbe",
  "a1000000-0000-4000-8000-000000000025": "San Miguel Arcángel",
  "a1000000-0000-4000-8000-000000000026": "Santa Mónica",
  "a1000000-0000-4000-8000-000000000027": "San Nicolás",
  "a1000000-0000-4000-8000-000000000028": "San Pío de Pietrelcina",
  "a1000000-0000-4000-8000-000000000029": "San Patricio",
  "a1000000-0000-4000-8000-000000000030": "San Pablo",
  "a1000000-0000-4000-8000-000000000031": "San Sebastián",
  "a1000000-0000-4000-8000-000000000032": "Santa Teresa de Ávila",
  "a1000000-0000-4000-8000-000000000033": "Santa Teresa de Calcuta",
  "a1000000-0000-4000-8000-000000000034": "Santo Tomás de Aquino",
};

/** Returns the bundled saint name in the selected app language. */
export function getSaintDisplayName(saint: SaintAvatar, language: SupportedLanguage): string {
  return language === "es" ? (spanishSaintNames[saint.id] ?? saint.name) : saint.name;
}

export function findSaintAvatar(id: string | null | undefined): SaintAvatar | undefined {
  return saintAvatars.find((saint) => saint.id === id);
}
