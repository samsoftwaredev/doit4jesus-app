import { fireEvent, render, screen } from "@testing-library/react-native";

import { GardenCalendar } from "@/components/rosaryGarden/GardenCalendar";
import { RosaryGardenScreen } from "@/screens/RosaryGardenScreen";
import type { RosaryGardenDay } from "@/types/rosaryGarden";

const goToNextMonth = jest.fn();
const goToPreviousMonth = jest.fn();

jest.mock("@/hooks/useRosaryGarden", () => ({ useRosaryGarden: jest.fn() }));

const { useRosaryGarden } = jest.requireMock("@/hooks/useRosaryGarden") as { useRosaryGarden: jest.Mock };

const days: RosaryGardenDay[] = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  const date = `2026-08-${String(day).padStart(2, "0")}`;
  return {
    completed: day === 3,
    date,
    day,
    flowerVariant: day === 3 ? "redRose" : undefined,
    isEligible: day <= 8,
    isFuture: day > 8,
    isToday: day === 8,
  };
});

function mockGarden() {
  useRosaryGarden.mockReturnValue({
    canGoNext: false,
    canGoPrevious: true,
    days,
    goToNextMonth,
    goToPreviousMonth,
    isLoading: false,
    isUsingMockData: false,
    markTodayCompleted: jest.fn(),
    selectedMonthNumber: 8,
    selectedYear: 2026,
    stats: { completedDays: 1, completionPercentage: 13, currentStreak: 1, eligibleDays: 8, longestStreak: 1 },
  });
}

describe("RosaryGardenScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGarden();
  });

  it("should render the selected month", async () => {
    await render(<RosaryGardenScreen />);

    expect(screen.getByText("Rosary Garden")).toBeTruthy();
    expect(screen.getByText("August 2026")).toBeTruthy();
  });

  it("should show a flower for a completed rosary day", async () => {
    await render(<GardenCalendar days={days} month={8} year={2026} />);

    expect(screen.getByLabelText("August 3. Rosary completed.")).toBeTruthy();
  });

  it("should show a sprout for an incomplete day", async () => {
    await render(<GardenCalendar days={days} month={8} year={2026} />);

    expect(screen.getByLabelText("August 4. Rosary not completed.")).toBeTruthy();
  });

  it("should navigate to the previous month", async () => {
    await render(<RosaryGardenScreen />);
    await fireEvent.press(screen.getByTestId("garden-previous-month"));

    expect(goToPreviousMonth).toHaveBeenCalledTimes(1);
  });
});
