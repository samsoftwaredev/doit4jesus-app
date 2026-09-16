import { i18n, type SupportedLanguage } from "@/localization";

import type { ArmorItem } from "./armorOfGod.types";

/** Builds the bundled Armor of God content in the requested app language. */
export function getArmorItems(language: SupportedLanguage): readonly ArmorItem[] {
  const t = i18n.getFixedT(language);

  return [
    {
      challenge: t("armor.items.helmet.challenge"),
      description: t("armor.items.helmet.description"),
      icon: "diving-helmet",
      id: "helmet",
      name: t("armor.items.helmet.name"),
      order: 1,
      scriptureReference: t("armor.items.helmet.reference"),
      shortName: t("armor.items.helmet.shortName"),
      status: "equipped",
      xpReward: 25,
    },
    {
      challenge: t("armor.items.breastplate.challenge"),
      description: t("armor.items.breastplate.description"),
      icon: "tshirt-crew",
      id: "breastplate",
      name: t("armor.items.breastplate.name"),
      order: 2,
      scriptureReference: t("armor.items.breastplate.reference"),
      shortName: t("armor.items.breastplate.shortName"),
      status: "equipped",
      xpReward: 25,
    },
    {
      challenge: t("armor.items.belt.challenge"),
      description: t("armor.items.belt.description"),
      icon: "seatbelt",
      id: "belt",
      name: t("armor.items.belt.name"),
      order: 3,
      scriptureReference: t("armor.items.belt.reference"),
      shortName: t("armor.items.belt.shortName"),
      status: "available",
      xpReward: 20,
    },
    {
      challenge: t("armor.items.shield.challenge"),
      description: t("armor.items.shield.description"),
      icon: "shield-cross",
      id: "shield",
      name: t("armor.items.shield.name"),
      order: 4,
      scriptureReference: t("armor.items.shield.reference"),
      shortName: t("armor.items.shield.shortName"),
      status: "equipped",
      xpReward: 30,
    },
    {
      challenge: t("armor.items.sword.challenge"),
      description: t("armor.items.sword.description"),
      icon: "sword-cross",
      id: "sword",
      name: t("armor.items.sword.name"),
      order: 5,
      scriptureReference: t("armor.items.sword.reference"),
      shortName: t("armor.items.sword.shortName"),
      status: "completed",
      xpReward: 35,
    },
    {
      challenge: t("armor.items.boots.challenge"),
      description: t("armor.items.boots.description"),
      icon: "shoe-formal",
      id: "boots",
      name: t("armor.items.boots.name"),
      order: 6,
      scriptureReference: t("armor.items.boots.reference"),
      shortName: t("armor.items.boots.shortName"),
      status: "locked",
      xpReward: 20,
    },
  ];
}

export const armorItems: readonly ArmorItem[] = getArmorItems("en");
