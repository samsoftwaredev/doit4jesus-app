import { fireEvent, render, screen } from "@testing-library/react-native";

import { MysteryCard } from "@/features/prayer/rosary/components/MysteryCard";
import { PrayerCard } from "@/features/prayer/rosary/components/PrayerCard";
import { RosaryBead } from "@/features/prayer/rosary/components/RosaryBead";
import { RosaryBeadNavigator } from "@/features/prayer/rosary/components/RosaryBeadNavigator";
import { RosaryBottomNavigation } from "@/features/prayer/rosary/components/RosaryBottomNavigation";
import { ScriptureCard } from "@/features/prayer/rosary/components/ScriptureCard";
import { rosaryMysteries } from "@/features/prayer/rosary/data/rosaryMysteries";
import { rosarySequence } from "@/features/prayer/rosary/data/rosarySequence";
import { RosaryPrayerScreen } from "@/features/prayer/rosary/screens/RosaryPrayerScreen";

const goToNextBead = jest.fn();
const goToPreviousBead = jest.fn();
const restartMystery = jest.fn();
const selectBead = jest.fn();

jest.mock("@/features/prayer/rosary/hooks/useRosarySession", () => ({
  useRosarySession: jest.fn(),
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
    mockSession();
  });

  it("should render the current mystery content by default", async () => {
    await render(<RosaryPrayerScreen />);

    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();
    expect(screen.getByText("The Annunciation")).toBeTruthy();
    expect(screen.getByText("Luke 1:38")).toBeTruthy();
    expect(screen.getByText("HAIL MARY")).toBeTruthy();
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
});

describe("Rosary content cards", () => {
  it("should show a graceful fallback when a mystery image cannot load", async () => {
    useReducedMotion.mockReturnValue(false);
    await render(<MysteryCard imageHeight={180} mystery={rosaryMysteries[0]} />);

    await fireEvent(screen.getByLabelText(rosaryMysteries[0].imageAlt), "error", {
      nativeEvent: {},
    });

    expect(screen.getByLabelText("Devotional image unavailable")).toBeTruthy();
  });

  it("should render an empty-data fallback when no prayer text is available", async () => {
    await render(<PrayerCard />);

    expect(screen.getByLabelText("Prayer text unavailable")).toBeTruthy();
  });

  it("should preserve a configured prayer name when its text is empty", async () => {
    await render(<PrayerCard prayer={{ ...rosaryMysteries[0].prayers[1], text: "" }} />);

    expect(screen.getByText("HAIL MARY")).toBeTruthy();
    expect(screen.getByLabelText("Prayer text unavailable")).toBeTruthy();
  });

  it("should use a generic accessibility name for incomplete prayer data", async () => {
    await render(
      <PrayerCard
        prayer={{
          beadType: "hailMary",
          id: "partial-prayer",
          name: undefined as unknown as string,
          text: "A short prayer.",
        }}
      />,
    );

    expect(screen.getByLabelText("Prayer text")).toBeTruthy();
  });

  it("should render configured scripture content and fallbacks", async () => {
    await render(<ScriptureCard quotation="A configured quotation." reference="John 1:1" />);
    expect(screen.getByText("John 1:1")).toBeTruthy();
    expect(screen.getByText("A configured quotation.")).toBeTruthy();

    await render(<ScriptureCard />);
    expect(screen.getByText("Scripture reference unavailable")).toBeTruthy();
  });

  it("should expose the settings and restart action from the bottom navigation", async () => {
    useReducedMotion.mockReturnValue(false);
    const onAdvance = jest.fn();
    const onRestart = jest.fn();
    await render(
      <RosaryBottomNavigation
        onAdvance={onAdvance}
        onRestart={onRestart}
        progress={{ currentIndex: 2, prayerName: "Hail Mary", total: 10 }}
      />,
    );

    await fireEvent.press(screen.getByLabelText("Hail Mary, 2 of 10. Next bead."));
    await fireEvent.press(screen.getByLabelText("Open Rosary settings"));
    await fireEvent.press(screen.getByLabelText("Restart current mystery"));

    expect(onAdvance).toHaveBeenCalledTimes(1);
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("should offer equivalent Rosary navigator buttons and bead selection", async () => {
    const onNext = jest.fn();
    const onPrevious = jest.fn();
    const onSelectBead = jest.fn();
    await render(
      <RosaryBeadNavigator
        beads={rosarySequence.slice(0, 2)}
        completedBeadIds={["hail-mary-1"]}
        currentBeadIndex={1}
        isTransitioning={false}
        onNext={onNext}
        onPrevious={onPrevious}
        onSelectBead={onSelectBead}
      />,
    );

    await fireEvent.press(screen.getByLabelText("Previous bead"));
    await fireEvent.press(screen.getByLabelText("Next bead"));
    await fireEvent.press(screen.getByTestId("rosary-bead-1"));

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onSelectBead).toHaveBeenCalledWith("hail-mary-1");
  });

  it("should mark earlier unrecorded beads complete when navigating past them", async () => {
    await render(
      <RosaryBeadNavigator
        beads={rosarySequence.slice(0, 2)}
        completedBeadIds={[]}
        currentBeadIndex={1}
        isTransitioning={false}
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onSelectBead={jest.fn()}
      />,
    );

    expect(screen.getByLabelText(/completed bead 1/i)).toBeTruthy();
  });

  it("should render upcoming and active bead variants without reduced motion", async () => {
    useReducedMotion.mockReturnValue(false);
    const onPress = jest.fn();
    await render(
      <>
        <RosaryBead bead={rosarySequence[0]} onPress={onPress} state="upcoming" />
        <RosaryBead bead={rosarySequence[1]} compact disabled onPress={onPress} state="active" />
      </>,
    );

    await fireEvent.press(screen.getByTestId("rosary-bead-1"));
    await fireEvent.press(screen.getByTestId("rosary-bead-2"));

    expect(onPress).toHaveBeenCalledWith("hail-mary-1");
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("should allow a user to close settings without changing the mystery", async () => {
    const onRestart = jest.fn();
    await render(
      <RosaryBottomNavigation
        disabled
        onAdvance={jest.fn()}
        onRestart={onRestart}
        progress={{ currentIndex: 1, prayerName: "Hail Mary", total: 10 }}
      />,
    );

    await fireEvent.press(screen.getByLabelText("Open Rosary settings"));
    await fireEvent.press(screen.getByLabelText("Close Rosary settings"));

    expect(onRestart).not.toHaveBeenCalled();
  });
});
