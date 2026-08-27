import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";

export type ArmorStatus = "locked" | "available" | "equipped" | "completed";

export type ArmorIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export interface ArmorItem {
  challenge?: string;
  description: string;
  icon: ArmorIconName;
  id: string;
  name: string;
  order: number;
  scriptureReference: string;
  shortName: string;
  status: ArmorStatus;
  xpReward?: number;
}
