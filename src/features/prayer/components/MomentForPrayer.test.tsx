import { fireEvent, render, screen } from "@testing-library/react-native";

import { MomentForPrayer } from "./MomentForPrayer";

describe("MomentForPrayer", () => {
  it("renders today's rosary and exposes both actions", async () => {
    const onOpenGarden = jest.fn();
    const onPrayToday = jest.fn();

    await render(
      <MomentForPrayer
        mysteryTitle="Joyful Mysteries"
        onOpenGarden={onOpenGarden}
        onPrayToday={onPrayToday}
        weekday="Monday"
      />,
    );

    expect(screen.getByRole("header", { name: "Rosary" })).toBeTruthy();
    expect(screen.getByText("A MOMENT OF PRAYER")).toBeTruthy();
    expect(screen.getByText("Joyful Mysteries")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Open Rosary Garden"));
    await fireEvent.press(screen.getByLabelText("Pray today's Joyful Mysteries"));

    expect(onOpenGarden).toHaveBeenCalledTimes(1);
    expect(onPrayToday).toHaveBeenCalledTimes(1);
  });
});
