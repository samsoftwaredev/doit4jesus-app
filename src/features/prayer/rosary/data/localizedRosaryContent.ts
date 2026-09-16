import type { SupportedLanguage } from "@/localization";

import { englishRosaryContent, type RosaryContent } from "./rosaryContent";
import { spanishRosaryContent } from "./esRosaryContent";

/** Returns the bundled Rosary content for the resolved application language. */
export function getRosaryContent(language: SupportedLanguage): RosaryContent {
  return language === "es" ? spanishRosaryContent : englishRosaryContent;
}
