import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useRosaryGarden } from "./useRosaryGarden";

jest.mock("@/features/prayer/rosary/garden/api", () => ({
  fetchRosaryCompletion: jest.fn(),
  fetchRosaryStreak: jest.fn(),
}));

jest.mock("@/features/profile/profile.api", () => ({
  fetchCurrentUserProfile: jest.fn(),
}));

const { fetchRosaryCompletion, fetchRosaryStreak } = jest.requireMock("@/features/prayer/rosary/garden/api") as {
  fetchRosaryCompletion: jest.Mock;
  fetchRosaryStreak: jest.Mock;
};

const { fetchCurrentUserProfile } = jest.requireMock("@/features/profile/profile.api") as {
  fetchCurrentUserProfile: jest.Mock;
};

const baseProfile = {
  createdAt: "2026-01-01",
  timezone: "America/New_York",
};

function makeCompletion(year: number, month: number, completedDays: string[] = []) {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return {
    completedDays: completedDays.length,
    days: Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return { completed: completedDays.includes(date), date, day };
    }),
    eligibleDays: daysInMonth,
    selectedMonth: month,
    year,
    yearToDatePercentage: 0,
  };
}

const baseStreak = {
  asOfDate: "2026-08-21",
  currentStreak: 3,
  longestStreak: 10,
  timezone: "America/New_York",
};

describe("useRosaryGarden", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-08-21T12:00:00.000Z"));
    jest.clearAllMocks();
    fetchCurrentUserProfile.mockResolvedValue(baseProfile);
    fetchRosaryCompletion.mockResolvedValue(makeCompletion(2026, 8, ["2026-08-19", "2026-08-20", "2026-08-21"]));
    fetchRosaryStreak.mockResolvedValue(baseStreak);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts in a loading state", async () => {
    fetchRosaryCompletion.mockImplementation(() => new Promise(() => undefined));
    const { result } = await renderHook(() => useRosaryGarden({ userTimezone: "UTC" }));
    expect(result.current.isLoading).toBe(true);
  });

  it("resolves to not loading after data is fetched", async () => {
    const { result } = await renderHook(() =>
      useRosaryGarden({ selectedYear: 2026, selectedMonth: 8, userTimezone: "UTC" }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isUsingMockData).toBe(false);
  });

  it("exposes remote streaks after successful fetch", async () => {
    const { result } = await renderHook(() =>
      useRosaryGarden({ selectedYear: 2026, selectedMonth: 8, userTimezone: "UTC" }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.stats.currentStreak).toBe(3);
    expect(result.current.stats.longestStreak).toBe(10);
  });

  it("falls back to mock data when the API fails", async () => {
    fetchRosaryCompletion.mockRejectedValue(new Error("Network error"));
    fetchCurrentUserProfile.mockRejectedValue(new Error("Network error"));
    fetchRosaryStreak.mockRejectedValue(new Error("Network error"));
    const { result } = await renderHook(() =>
      useRosaryGarden({ selectedYear: 2026, selectedMonth: 8, userTimezone: "UTC" }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isUsingMockData).toBe(true);
  });

  it("uses provided rosaryCompletionDates instead of fetching", async () => {
    const { result } = await renderHook(() =>
      useRosaryGarden({
        rosaryCompletionDates: ["2026-08-01", "2026-08-02"],
        selectedYear: 2026,
        selectedMonth: 8,
        userTimezone: "UTC",
      }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(fetchRosaryCompletion).not.toHaveBeenCalled();
    expect(result.current.stats.completedDays).toBe(2);
  });

  it("navigates to the previous month", async () => {
    const { result } = await renderHook(() =>
      useRosaryGarden({
        selectedYear: 2026,
        selectedMonth: 8,
        userCreatedAt: "2026-01-01",
        userTimezone: "UTC",
      }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.goToPreviousMonth();
    });

    expect(result.current.selectedMonthNumber).toBe(7);
    expect(result.current.selectedYear).toBe(2026);
  });

  it("loads completed days for a navigated month after being seeded with initial screen data", async () => {
    const initialCompletion = makeCompletion(2026, 8, ["2026-08-20"]);
    fetchRosaryCompletion.mockResolvedValueOnce(makeCompletion(2026, 7, ["2026-07-04", "2026-07-14"]));

    const { result } = await renderHook(() =>
      useRosaryGarden({
        initialCompletion,
        initialStreak: baseStreak,
        initialUser: baseProfile,
        selectedYear: 2026,
        selectedMonth: 8,
        userTimezone: "UTC",
      }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.goToPreviousMonth();
    });

    await waitFor(() => expect(result.current.selectedMonthNumber).toBe(7));
    expect(fetchRosaryCompletion).toHaveBeenCalledWith(2026, 7);
    expect(result.current.stats.completedDays).toBe(2);
    expect(result.current.days.find((day) => day.date === "2026-07-04")?.completed).toBe(true);
  });

  it("retains the displayed month and retries when a navigated month cannot load", async () => {
    fetchRosaryCompletion.mockRejectedValueOnce(new Error("Network error"));
    const initialCompletion = makeCompletion(2026, 8, ["2026-08-20"]);
    const { result } = await renderHook(() =>
      useRosaryGarden({
        initialCompletion,
        initialStreak: baseStreak,
        initialUser: baseProfile,
        selectedYear: 2026,
        selectedMonth: 8,
        userTimezone: "UTC",
      }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.goToPreviousMonth();
    });
    await waitFor(() => expect(result.current.hasNavigationError).toBe(true));

    expect(result.current.selectedMonthNumber).toBe(8);
    expect(result.current.days.find((day) => day.date === "2026-08-20")?.completed).toBe(true);

    fetchRosaryCompletion.mockResolvedValueOnce(makeCompletion(2026, 7, ["2026-07-04"]));
    await act(async () => {
      result.current.retryMonthLoad();
    });

    await waitFor(() => expect(result.current.selectedMonthNumber).toBe(7));
    expect(result.current.hasNavigationError).toBe(false);
  });

  it("does not navigate past the month the user was created", async () => {
    fetchCurrentUserProfile.mockResolvedValue({ ...baseProfile, createdAt: "2026-08-01" });
    const { result } = await renderHook(() =>
      useRosaryGarden({
        selectedYear: 2026,
        selectedMonth: 8,
        userCreatedAt: "2026-08-01",
        userTimezone: "UTC",
      }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.canGoPrevious).toBe(false);
    await act(async () => {
      result.current.goToPreviousMonth();
    });
    expect(result.current.selectedMonthNumber).toBe(8);
  });

  it("updates completionDates when markTodayCompleted is called", async () => {
    const today = "2026-08-21";
    const { result } = await renderHook(() =>
      useRosaryGarden({
        rosaryCompletionDates: [],
        selectedYear: 2026,
        selectedMonth: 8,
        userTimezone: "UTC",
      }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.stats.completedDays).toBe(0);
    await act(async () => {
      result.current.markTodayCompleted();
    });

    const todayEntry = result.current.days.find((d) => d.date === today);
    expect(todayEntry?.completed).toBe(true);
  });

  it("exposes days array with isToday, isFuture, isEligible flags", async () => {
    const { result } = await renderHook(() =>
      useRosaryGarden({
        rosaryCompletionDates: ["2026-08-20"],
        selectedYear: 2026,
        selectedMonth: 8,
        userTimezone: "UTC",
      }),
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const completed = result.current.days.find((d) => d.date === "2026-08-20");
    expect(completed?.completed).toBe(true);
    expect(completed?.isFuture).toBe(false);
  });
});
