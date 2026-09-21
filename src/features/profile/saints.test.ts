import { getProfileAvatarSource, getSaintDisplayName, saintAvatars } from "./saints";

describe("saint names", () => {
  it("localizes bundled saint names while preserving English as the default catalog copy", () => {
    const saintJoseph = saintAvatars.find((saint) => saint.name === "St. Joseph");

    expect(saintJoseph).toBeDefined();
    expect(getSaintDisplayName(saintJoseph!, "en")).toBe("St. Joseph");
    expect(getSaintDisplayName(saintJoseph!, "es")).toBe("San José");
  });
});

describe("profile avatar source", () => {
  const saintJoseph = saintAvatars.find((saint) => saint.name === "St. Joseph")!;
  const virginMary = saintAvatars.find((saint) => saint.name === "Blessed Virgin Mary")!;

  it("prefers the selected saint over the uploaded avatar URL", () => {
    expect(getProfileAvatarSource(saintJoseph.id, "https://example.test/avatar.png")).toBe(saintJoseph.image);
  });

  it("uses the uploaded avatar URL when no saint is selected", () => {
    expect(getProfileAvatarSource(null, "https://example.test/avatar.png")).toBe("https://example.test/avatar.png");
  });

  it("uses the Blessed Virgin Mary when neither avatar value is defined", () => {
    expect(getProfileAvatarSource(null, null)).toBe(virginMary.image);
  });
});
