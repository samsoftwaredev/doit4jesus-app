import { render, screen } from "@testing-library/react-native";

import type { RosaryGardenDay } from "@/features/prayer/rosary/garden/types";

import { GardenCalendar } from "./GardenCalendar";

const days: RosaryGardenDay[] = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  return {
    completed: day === 3,
    date: `2026-08-${String(day).padStart(2, "0")}`,
    day,
    flowerVariant: day === 3 ? "redRose" : undefined,
    isEligible: day <= 8,
    isFuture: day > 8,
    isToday: day === 8,
  };
});

describe("GardenCalendar", () => {
  it("renders completed and incomplete eligible days distinctly", async () => {
    await render(<GardenCalendar days={days} month={8} year={2026} />);

    expect(screen.getByLabelText("August 3. Rosary completed.")).toBeTruthy();
    expect(screen.getByLabelText("August 4. Rosary not completed.")).toBeTruthy();
  });
});
