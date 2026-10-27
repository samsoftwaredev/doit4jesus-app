const { readFileSync, readdirSync } = require("node:fs");
const { resolve } = require("node:path");
const { describe, expect, it } = require("@jest/globals");

describe("background music delivery configuration", () => {
  it("ships only the four stream-optimized MP4 music assets", () => {
    expect(readdirSync(resolve("assets/audios/music")).sort()).toEqual([
      "angusDeiPolyphony.mp4",
      "diesIrae.mp4",
      "kyrieChant.mp4",
      "sanctusPolyphony.mp4",
    ]);
  });

  it("embeds the complete music directory in native builds", () => {
    const { expo } = JSON.parse(readFileSync(resolve("app.json"), "utf8"));

    expect(expo.plugins).toContainEqual([
      "expo-asset",
      {
        assets: ["./assets/audios/music"],
      },
    ]);
  });

  it("caches content-hashed web assets immutably", () => {
    const config = JSON.parse(readFileSync(resolve("vercel.json"), "utf8"));

    expect(config.headers).toContainEqual({
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      source: "/assets/:path*",
    });
  });
});
