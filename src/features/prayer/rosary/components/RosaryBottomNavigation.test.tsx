import { fireEvent, render, screen } from "@testing-library/react-native";

import { RosaryBottomNavigation } from "./RosaryBottomNavigation";

describe("RosaryBottomNavigation", () => {
  it("advances and restarts the Rosary from its accessible controls", async () => {
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

  it("allows settings to close without changing the mystery", async () => {
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
