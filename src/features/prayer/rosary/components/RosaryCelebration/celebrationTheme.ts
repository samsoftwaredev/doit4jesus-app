/** Fixed palette shared by the on-screen celebration and the generated share image so they match exactly. */
export const CELEBRATION_COLORS = {
  background: ["#040A1C", "#0E2147", "#2A1A52"] as const,
  gold: "#E6BA64",
  goldBright: "#FFE09A",
  goldDeep: "#8A6425",
  text: "#FFFFFF",
  textSoft: "rgba(255, 255, 255, 0.72)",
};

/** Deterministic pseudo-random sequence so star layouts are stable between renders and in the shared image. */
export function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}
