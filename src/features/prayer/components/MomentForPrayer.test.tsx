import { fireEvent, render, screen } from "@testing-library/react-native";

import { MomentForPrayer } from "./MomentForPrayer";

describe("MomentForPrayer", () => {
  it("renders today's rosary action", async () => {
    const onPrayToday = jest.fn();

    await render(<MomentForPrayer mysteryTitle="Joyful Mysteries" onPrayToday={onPrayToday} weekday="Monday" />);

    expect(screen.getByText("Joyful Mysteries")).toBeTruthy();
    expect(screen.queryByText("A MOMENT OF PRAYER")).toBeNull();

    await fireEvent.press(screen.getByLabelText("Pray today's Joyful Mysteries"));

    expect(onPrayToday).toHaveBeenCalledTimes(1);
  });
});
