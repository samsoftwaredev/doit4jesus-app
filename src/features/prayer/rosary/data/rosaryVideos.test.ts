import { getRosaryVideoId } from "./rosaryVideos";

describe("Rosary video mapping", () => {
  it.each([
    ["en", "luminous", "E-cXdxUjsCM"],
    ["en", "glorious", "RQ8S109cVys"],
    ["en", "sorrowful", "EBQPDYRkGOw"],
    ["en", "joyful", "Yxl_DsofPTk"],
    ["es", "sorrowful", "ZVxA-2qfykQ"],
    ["es", "joyful", "if85VqzxHYg"],
    ["es", "luminous", "z0gJ_J4BKeo"],
    ["es", "glorious", "ZhG64Pxomuw"],
  ] as const)("resolves the %s %s video", (language, mysteryType, expectedVideoId) => {
    expect(getRosaryVideoId(language, mysteryType)).toBe(expectedVideoId);
  });
});
