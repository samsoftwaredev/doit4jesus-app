const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { describe, expect, it } = require("@jest/globals");

describe("Vercel configuration", () => {
  it("exports the Expo web app instead of invoking Next.js", () => {
    const config = JSON.parse(readFileSync(resolve("vercel.json"), "utf8"));

    expect(config.framework).toBeNull();
    expect(config.buildCommand).toBe("expo export -p web");
    expect(config.outputDirectory).toBe("dist");
    expect(config.rewrites).toContainEqual({ source: "/:path*", destination: "/" });
  });
});
