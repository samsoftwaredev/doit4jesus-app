const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { describe, expect, it } = require("@jest/globals");

const APP_NAME = "DoItForJesus";
const WEB_BACKGROUND = "#071A26";

describe("Expo web application configuration", () => {
  it("configures the standalone web experience without changing its export mode or favicon", () => {
    const { expo } = JSON.parse(readFileSync(resolve("app.json"), "utf8"));

    expect(expo.name).toBe(APP_NAME);
    expect(expo.web).toEqual(
      expect.objectContaining({
        backgroundColor: WEB_BACKGROUND,
        barStyle: "black-translucent",
        display: "standalone",
        favicon: "./assets/images/favicon.png",
        name: APP_NAME,
        output: "static",
        shortName: APP_NAME,
        splash: {
          backgroundColor: WEB_BACKGROUND,
          image: "./assets/images/splash.png",
          resizeMode: "contain",
        },
        themeColor: WEB_BACKGROUND,
      }),
    );
  });

  it("publishes a matching installable web manifest that reuses the generated favicon", () => {
    const manifest = JSON.parse(readFileSync(resolve("public/manifest.json"), "utf8"));

    expect(manifest).toEqual(
      expect.objectContaining({
        background_color: WEB_BACKGROUND,
        display: "standalone",
        name: APP_NAME,
        orientation: "portrait",
        scope: "/",
        short_name: APP_NAME,
        start_url: "/",
        theme_color: WEB_BACKGROUND,
      }),
    );
    expect(manifest.icons).toContainEqual({
      sizes: "16x16 32x32 48x48",
      src: "/favicon.ico",
      type: "image/x-icon",
    });
  });

  it("adds Safari metadata and a navy document background without touching native status-bar code", () => {
    const rootHtml = readFileSync(resolve("src/app/+html.tsx"), "utf8");

    expect(rootHtml).toContain('<link href="/manifest.json" rel="manifest" />');
    expect(rootHtml).toContain('<meta content="#071A26" name="theme-color" />');
    expect(rootHtml).toContain('<meta content="dark" name="color-scheme" />');
    expect(rootHtml).toContain('<meta content="yes" name="apple-mobile-web-app-capable" />');
    expect(rootHtml).toContain('<meta content="black-translucent" name="apple-mobile-web-app-status-bar-style" />');
    expect(rootHtml).toContain('<meta content="DoItForJesus" name="apple-mobile-web-app-title" />');
    expect(rootHtml).toContain("viewport-fit=cover");
    expect(rootHtml).toContain("html, body, #root");
    expect(rootHtml).toContain("background-color: #071A26");
    expect(rootHtml).toContain("color-scheme: dark");
    expect(rootHtml).toContain("env(safe-area-inset-top, 0px)");
    expect(rootHtml).toContain("env(safe-area-inset-bottom, 0px)");
  });
});
