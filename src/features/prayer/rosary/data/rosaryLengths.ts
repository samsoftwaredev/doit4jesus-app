import type { RosaryLength } from "@/features/prayer/rosary/types";

export const DEFAULT_ROSARY_LENGTH: RosaryLength = "medium";

export interface RosaryLengthOption {
  id: RosaryLength;
  label: string;
  introduction: string;
  prayers: readonly string[];
}

export const ROSARY_LENGTH_OPTIONS: readonly RosaryLengthOption[] = [
  {
    id: "short",
    introduction: "The standard five-decade Rosary:",
    label: "Short (15 min)",
    prayers: [
      "Sign of the Cross and Apostles’ Creed",
      "Our Father, Hail Mary, and Glory Be",
      "Five mysteries with Fatima Prayers",
      "Hail, Holy Queen",
    ],
  },
  {
    id: "medium",
    introduction: "Everything in Short, plus:",
    label: "Classic (20 min)",
    prayers: ["Our Father, Hail Mary, and Glory Be for the Pope’s intentions", "St. Michael Prayer"],
  },
  {
    id: "long",
    introduction: "Everything in Classic, plus:",
    label: "Long (30 min)",
    prayers: ["Litany of Loreto"],
  },
] as const;

/** Returns whether persisted content names one of the supported Rosary lengths. */
export function isRosaryLength(value: unknown): value is RosaryLength {
  return value === "short" || value === "medium" || value === "long";
}

/** Returns the user-facing label for a supported Rosary length. */
export function rosaryLengthLabel(length: RosaryLength) {
  return ROSARY_LENGTH_OPTIONS.find((option) => option.id === length)?.label ?? "Classic";
}
