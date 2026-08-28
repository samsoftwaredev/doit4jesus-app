import { fireEvent, render, screen } from "@testing-library/react-native";

import { rosarySequence } from "@/features/prayer/rosary/data/rosarySequence";

import { RosaryBeadNavigator } from "./RosaryBeadNavigator";

describe("RosaryBeadNavigator", () => {
  it("provides equivalent navigation buttons and bead selection", async () => {
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
});
