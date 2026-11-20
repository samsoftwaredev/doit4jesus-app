import { fireEvent, render, screen } from "@testing-library/react-native";
import { Share } from "react-native";
import { captureRef } from "react-native-view-shot";

import { RosaryCelebrationView } from "./RosaryCelebrationView";
import type { RosaryCelebrationStats } from "./types";

jest.mock("react-native-view-shot", () => ({ captureRef: jest.fn() }));
jest.mock("expo-sharing", () => ({ isAvailableAsync: jest.fn(async () => true), shareAsync: jest.fn() }));

const stats: RosaryCelebrationStats = {
  currentStreak: 5,
  isNewRecord: false,
  levelName: "Faithful Pilgrim",
  levelNumber: 4,
  longestStreak: 9,
  rosariesPrayed: 42,
};

function renderView(override: Partial<RosaryCelebrationStats> | null = {}, handlers = {}) {
  return render(
    <RosaryCelebrationView
      dateLabel="Today"
      isLoadingStats={false}
      onNext={jest.fn()}
      onPrayAgain={jest.fn()}
      stats={override === null ? null : { ...stats, ...override }}
      {...handlers}
    />,
  );
}

describe("RosaryCelebrationView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (captureRef as jest.Mock).mockResolvedValue("file:///tmp/rosary.png");
    jest.spyOn(Share, "share").mockResolvedValue({ action: "sharedAction" });
  });

  it("emphasizes the streak and shows compact stats", async () => {
    await renderView();

    expect(screen.getByLabelText("Current streak: 5 days")).toBeTruthy();
    expect(screen.getByLabelText("Rosaries: 42")).toBeTruthy();
    expect(screen.getByLabelText("Level: 4")).toBeTruthy();
    expect(screen.getByLabelText("Best streak: 9")).toBeTruthy();
    expect(screen.queryByTestId("rosary-celebration-fireworks", { includeHiddenElements: true })).toBeNull();
  });

  it("adds fireworks and a record badge on a new personal best", async () => {
    await renderView({ currentStreak: 10, isNewRecord: true, longestStreak: 10 });

    expect(screen.getByTestId("rosary-celebration-fireworks", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByTestId("rosary-celebration-record")).toBeTruthy();
  });

  it("offers Next at the top instead of an exit button", async () => {
    const onNext = jest.fn();
    await renderView({}, { onNext });

    expect(screen.queryByLabelText("Exit & View Garden")).toBeNull();
    await fireEvent.press(screen.getByTestId("rosary-celebration-next"));
    expect(onNext).toHaveBeenCalled();
  });

  it("captures the poster image and shares it with a caption", async () => {
    await renderView();

    await fireEvent.press(screen.getByTestId("rosary-celebration-share"));

    expect(captureRef).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ format: "png", result: "tmpfile" }),
    );
    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("5-day prayer streak"),
        url: "file:///tmp/rosary.png",
      }),
    );
  });

  it("falls back to sharing text when the image cannot be captured", async () => {
    (captureRef as jest.Mock).mockRejectedValue(new Error("no capture"));
    await renderView();

    await fireEvent.press(screen.getByTestId("rosary-celebration-share"));

    expect(Share.share).toHaveBeenCalledWith({ message: expect.stringContaining("DoIt4Jesus") });
  });

  it("still renders when stats are unavailable", async () => {
    await renderView(null);

    expect(screen.getByLabelText("Rosaries: —")).toBeTruthy();
  });
});
