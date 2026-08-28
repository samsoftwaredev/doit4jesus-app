import { fireEvent, render, screen } from "@testing-library/react-native";

import { RosaryGardenScreen } from "./RosaryGardenScreen";

const goToNextMonth = jest.fn();
const goToPreviousMonth = jest.fn();

jest.mock("@/features/prayer/rosary/garden/useRosaryGarden", () => ({ useRosaryGarden: jest.fn() }));

const { useRosaryGarden } = jest.requireMock("@/features/prayer/rosary/garden/useRosaryGarden") as {
  useRosaryGarden: jest.Mock;
};

const days = Array.from({ length: 31 }, (_, index) => {
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

  it("should navigate to the previous month", async () => {
    await render(<RosaryGardenScreen />);
    await fireEvent.press(screen.getByTestId("garden-previous-month"));

    expect(goToPreviousMonth).toHaveBeenCalledTimes(1);
  });
});
