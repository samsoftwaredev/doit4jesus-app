import { fireEvent, render, screen, waitFor, within } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { rosaryMysteries } from "@/features/prayer/rosary/data/rosaryMysteries";
import { prayerById } from "@/features/prayer/rosary/data/rosaryPrayers";
import { fullRosarySequence, rosarySequence } from "@/features/prayer/rosary/data/rosarySequence";
import { RosaryPrayerScreen } from "@/features/prayer/rosary/screens/RosaryPrayerScreen";

const goToNextBead = jest.fn();
const goToPreviousBead = jest.fn();
const restartMystery = jest.fn();
const selectBead = jest.fn();
const mockBack = jest.fn();
const mockRecordRosaryActivity = jest.fn();
const mockRecordPrayerForIntention = jest.fn();
const mockUseRosaryPresence = jest.fn();
const mockToggleAudioPlayback = jest.fn();
const mockSetAudioMuted = jest.fn();
const mockUseRosaryAudioPlayback = jest.fn();

jest.mock("expo-router", () => ({ useRouter: () => ({ back: mockBack, replace: jest.fn() }) }));
jest.mock("@/features/prayer/rosary/hooks/useRosarySession", () => ({
  useRosarySession: jest.fn(),
}));
jest.mock("@/features/prayer/rosary/hooks/useRosaryPresence", () => ({
  useRosaryPresence: () => mockUseRosaryPresence(),
}));
jest.mock("@/features/prayer/rosary/hooks/useRosaryAudioPlayback", () => ({
  useRosaryAudioPlayback: (options: unknown) => mockUseRosaryAudioPlayback(options),
}));
jest.mock("@/features/prayer/rosary/hooks/useRosaryAudioPreference", () => ({
  useRosaryAudioPreference: () => ({
    isHydrated: true,
    isMuted: false,
    setIsMuted: mockSetAudioMuted,
    storageError: false,
  }),
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
    mockUseRosaryPresence.mockReturnValue({ connectionState: "idle", currentUserId: "user-me", users: [] });
    mockUseRosaryAudioPlayback.mockReturnValue({
      isAvailable: true,
      isLoading: false,
      isPlaying: false,
      playbackError: null,
      togglePlayback: mockToggleAudioPlayback,
    });
    mockSession();
  });

  it("should render the current mystery content by default", async () => {
    await render(<RosaryPrayerScreen />);

    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();
    expect(screen.getByText("The Annunciation")).toBeTruthy();
    expect(screen.getByText("Luke 1:26-38")).toBeTruthy();
    expect(screen.getByText("FRUIT OF THE MYSTERY")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Humility" })).toBeTruthy();
    expect(
      screen.getByText(
        "Mary receives God's message with trust and calls herself his servant. Ask for grace to surrender pride and welcome God's will with a humble heart.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("HAIL MARY")).toBeTruthy();
  }, 10000);

  it("renders every physical bead without rendering non-bead prayer markers", async () => {
    const scriptureStepIndex = fullRosarySequence.findIndex((bead) => bead.scriptureReference === "Luke 1:28");
    mockSession({
      currentBead: fullRosarySequence[scriptureStepIndex],
      currentBeadIndex: scriptureStepIndex,
      currentPrayer: prayerById["hail-mary"],
    });

    await render(<RosaryPrayerScreen isDecade={false} />);

    expect(screen.getByRole("button", { name: "completed crucifix, Apostles' Creed" })).toBeTruthy();
    expect(screen.getByLabelText(/upcoming bead 59, Hail Mary/i)).toBeTruthy();
    expect(screen.queryByTestId("rosary-bead-72")).toBeNull();
    expect(screen.getByText("Luke 1:28")).toBeTruthy();
    expect(
      screen.getByText("Hail, thou that art highly favoured, the Lord is with thee: blessed art thou among women."),
    ).toBeTruthy();
    expect(useRosarySession).toHaveBeenCalledWith(
      expect.objectContaining({ beads: expect.arrayContaining([fullRosarySequence[71]]), isFullRosary: true }),
    );
  });

  it("starts and ends with an unnumbered Sign of the Cross while retaining the correct highlight", async () => {
    mockSession({
      currentBead: fullRosarySequence[0],
      currentBeadIndex: 0,
      currentPrayer: prayerById["sign-of-cross"],
    });
    const rendered = await render(<RosaryPrayerScreen isDecade={false} />);

    expect(screen.getByText("SIGN OF THE CROSS")).toBeTruthy();
    expect(screen.getByText("0 of 59")).toBeTruthy();
    expect(screen.getByRole("button", { name: "current crucifix, Apostles' Creed" })).toBeTruthy();

    const closingIndex = fullRosarySequence.length - 1;
    mockSession({
      currentBead: fullRosarySequence[closingIndex],
      currentBeadIndex: closingIndex,
      currentPrayer: prayerById["sign-of-cross"],
    });
    await rendered.rerender(<RosaryPrayerScreen isDecade={false} />);

    expect(screen.getByText("SIGN OF THE CROSS")).toBeTruthy();
    expect(screen.getByText("59 of 59")).toBeTruthy();
    expect(screen.getByLabelText(/current bead 59, Hail Mary/i)).toBeTruthy();
  });

  it("shows non-bead prayers without incrementing bead progress or moving the highlight", async () => {
    const fatimaPrayerIndex = fullRosarySequence.findIndex((bead) => bead.type === "fatimaPrayer");
    mockSession({
      currentBead: fullRosarySequence[fatimaPrayerIndex],
      currentBeadIndex: fatimaPrayerIndex,
      currentPrayer: prayerById["fatima-prayer"],
    });

    await render(<RosaryPrayerScreen isDecade={false} />);

    expect(screen.getByText("FATIMA PRAYER")).toBeTruthy();
    expect(screen.getByText("15 of 59")).toBeTruthy();
    expect(screen.getByLabelText(/current bead 15, Hail Mary/i)).toBeTruthy();
    expect(screen.queryByTestId("rosary-bead-19")).toBeNull();
  });

  it("provides a chevron back action for this non-tab route", async () => {
    await render(<RosaryPrayerScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Go back" }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("shows the live Rosary Presence summary without replacing prayer controls", async () => {
    mockUseRosaryPresence.mockReturnValue({
      connectionState: "connected",
      currentUserId: "user-me",
      users: [
        {
          avatarUrl: null,
          countryCode: "US",
          displayName: "St. Joseph",
          joinedAt: "2026-09-15T10:00:00.000Z",
          saintAvatarId: null,
          title: null,
          userId: "user-me",
          username: "st_joseph",
        },
        {
          avatarUrl: null,
          countryCode: "MX",
          displayName: "Maria",
          joinedAt: "2026-09-15T10:01:00.000Z",
          saintAvatarId: null,
          title: null,
          userId: "user-maria",
          username: "maria",
        },
      ],
    });

    await render(<RosaryPrayerScreen />);

    expect(screen.getByText("2 praying")).toBeTruthy();
    expect(screen.getByLabelText("2 people praying now")).toBeTruthy();
    expect(screen.getByTestId("rosary-progress-button")).toBeTruthy();
  });

  it("orders the header controls inside the scrolling Rosary content", async () => {
    mockUseRosaryPresence.mockReturnValue({
      connectionState: "connected",
      currentUserId: "user-me",
      users: [
        {
          avatarUrl: null,
          countryCode: "US",
          displayName: "St. Joseph",
          joinedAt: "2026-09-15T10:00:00.000Z",
          saintAvatarId: null,
          title: null,
          userId: "user-me",
          username: "st_joseph",
        },
        {
          avatarUrl: null,
          countryCode: "MX",
          displayName: "Maria",
          joinedAt: "2026-09-15T10:01:00.000Z",
          saintAvatarId: null,
          title: null,
          userId: "user-maria",
          username: "maria",
        },
      ],
    });

    await render(<RosaryPrayerScreen />);

    const scrollingContent = screen.getByLabelText("Rosary prayer content");
    const header = within(scrollingContent).getByLabelText("Rosary controls header");
    const controls = within(header).getAllByRole("button");
    expect(controls.map((control) => control.props.accessibilityLabel)).toEqual([
      "Go back",
      "Current Rosary length: Classic (20 min)",
      "View Maria's prayer profile, online and praying",
      "View all 2 people praying now",
    ]);
  });

  it("should advance to the next bead when the progress button is pressed", async () => {
    await render(<RosaryPrayerScreen />);

    await fireEvent.press(screen.getByTestId("rosary-progress-button"));

    expect(goToNextBead).toHaveBeenCalledTimes(1);
  });

  it("connects the current localized prayer queue to play and mute controls", async () => {
    await render(<RosaryPrayerScreen />);

    expect(mockUseRosaryAudioPlayback).toHaveBeenCalledWith(
      expect.objectContaining({
        audioQueue: rosarySequence[0].audioQueue,
        isMuted: false,
        onQueueComplete: goToNextBead,
      }),
    );
    const playbackOptions = mockUseRosaryAudioPlayback.mock.lastCall?.[0] as
      { onQueueComplete?: () => void } | undefined;
    playbackOptions?.onQueueComplete?.();
    expect(goToNextBead).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByRole("button", { name: "Play prayer audio" }));
    expect(mockToggleAudioPlayback).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByLabelText("Open Rosary settings"));
    const muteSwitch = screen.getByRole("switch", { name: "Mute Rosary audio" });
    expect(muteSwitch.props.accessibilityState).toEqual({ checked: false });
    await fireEvent.press(muteSwitch);
    expect(mockSetAudioMuted).toHaveBeenCalledWith(true);
  });

  it("should provide accessible info, settings, progress, and bead controls", async () => {
    await render(<RosaryPrayerScreen />);

    expect(screen.getByLabelText("Show rosary swipe instructions")).toBeTruthy();
    expect(screen.queryByLabelText("Previous bead")).toBeNull();
    expect(screen.queryByLabelText("Next bead")).toBeNull();
    expect(screen.getByLabelText("Open Rosary settings")).toBeTruthy();
    expect(screen.getByTestId("rosary-progress-button")).toBeTruthy();
    expect(screen.getByLabelText(/current bead 1/i)).toBeTruthy();
  });

  it("gives the rosary rail and prayer details the same viewport height", async () => {
    await render(<RosaryPrayerScreen />);

    await fireEvent(screen.getByLabelText("Rosary prayer content"), "layout", {
      nativeEvent: { layout: { height: 700 } },
    });
    await fireEvent(screen.getByLabelText("Rosary controls header"), "layout", {
      nativeEvent: { layout: { height: 44 } },
    });

    expect(StyleSheet.flatten(screen.getByTestId("rosary-navigator-column").props.style)).toMatchObject({
      height: 644,
    });
    const prayerDetails = screen.getByLabelText("Rosary prayer details");
    expect(StyleSheet.flatten(prayerDetails.props.style)).toMatchObject({ height: 644 });
    expect(StyleSheet.flatten(prayerDetails.props.contentContainerStyle)).toMatchObject({ flexGrow: 1 });
    expect(StyleSheet.flatten(within(prayerDetails).getByTestId("mystery-image-frame").props.style)).toMatchObject({
      maxWidth: 644 * (575 / 784),
    });
    expect(within(prayerDetails).getByText("CURRENT MYSTERY")).toBeTruthy();
    expect(within(prayerDetails).getByText("FRUIT OF THE MYSTERY")).toBeTruthy();
    expect(within(prayerDetails).getByText("HAIL MARY")).toBeTruthy();
    expect(within(prayerDetails).getByText("SCRIPTURE")).toBeTruthy();
  });

  it("opens settings from the Classic-length badge and changes the active length", async () => {
    await render(<RosaryPrayerScreen isDecade={false} />);

    const lengthBadge = await screen.findByRole("button", { name: "Current Rosary length: Classic (20 min)" });
    await fireEvent.press(lengthBadge);

    expect(screen.getByRole("header", { name: "Rosary settings" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("radio", { name: "Long (30 min) Rosary" }));

    expect(screen.getByLabelText("Current Rosary length: Long (30 min)")).toBeTruthy();
    await waitFor(() =>
      expect(useRosarySession).toHaveBeenLastCalledWith(
        expect.objectContaining({
          beads: expect.arrayContaining([expect.objectContaining({ id: "litany-of-loreto" })]),
        }),
      ),
    );
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

    expect(await screen.findByTestId("rosary-completion-confetti")).toBeTruthy();
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
