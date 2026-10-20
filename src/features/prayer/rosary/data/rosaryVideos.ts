import type { SupportedLanguage } from "@/localization";

import type { RosaryMysteryType } from "../types";

const rosaryVideoIds = {
  en: {
    glorious: "RQ8S109cVys",
    joyful: "Yxl_DsofPTk",
    luminous: "E-cXdxUjsCM",
    sorrowful: "EBQPDYRkGOw",
  },
  es: {
    glorious: "ZhG64Pxomuw",
    joyful: "if85VqzxHYg",
    luminous: "z0gJ_J4BKeo",
    sorrowful: "ZVxA-2qfykQ",
  },
} as const satisfies Record<SupportedLanguage, Record<RosaryMysteryType, string>>;

/** Returns the approved YouTube video identifier for one localized mystery set. */
export function getRosaryVideoId(language: SupportedLanguage, mysteryType: RosaryMysteryType): string {
  return rosaryVideoIds[language][mysteryType];
}
