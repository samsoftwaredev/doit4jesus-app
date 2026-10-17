import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { fullRosarySequence, rosarySequence } from "@/features/prayer/rosary/data/rosarySequence";

import { RosaryBead } from "./RosaryBead";

describe("RosaryBead", () => {
  it("renders upcoming and active variants as non-interactive markers", async () => {
    await render(
      <>
        <RosaryBead bead={rosarySequence[0]} state="upcoming" />
        <RosaryBead bead={rosarySequence[1]} compact state="active" />
      </>,
    );

    expect(screen.getByRole("image", { name: "upcoming bead 1, Hail Mary" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "upcoming bead 1, Hail Mary" })).toBeNull();
  });

  it("renders Our Father beads larger than Hail Mary beads", async () => {
    const ourFatherBead = fullRosarySequence.find((bead) => bead.type === "ourFather");
    expect(ourFatherBead).toBeDefined();

    await render(
      <>
        <RosaryBead bead={rosarySequence[0]} state="upcoming" />
        <RosaryBead bead={ourFatherBead!} state="upcoming" />
      </>,
    );

    const hailMaryStyle = StyleSheet.flatten(screen.getByTestId("rosary-bead-shape-1").props.style);
    const ourFatherStyle = StyleSheet.flatten(
      screen.getByTestId(`rosary-bead-shape-${ourFatherBead?.sequence}`).props.style,
    );

    expect(ourFatherStyle.width).toBeGreaterThan(hailMaryStyle.width);
    expect(ourFatherStyle.height).toBeGreaterThan(hailMaryStyle.height);
  });

  it("renders the Apostles' Creed as a non-interactive highlighted crucifix", async () => {
    const apostlesCreed = fullRosarySequence.find((bead) => bead.type === "creed");
    expect(apostlesCreed).toBeDefined();

    await render(<RosaryBead bead={apostlesCreed!} state="active" />);

    expect(screen.getByRole("image", { name: "current crucifix, Apostles' Creed" }).props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
    expect(screen.getByTestId(`rosary-crucifix-shape-${apostlesCreed?.sequence}`)).toBeTruthy();
    expect(screen.queryByTestId(`rosary-bead-shape-${apostlesCreed?.sequence}`)).toBeNull();
  });
});
