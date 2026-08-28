import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { DailyLiturgyDashboard } from "./DailyLiturgyScreen";

jest.mock("expo-router", () => ({
  useFocusEffect: jest.fn((cb: () => void) => cb()),
  useRouter: () => ({ back: jest.fn(), navigate: jest.fn(), push: jest.fn() }),
}));

jest.mock("@/features/liturgy", () => ({
  fetchLiturgyReadings: jest.fn(),
  fetchTodayLiturgy: jest.fn(),
  loadDailyReadingProgress: jest.fn(),
  markCompletionToastShown: jest.fn(),
  markDailyReadingComplete: jest.fn(),
  recordDailyScriptureCompletion: jest.fn(),
  recordRewardOnProgress: jest.fn(),
}));

jest.mock("@/features/liturgy/liturgy.dates", () => ({
  addDaysToIsoDate: jest.fn((date: string, amount: number) => {
    const [y, m, d] = date.split("-").map(Number);
    const next = new Date(Date.UTC(y, m - 1, d + amount));
    return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
  }),
  canNavigateToNextLiturgyDate: jest.fn(() => true),
  getLocalIsoDate: jest.fn(() => "2026-08-21"),
}));

const { fetchLiturgyReadings, loadDailyReadingProgress, markDailyReadingComplete } = jest.requireMock(
  "@/features/liturgy",
) as {
  fetchLiturgyReadings: jest.Mock;
  loadDailyReadingProgress: jest.Mock;
  markDailyReadingComplete: jest.Mock;
};

const liturgy = {
  celebration: {
    grade: "MEMORIAL",
    id: "saint-pius-x",
    liturgicalColor: "WHITE",
    name: "Memorial of Saint Pius X, Pope",
    season: "ORDINARY_TIME",
  },
  date: "2026-08-21",
  metadata: { country: "US", psalterWeek: 4, sundayCycle: "A", weekdayCycle: "II" },
  readings: [
    { citation: "Ez 37:1-14", id: "first-reading", text: "Dry bones, hear the word.", type: "FIRST_READING" },
    { citation: "Mt 22:34-40", id: "gospel", text: "You shall love the Lord.", type: "GOSPEL" },
  ],
  highlightedVerse: { citation: "Mt 22:37", text: "You shall love the Lord your God." },
};

const emptyProgress = { completedReadingIds: [], country: "US", date: "2026-08-21" };

describe("DailyLiturgyDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchLiturgyReadings.mockResolvedValue(liturgy);
    loadDailyReadingProgress.mockResolvedValue(emptyProgress);
  });

  it("shows a loading skeleton while fetching", async () => {
    fetchLiturgyReadings.mockImplementation(() => new Promise(() => undefined));
    await render(<DailyLiturgyDashboard />);
    expect(screen.getByLabelText("Loading daily liturgy")).toBeTruthy();
  });

  it("renders the celebration name after loading", async () => {
    await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByText("Memorial of Saint Pius X, Pope")).toBeTruthy());
  });

  it("renders the Daily Mass header with the correct date", async () => {
    await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByText("Daily Mass")).toBeTruthy());
    expect(screen.getByText("Friday, August 21, 2026")).toBeTruthy();
  });

  it("shows readings in the ScriptureReadingsCard", async () => {
    await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByText("Today's Scripture Readings")).toBeTruthy());
    expect(screen.getByText("Ez 37:1-14")).toBeTruthy();
  });

  it("renders the highlighted verse card", async () => {
    await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByText("You shall love the Lord your God.")).toBeTruthy());
  });

  it("shows an error state and a Retry button when loading fails", async () => {
    fetchLiturgyReadings.mockRejectedValue(new Error("Network error"));
    await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByText("Unable to load this day's liturgy.")).toBeTruthy());
    expect(screen.getByText("Retry")).toBeTruthy();
  });

  it("retries fetching when the Retry button is pressed", async () => {
    fetchLiturgyReadings.mockRejectedValueOnce(new Error("first failure")).mockResolvedValue(liturgy);
    await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByText("Retry")).toBeTruthy());

    await act(async () => {
      await fireEvent.press(screen.getByText("Retry"));
    });

    await waitFor(() => expect(screen.getByText("Memorial of Saint Pius X, Pope")).toBeTruthy());
  });

  it("calls onCalendarPress when the calendar button is pressed", async () => {
    const onCalendarPress = jest.fn();
    await render(<DailyLiturgyDashboard onCalendarPress={onCalendarPress} />);
    await waitFor(() => expect(screen.getByText("Daily Mass")).toBeTruthy());
    await fireEvent.press(screen.getByLabelText("Select a Mass date"));
    expect(onCalendarPress).toHaveBeenCalledTimes(1);
  });

  it("navigates to the next day when Next button is pressed", async () => {
    await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByLabelText("Show the next day's liturgy")).toBeTruthy());
    await act(async () => {
      await fireEvent.press(screen.getByLabelText("Show the next day's liturgy"));
    });
    await waitFor(() => expect(fetchLiturgyReadings).toHaveBeenCalledTimes(2));
  });

  it("marks a reading as complete and updates progress", async () => {
    const afterProgress = { completedReadingIds: ["first-reading"], country: "US", date: "2026-08-21" };
    markDailyReadingComplete.mockResolvedValue({
      allReadingsCompleted: false,
      didCompleteAllReadings: false,
      progress: afterProgress,
    });
    await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByText("Ez 37:1-14")).toBeTruthy());

    const toggle = screen.getByLabelText("Expand FIRST READING, Ez 37:1-14");
    await fireEvent.press(toggle);

    const scrollView = screen.getByLabelText("FIRST READING, Ez 37:1-14, Scripture text");
    await fireEvent(scrollView, "layout", { nativeEvent: { layout: { height: 300 } } });
    await fireEvent(scrollView, "contentSizeChange", 0, 300);

    await act(async () => {
      await fireEvent.press(screen.getByText("Mark as Read"));
    });

    expect(markDailyReadingComplete).toHaveBeenCalledWith(expect.objectContaining({ readingId: "first-reading" }));
  });
});
