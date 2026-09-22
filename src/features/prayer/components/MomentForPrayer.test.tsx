import { fireEvent, render, screen } from "@testing-library/react-native";

import { MomentForPrayer } from "./MomentForPrayer";
import { rosaryMysterySets } from "@/features/prayer/rosary/data/rosaryMysteries";

describe("MomentForPrayer", () => {
  it("renders today's rosary action", async () => {
    const onPrayToday = jest.fn();

    const mysteryImageSource = rosaryMysterySets[0].imageSource;
    await render(
      <MomentForPrayer
        mysteryImageSource={mysteryImageSource}
        mysteryTitle="Joyful Mysteries"
        onPrayToday={onPrayToday}
        weekday="Monday"
      />,
    );

    expect(screen.getByText("Joyful Mysteries")).toBeTruthy();
    expect(screen.queryByText("A MOMENT OF PRAYER")).toBeNull();
    expect(screen.getByTestId("today-rosary-mystery-image").props.source).toEqual([mysteryImageSource]);

    await fireEvent.press(screen.getByLabelText("Pray today's Joyful Mysteries"));

    expect(onPrayToday).toHaveBeenCalledTimes(1);
  });
});
