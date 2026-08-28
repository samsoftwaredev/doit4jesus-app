import { fireEvent, render, screen } from "@testing-library/react-native";

import { rosaryMysteries } from "@/features/prayer/rosary/data/rosaryMysteries";
import { rosarySequence } from "@/features/prayer/rosary/data/rosarySequence";
import { RosaryPrayerScreen } from "@/features/prayer/rosary/screens/RosaryPrayerScreen";

const goToNextBead = jest.fn();
const goToPreviousBead = jest.fn();
const restartMystery = jest.fn();
const selectBead = jest.fn();
const mockBack = jest.fn();
const mockRecordRosaryActivity = jest.fn();
const mockRecordPrayerForIntention = jest.fn();

jest.mock("expo-router", () => ({ useRouter: () => ({ back: mockBack, replace: jest.fn() }) }));
jest.mock("@/features/prayer/rosary/hooks/useRosarySession", () => ({
  useRosarySession: jest.fn(),
}));
jest.mock("@/features/prayer/rosary/api/activities.api", () => ({
  recordRosaryActivity: (...args: unknown[]) => mockRecordRosaryActivity(...args),
}));
jest.mock("@/features/prayer/intentions", () => ({
  recordPrayerForIntention: (...args: unknown[]) => mockRecordPrayerForIntention(...args),
}));

const { useRosarySession } = jest.requireMock("@/features/prayer/rosary/hooks/useRosarySession") as {
  useRosarySession: jest.Mock;
};
const { useReducedMotion } = jest.requireMock("react-native-reanimated") as {
  useReducedMotion: jest.Mock;
};

function mockSession(overrides = {}) {
  useRosarySession.mockReturnValue({
    completedBeadIds: [],
    currentBead: rosarySequence[0],
    currentBeadIndex: 0,
    currentMystery: rosaryMysteries[0],
    currentPrayer: rosaryMysteries[0].prayers[1],
    currentPrayerIndex: 1,
    goToNextBead,
    goToPreviousBead,
    goToMystery: jest.fn(),
    isHydrated: true,
    isRosaryCompleted: false,
    isTransitioning: false,
    lastPrayedOn: null,
    nextMystery: jest.fn(),
    previousMystery: jest.fn(),
    restartMystery,
    selectBead,
    storageError: false,
    ...overrides,
  });
}

describe("RosaryPrayerScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useReducedMotion.mockReturnValue(true);
    mockRecordRosaryActivity.mockResolvedValue({ points: 25 });
    mockRecordPrayerForIntention.mockResolvedValue({ prayerCount: 4 });
    mockSession();
  });

  it("should render the current mystery content by default", async () => {
    await render(<RosaryPrayerScreen />);

    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();
    expect(screen.getByText("The Annunciation")).toBeTruthy();
    expect(screen.getByText("Luke 1:38")).toBeTruthy();
    expect(screen.getByText("HAIL MARY")).toBeTruthy();
  });

  it("provides a chevron back action for this non-tab route", async () => {
    await render(<RosaryPrayerScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Go back" }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("should advance to the next bead when the progress button is pressed", async () => {
    await render(<RosaryPrayerScreen />);

    await fireEvent.press(screen.getByTestId("rosary-progress-button"));

    expect(goToNextBead).toHaveBeenCalledTimes(1);
  });

  it("should provide accessible previous, next, settings, and bead controls", async () => {
    await render(<RosaryPrayerScreen />);

    expect(screen.getByLabelText("Previous bead")).toBeTruthy();
    expect(screen.getByLabelText("Next bead")).toBeTruthy();
    expect(screen.getByLabelText("Open Rosary settings")).toBeTruthy();
    expect(screen.getByLabelText(/current bead 1/i)).toBeTruthy();
  });

  it("should return to the previous bead when its equivalent button is pressed", async () => {
    mockSession({ currentBeadIndex: 1, currentBead: rosarySequence[1] });
    await render(<RosaryPrayerScreen />);

    await fireEvent.press(screen.getByTestId("previous-bead-button"));

    expect(goToPreviousBead).toHaveBeenCalledTimes(1);
  });

  it("should show a respectful completion state and allow another prayer", async () => {
    mockSession({ isRosaryCompleted: true, lastPrayedOn: "2026-08-06T10:00:00.000Z" });
    await render(<RosaryPrayerScreen />);

    expect(screen.getByText("Rosary Completed")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Pray this mystery again"));

    expect(restartMystery).toHaveBeenCalledTimes(1);
  });

  it("should use a safe completion-date fallback for invalid saved dates", async () => {
    mockSession({ isRosaryCompleted: true, lastPrayedOn: "not-a-date" });
    await render(<RosaryPrayerScreen />);

    expect(screen.getByText("Today")).toBeTruthy();
  });

  it("should render storage and empty-data fallbacks without losing navigation", async () => {
    mockSession({
      currentBead: undefined,
      currentMystery: undefined,
      currentPrayer: undefined,
      storageError: true,
    });
    await render(<RosaryPrayerScreen />);

    expect(screen.getByText("No mystery available")).toBeTruthy();
    expect(screen.getByText(/progress could not be saved/i)).toBeTruthy();
    expect(screen.getByLabelText("Open Rosary settings")).toBeTruthy();
  });

  it("records a newly completed Rosary and its linked intention", async () => {
    const rendered = await render(<RosaryPrayerScreen intentionId="intention-1" />);
    mockSession({ isRosaryCompleted: true, lastPrayedOn: "2026-08-06T10:00:00.000Z" });

    await rendered.rerender(<RosaryPrayerScreen intentionId="intention-1" />);

    expect(await screen.findByText("Rosary recorded")).toBeTruthy();
    expect(screen.getByText("Prayer offered. 4 prayers have been offered for this intention.")).toBeTruthy();
    expect(mockRecordRosaryActivity).toHaveBeenCalledWith(
      expect.objectContaining({ durationSeconds: expect.any(Number), idempotencyKey: expect.any(String) }),
    );
    expect(mockRecordPrayerForIntention).toHaveBeenCalledWith("intention-1");
  });

  it("shows a retry action when completion recording fails", async () => {
    mockRecordRosaryActivity.mockRejectedValueOnce(new Error("Connection lost"));
    const rendered = await render(<RosaryPrayerScreen />);
    mockSession({ isRosaryCompleted: true });

    await rendered.rerender(<RosaryPrayerScreen />);

    expect(await screen.findByText("Connection lost")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Retry recording this completed Rosary"));
    expect(await screen.findByText("Rosary recorded")).toBeTruthy();
  });
});
