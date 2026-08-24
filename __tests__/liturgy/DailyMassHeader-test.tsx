import { fireEvent, render, screen } from "@testing-library/react-native";

import { DailyMassHeader } from "@/features/liturgy/components";

describe("DailyMassHeader", () => {
  it("keeps Next disabled when tomorrow is already displayed", async () => {
    const onNextDay = jest.fn();
    const onPreviousDay = jest.fn();

    const rendered = await render(
      <DailyMassHeader
        date="2026-08-23"
        nextDayDisabled
        onNextDay={onNextDay}
        onPreviousDay={onPreviousDay}
      />,
    );

    expect(
      screen.getByLabelText("Show the next day's liturgy").props
        .accessibilityState,
    ).toMatchObject({ disabled: true });

    await fireEvent.press(screen.getByLabelText("Show the previous day's liturgy"));
    expect(onPreviousDay).toHaveBeenCalledTimes(1);

    await rendered.rerender(
      <DailyMassHeader
        date="2026-08-22"
        onNextDay={onNextDay}
        onPreviousDay={onPreviousDay}
      />,
    );

    await fireEvent.press(screen.getByLabelText("Show the next day's liturgy"));
    expect(onNextDay).toHaveBeenCalledTimes(1);
  });
});
