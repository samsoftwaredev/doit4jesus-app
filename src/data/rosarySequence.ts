import type { RosaryBead } from "@/types/rosary";

/** A decade is intentionally kept separate from mystery data so it can be reused. */
export const rosarySequence: RosaryBead[] = Array.from({ length: 10 }, (_, index) => ({
  id: `hail-mary-${index + 1}`,
  sequence: index + 1,
  prayerId: "hail-mary",
  type: "hailMary",
}));
