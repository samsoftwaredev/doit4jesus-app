import { englishRosaryContent } from "./rosaryContent";
import { spanishRosaryContent } from "./esRosaryContent";
import { getRosarySequenceForLength } from "./rosarySequence";
import {
  formatRosaryAudioDuration,
  getRemainingRosaryAudioSeconds,
  getRosaryAudioDurationSeconds,
} from "./rosaryAudioTiming";

describe("getRemainingRosaryAudioSeconds", () => {
  const durations = {
    "/audio/current.m4a": 20,
    "/audio/next-in-prayer.m4a": 10,
    "/audio/next-bead.m4a": 30,
  };

  it("totals the unplayed current recording and every later Rosary recording", () => {
    expect(
      getRemainingRosaryAudioSeconds({
        currentTrackIndex: 0,
        currentTrackPosition: 7.4,
        durations,
        remainingAudioPaths: ["/audio/current.m4a", "/audio/next-in-prayer.m4a", "/audio/next-bead.m4a"],
      }),
    ).toBe(53);
  });

  it("omits completed tracks and safely ignores unavailable recordings", () => {
    expect(
      getRemainingRosaryAudioSeconds({
        currentTrackIndex: 1,
        currentTrackPosition: 2,
        durations,
        remainingAudioPaths: ["/audio/current.m4a", "/audio/next-in-prayer.m4a", "/audio/missing.m4a"],
      }),
    ).toBe(8);
  });

  it("falls back to the start of the queue when native playback timing is not ready", () => {
    expect(
      getRemainingRosaryAudioSeconds({
        currentTrackIndex: Number.NaN,
        currentTrackPosition: Number.NaN,
        durations,
        remainingAudioPaths: ["/audio/current.m4a"],
      }),
    ).toBe(20);
  });

  it("totals and formats the exact audio duration for each Rosary length and language", () => {
    const joyfulEnglish = (length: "short" | "medium" | "long") =>
      getRosaryAudioDurationSeconds(
        getRosarySequenceForLength(englishRosaryContent, "joyful", length).flatMap((bead) => bead.audioQueue ?? []),
      );
    const joyfulSpanish = (length: "short" | "medium" | "long") =>
      getRosaryAudioDurationSeconds(
        getRosarySequenceForLength(spanishRosaryContent, "joyful", length).flatMap((bead) => bead.audioQueue ?? []),
      );

    expect(
      [joyfulEnglish("short"), joyfulEnglish("medium"), joyfulEnglish("long")].map(formatRosaryAudioDuration),
    ).toEqual(["21:09", "23:37", "27:14"]);
    expect(
      [joyfulSpanish("short"), joyfulSpanish("medium"), joyfulSpanish("long")].map(formatRosaryAudioDuration),
    ).toEqual(["24:58", "27:43", "31:51"]);
  });
});
