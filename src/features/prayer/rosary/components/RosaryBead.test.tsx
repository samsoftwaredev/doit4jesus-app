import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { fullRosarySequence, rosarySequence } from "@/features/prayer/rosary/data/rosarySequence";

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

  it("renders Our Father beads larger than Hail Mary beads", async () => {
    const ourFatherBead = fullRosarySequence.find((bead) => bead.type === "ourFather");
    expect(ourFatherBead).toBeDefined();

    await render(
      <>
        <RosaryBead bead={rosarySequence[0]} onPress={jest.fn()} state="upcoming" />
        <RosaryBead bead={ourFatherBead!} onPress={jest.fn()} state="upcoming" />
      </>,
    );

    const hailMaryStyle = StyleSheet.flatten(screen.getByTestId("rosary-bead-shape-1").props.style);
    const ourFatherStyle = StyleSheet.flatten(
      screen.getByTestId(`rosary-bead-shape-${ourFatherBead?.sequence}`).props.style,
    );

    expect(ourFatherStyle.width).toBeGreaterThan(hailMaryStyle.width);
    expect(ourFatherStyle.height).toBeGreaterThan(hailMaryStyle.height);
  });

  it("renders the Apostles' Creed as a selectable highlighted crucifix", async () => {
    const apostlesCreed = fullRosarySequence.find((bead) => bead.type === "creed");
    expect(apostlesCreed).toBeDefined();

    await render(<RosaryBead bead={apostlesCreed!} onPress={jest.fn()} state="active" />);

    expect(screen.getByRole("button", { name: "current crucifix, Apostles' Creed" }).props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
    expect(screen.getByTestId(`rosary-crucifix-shape-${apostlesCreed?.sequence}`)).toBeTruthy();
    expect(screen.queryByTestId(`rosary-bead-shape-${apostlesCreed?.sequence}`)).toBeNull();
  });
});
