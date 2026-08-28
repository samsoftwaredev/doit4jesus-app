import { fireEvent, render, screen } from "@testing-library/react-native";

import { MonthNavigator } from "./MonthNavigator";

describe("MonthNavigator", () => {
  it("provides consistent accessible navigation controls", async () => {
    const onNext = jest.fn();
    const onPrevious = jest.fn();

    await render(
      <MonthNavigator canGoNext canGoPrevious month={8} onNext={onNext} onPrevious={onPrevious} year={2026} />,
    );

    await fireEvent.press(screen.getByLabelText("Previous month"));
    await fireEvent.press(screen.getByLabelText("Next month"));

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("garden-previous-month").props.accessibilityState).toEqual({ disabled: false });
    expect(screen.getByTestId("garden-next-month").props.accessibilityState).toEqual({ disabled: false });
  });

  it("only disables navigation that is unavailable", async () => {
    const onNext = jest.fn();

    await render(
      <MonthNavigator canGoNext={false} canGoPrevious month={8} onNext={onNext} onPrevious={jest.fn()} year={2026} />,
    );

    await fireEvent.press(screen.getByTestId("garden-next-month"));

    expect(onNext).not.toHaveBeenCalled();
    expect(screen.getByTestId("garden-next-month").props.accessibilityState).toEqual({ disabled: true });
    expect(screen.getByTestId("garden-previous-month").props.accessibilityState).toEqual({ disabled: false });
  });
});
