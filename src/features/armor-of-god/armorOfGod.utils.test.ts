import { getArmorActionLabel, getArmorStatusLabel, isArmorEquipped } from "./armorOfGod.utils";

describe("Armor of God status utilities", () => {
  it.each([
    ["available", "Helmet", "EQUIP HELMET", "Available", false],
    ["completed", "Sword", "VIEW CHALLENGE", "Completed", true],
    ["equipped", "Shield", "EQUIPPED", "Equipped", true],
    ["locked", "Boots", "LOCKED", "Locked", false],
  ] as const)("maps %s armor status", (status, shortName, actionLabel, statusLabel, equipped) => {
    expect(getArmorActionLabel(status, shortName)).toBe(actionLabel);
    expect(getArmorStatusLabel(status)).toBe(statusLabel);
    expect(isArmorEquipped(status)).toBe(equipped);
  });
});
