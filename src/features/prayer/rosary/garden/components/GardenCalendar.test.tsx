import { render, screen, within } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import type { RosaryGardenDay } from "@/features/prayer/rosary/garden/types";

import { GardenCalendar } from "./GardenCalendar";

const daysInWeek = 7;

function makeDays(year: number, month: number, completedDay?: number): RosaryGardenDay[] {
  const dayCount = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return Array.from({ length: dayCount }, (_, index) => {
    const day = index + 1;
    return {
      completed: day === completedDay,
      date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      day,
      flowerVariant: day === completedDay ? "redRose" : undefined,
      isEligible: true,
      isFuture: false,
      isToday: false,
    };
  });
}

function renderMonth(year: number, month: number, completedDay?: number) {
  return render(<GardenCalendar days={makeDays(year, month, completedDay)} month={month} year={year} />);
}

function expectDayAt(year: number, month: number, day: number, row: number, column: number) {
  const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const cell = screen.getByTestId(`garden-calendar-cell-${row}-${column}`);

  expect(within(cell).getByTestId(`garden-day-${date}`)).toBeTruthy();
}

function expectSevenColumnsPerRow() {
  const rows = screen.getAllByTestId(/^garden-calendar-row-/);

  rows.forEach((row) => {
    expect(within(row).getAllByTestId(/^garden-calendar-cell-/)).toHaveLength(daysInWeek);
  });
}

describe("GardenCalendar", () => {
  it("renders exactly seven equal weekday and date columns", async () => {
    await renderMonth(2026, 8);

    const weekdayColumns = screen.getAllByTestId(/^garden-weekday-/);
    expect(weekdayColumns).toHaveLength(daysInWeek);
    weekdayColumns.forEach((column) => {
      expect(StyleSheet.flatten(column.props.style)).toMatchObject({ flex: 1, minWidth: 0 });
    });

    expectSevenColumnsPerRow();
    const dateCell = screen.getByTestId("garden-calendar-cell-0-0");
    expect(StyleSheet.flatten(dateCell.props.style)).toMatchObject({ aspectRatio: 1, flex: 1, minWidth: 0 });
  });

  it("places August 1, 2026 in Saturday after six leading cells and uses six rows", async () => {
    await renderMonth(2026, 8);

    expect(screen.getAllByTestId(/^garden-leading-empty-/)).toHaveLength(6);
    expect(screen.getAllByTestId(/^garden-calendar-row-/)).toHaveLength(6);
    expectDayAt(2026, 8, 1, 0, 6);
    expectDayAt(2026, 8, 2, 1, 0);
    expectDayAt(2026, 8, 31, 5, 1);
    expectSevenColumnsPerRow();
  });

  it("places September 1, 2026 in Tuesday", async () => {
    await renderMonth(2026, 9);

    expect(screen.getAllByTestId(/^garden-leading-empty-/)).toHaveLength(2);
    expectDayAt(2026, 9, 1, 0, 2);
  });

  it("renders all 29 days in leap-year February 2028", async () => {
    await renderMonth(2028, 2);

    expect(screen.getAllByTestId(/^garden-day-/)).toHaveLength(29);
    expectDayAt(2028, 2, 1, 0, 2);
    expectDayAt(2028, 2, 29, 4, 2);
    expectSevenColumnsPerRow();
  });

  it("renders only 28 days in non-leap-year February 2027", async () => {
    await renderMonth(2027, 2);

    expect(screen.getAllByTestId(/^garden-day-/)).toHaveLength(28);
    expectDayAt(2027, 2, 1, 0, 1);
    expectDayAt(2027, 2, 28, 4, 0);
    expectSevenColumnsPerRow();
  });

  it("places day 1 in Sunday with no leading cells for a Sunday-start month", async () => {
    await renderMonth(2026, 11);

    expect(screen.queryAllByTestId(/^garden-leading-empty-/)).toHaveLength(0);
    expectDayAt(2026, 11, 1, 0, 0);
    expectSevenColumnsPerRow();
  });

  it("keeps completion artwork inside its date slot without changing grid placement", async () => {
    await renderMonth(2026, 8, 27);

    const completedCell = screen.getByTestId("garden-calendar-cell-4-4");
    expect(within(completedCell).getByTestId("garden-day-2026-08-27")).toBeTruthy();
    expect(within(completedCell).getByTestId("day-calendar-reward")).toBeTruthy();
    expect(within(completedCell).getByTestId("day-calendar-completion-check")).toBeTruthy();
    expect(StyleSheet.flatten(completedCell.props.style)).toMatchObject({
      aspectRatio: 1,
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
    });
    expectDayAt(2026, 8, 28, 4, 5);
  });

  it("announces full dates and completion status", async () => {
    await renderMonth(2026, 8, 27);

    expect(screen.getByLabelText("August 27, 2026, completed")).toBeTruthy();
    expect(screen.getByLabelText("August 28, 2026, not completed")).toBeTruthy();
  });
});
