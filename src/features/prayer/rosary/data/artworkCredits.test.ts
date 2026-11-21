import { artworkCredits } from "./artworkCredits";
import { artworkKeysBySource } from "./artworkRegistry";
import { getArtworkCredit } from "./getArtworkCredit";

describe("artwork credits", () => {
  it("only references artwork that is registered (and so exists in assets)", () => {
    const registered = new Set(artworkKeysBySource.values());
    for (const key of Object.keys(artworkCredits)) {
      expect(registered.has(key)).toBe(true);
    }
  });

  it("has a credit entry for every registered artwork", () => {
    for (const key of artworkKeysBySource.values()) {
      expect(artworkCredits).toHaveProperty([key]);
    }
  });

  it("credits comic illustrations to Camilo Ruiz with the mystery name", () => {
    const entry = [...artworkKeysBySource.entries()].find(
      ([, key]) => key === "mysteriesCartoon/joyful/firstJoyful.svg",
    )!;
    expect(getArtworkCredit(entry[0])).toEqual({ artist: "Camilo Ruiz", title: "The Annunciation" });
  });

  it("returns nothing for blank entries and unknown sources, and trims partial entries", () => {
    const key = "mysteriesClassicArt/general/holyTrinity01.jpg";
    const source = [...artworkKeysBySource.entries()].find(([, entryKey]) => entryKey === key)![0];
    const original = artworkCredits[key];
    try {
      artworkCredits[key] = { artist: " ", title: "" };
      expect(getArtworkCredit(source)).toBeUndefined();
      artworkCredits[key] = { artist: " Rubens ", title: "" };
      expect(getArtworkCredit(source)).toEqual({ artist: "Rubens", title: undefined });
    } finally {
      artworkCredits[key] = original;
    }
    expect(getArtworkCredit({ uri: "unknown" })).toBeUndefined();
    expect(getArtworkCredit(undefined)).toBeUndefined();
  });
});
