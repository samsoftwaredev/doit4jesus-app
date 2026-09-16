import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { resources } from "./resources";

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  lng: "en",
  load: "languageOnly",
  react: { useSuspense: false },
  resources,
  supportedLngs: ["en", "es"],
});

export { i18n };
