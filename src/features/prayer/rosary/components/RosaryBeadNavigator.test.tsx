import { fireEvent, render, screen, within } from "@testing-library/react-native";
import { fireGestureHandler, getByGestureTestId } from "react-native-gesture-handler/jest-utils";

import { fullRosarySequence, rosarySequence } from "@/features/prayer/rosary/data/rosarySequence";

import { RosaryBeadNavigator } from "./RosaryBeadNavigator";

describe("RosaryBeadNavigator", () => {
  it("provides swipe navigation and bead selection without previous or next buttons", async () => {
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

    expect(screen.queryByLabelText("Previous bead")).toBeNull();
    expect(screen.queryByLabelText("Next bead")).toBeNull();

    fireGestureHandler(getByGestureTestId("rosary-swipe-gesture"), [{ translationY: -50 }]);
    fireGestureHandler(getByGestureTestId("rosary-swipe-gesture"), [{ translationY: 50 }]);
    await fireEvent.press(screen.getByTestId("rosary-bead-1"));

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onSelectBead).toHaveBeenCalledWith("hail-mary-1");
  });

  it("reveals the swipe instruction from an accessible info toggle", async () => {
    await render(
      <RosaryBeadNavigator
        beads={rosarySequence.slice(0, 2)}
        completedBeadIds={[]}
        currentBeadIndex={0}
        isTransitioning={false}
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onSelectBead={jest.fn()}
      />,
    );

    expect(screen.queryByText(/Swipe up or down/)).toBeNull();
    const showInfo = screen.getByRole("button", { name: "Show rosary swipe instructions" });
    expect(showInfo.props.accessibilityState).toEqual({ expanded: false });

    await fireEvent.press(showInfo);

    expect(screen.getByText(/Swipe up or down/)).toBeTruthy();
    const hideInfo = screen.getByRole("button", { name: "Hide rosary swipe instructions" });
    expect(hideInfo.props.accessibilityState).toEqual({ expanded: true });

    await fireEvent.press(hideInfo);

    expect(screen.queryByText(/Swipe up or down/)).toBeNull();
  });

  it("renders bead markers in bottom-to-top sequence order", async () => {
    await render(
      <RosaryBeadNavigator
        beads={rosarySequence.slice(0, 3)}
        completedBeadIds={[]}
        currentBeadIndex={0}
        isTransitioning={false}
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onSelectBead={jest.fn()}
      />,
    );

    const navigator = screen.getByLabelText("Rosary bead navigator");
    const markerLabels = within(navigator)
      .getAllByRole("button")
      .map((button) => button.props.accessibilityLabel)
      .filter((label) => typeof label === "string" && label.includes("bead"));

    expect(markerLabels).toEqual([
      "upcoming bead 3, Hail Mary",
      "upcoming bead 2, Hail Mary",
      "current bead 1, Hail Mary",
    ]);
  });

  it("marks earlier unrecorded beads complete when navigating past them", async () => {
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

  it("shows a highlighted crucifix for the Apostles' Creed", async () => {
    await render(
      <RosaryBeadNavigator
        beads={fullRosarySequence}
        completedBeadIds={[]}
        currentBeadIndex={0}
        isTransitioning={false}
        onNext={jest.fn()}
        onPrevious={jest.fn()}
        onSelectBead={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "current crucifix, Apostles' Creed" })).toBeTruthy();
  });

  it.each([
    { prayer: "Glory Be", prayerId: "glory-be", previousBeadNumber: 4, nextBeadNumber: 5 },
    { prayer: "Fatima Prayer", prayerId: "fatima-prayer", previousBeadNumber: 15, nextBeadNumber: 16 },
    { prayer: "Hail, Holy Queen", prayerId: "hail-holy-queen", previousBeadNumber: 59 },
    { prayer: "closing Sign of the Cross", prayerId: "sign-of-cross", previousBeadNumber: 59, section: "closing" },
  ])(
    "hides $prayer without a gap and keeps physical bead $previousBeadNumber highlighted",
    async ({ nextBeadNumber, prayerId, previousBeadNumber, section }) => {
      const stepIndex = fullRosarySequence.findIndex(
        (bead) => bead.prayerId === prayerId && (!section || bead.section === section),
      );
      const stepSequence = fullRosarySequence[stepIndex]?.sequence;
      expect(stepIndex).toBeGreaterThanOrEqual(0);

      await render(
        <RosaryBeadNavigator
          beads={fullRosarySequence}
          completedBeadIds={[]}
          currentBeadIndex={stepIndex}
          isTransitioning={false}
          onNext={jest.fn()}
          onPrevious={jest.fn()}
          onSelectBead={jest.fn()}
        />,
      );

      expect(screen.queryByTestId(`rosary-bead-${stepSequence}`)).toBeNull();
      expect(screen.getByLabelText(new RegExp(`current bead ${previousBeadNumber}, Hail Mary`, "i"))).toBeTruthy();
      if (nextBeadNumber) {
        expect(screen.getByLabelText(new RegExp(`upcoming bead ${nextBeadNumber}, Our Father`, "i"))).toBeTruthy();
      }
    },
  );
});
