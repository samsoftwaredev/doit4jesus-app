import type { ArmorStatus } from "./armorOfGod.types";

export function getArmorActionLabel(status: ArmorStatus, shortName: string): string {
  switch (status) {
    case "available":
      return `EQUIP ${shortName.toUpperCase()}`;
    case "completed":
      return "VIEW CHALLENGE";
    case "equipped":
      return "EQUIPPED";
    case "locked":
      return "LOCKED";
  }
}

export function getArmorStatusLabel(status: ArmorStatus): string {
  switch (status) {
    case "available":
      return "Available";
    case "completed":
      return "Completed";
    case "equipped":
      return "Equipped";
    case "locked":
      return "Locked";
  }
}

export function isArmorEquipped(status: ArmorStatus): boolean {
  return status === "equipped" || status === "completed";
}
