import { getRosaryVideoPlayerVars, resolveRosaryVideoPlayerOrigin } from "../../data/rosaryVideoPlayer";

describe("RosaryVideoPlayer", () => {
  it("keeps YouTube controls, inline playback, captions, and client identification enabled", () => {
    expect(getRosaryVideoPlayerVars("es", "https://app.doitforjesus.com")).toEqual(
      expect.objectContaining({
        cc_lang_pref: "es",
        controls: 1,
        enablejsapi: 1,
        hl: "es",
        origin: "https://app.doitforjesus.com",
        playsinline: 1,
        widget_referrer: "https://app.doitforjesus.com",
      }),
    );
  });

  it("uses the browser origin on web and the canonical app origin for native DOM webviews", () => {
    expect(resolveRosaryVideoPlayerOrigin("https://localhost:8081", "https://app.doitforjesus.com")).toBe(
      "https://localhost:8081",
    );
    expect(resolveRosaryVideoPlayerOrigin("null", "https://app.doitforjesus.com")).toBe("https://app.doitforjesus.com");
  });
});
