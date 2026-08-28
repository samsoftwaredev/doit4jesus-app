import { fireEvent, render, screen } from "@testing-library/react-native";

import { DailyMassHeader } from "./DailyMassHeader";

describe("DailyMassHeader", () => {
  it("renders the 'Daily Mass' title", async () => {
    await render(<DailyMassHeader date="2026-08-21" />);
    expect(screen.getByText("Daily Mass")).toBeTruthy();
  });

  it("formats the date as a full weekday, month, day, year string", async () => {
    await render(<DailyMassHeader date="2026-08-21" />);
    expect(screen.getByText("Friday, August 21, 2026")).toBeTruthy();
  });

  it("has a header accessibilityRole on the container", async () => {
    await render(<DailyMassHeader date="2026-08-21" />);
    const title = screen.getByText("Daily Mass");
    expect(title.parent?.parent?.props.accessibilityRole).toBe("header");
  });

  it("calls onCalendarPress when the calendar button is pressed", async () => {
    const onCalendarPress = jest.fn();
    await render(<DailyMassHeader date="2026-08-21" onCalendarPress={onCalendarPress} />);
    await fireEvent.press(screen.getByLabelText("Select a Mass date"));
    expect(onCalendarPress).toHaveBeenCalledTimes(1);
  });

  it("disables the calendar button when no handler is provided", async () => {
    await render(<DailyMassHeader date="2026-08-21" />);
    const button = screen.getByLabelText("Select a Mass date");
    expect(button.props.accessibilityState?.disabled ?? button.props.disabled).toBeTruthy();
  });
});
