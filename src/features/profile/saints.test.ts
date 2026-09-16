import { getSaintDisplayName, saintAvatars } from "./saints";

describe("saint names", () => {
  it("localizes bundled saint names while preserving English as the default catalog copy", () => {
    const saintJoseph = saintAvatars.find((saint) => saint.name === "St. Joseph");

    expect(saintJoseph).toBeDefined();
    expect(getSaintDisplayName(saintJoseph!, "en")).toBe("St. Joseph");
    expect(getSaintDisplayName(saintJoseph!, "es")).toBe("San José");
  });
});
