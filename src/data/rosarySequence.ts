import type { RosaryBead } from "@/types/rosary";

/** A decade is intentionally kept separate from mystery data so it can be reused. */
export function createRosarySequence(decades = 1): RosaryBead[] {
  const beadCount = Math.max(1, Math.floor(decades)) * 10;
  return Array.from({ length: beadCount }, (_, index) => ({
    id: `hail-mary-${index + 1}`,
    sequence: index + 1,
    prayerId: "hail-mary",
    type: "hailMary",
  }));
}

export const rosarySequence = createRosarySequence(1);
export const fullRosarySequence = createRosarySequence(5);
