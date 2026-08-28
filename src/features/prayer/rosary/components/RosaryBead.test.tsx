import { fireEvent, render, screen } from "@testing-library/react-native";

import { rosarySequence } from "@/features/prayer/rosary/data/rosarySequence";

import { RosaryBead } from "./RosaryBead";

describe("RosaryBead", () => {
  it("renders upcoming and active variants while respecting disabled state", async () => {
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
});
