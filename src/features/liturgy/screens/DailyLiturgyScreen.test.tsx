import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { DailyLiturgyDashboard } from "./DailyLiturgyScreen";

let mockCurrentLocalDate = "2026-08-21";
let mockLocale = "en-US";
const mockQueueAchievement = jest.fn();

jest.mock("expo-router", () => ({
  useFocusEffect: jest.fn((cb: () => void) => cb()),
  useRouter: () => ({ back: jest.fn(), navigate: jest.fn(), push: jest.fn() }),
}));

jest.mock("@/features/liturgy", () => ({
  fetchLiturgyReadings: jest.fn(),
  fetchTodayLiturgy: jest.fn(),
  loadDailyReadingProgress: jest.fn(),
  markDailyReadingComplete: jest.fn(),
  recordDailyScriptureCompletion: jest.fn(),
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

jest.mock("@/hooks", () => ({
  useCurrentLocalDate: () => mockCurrentLocalDate,
}));

jest.mock("@/localization", () => ({
  useAppLanguage: () => ({ locale: mockLocale }),
}));

jest.mock("@/features/achievements", () => ({
  useAchievement: () => ({ queueAchievement: mockQueueAchievement }),
}));

const {
  fetchLiturgyReadings,
  fetchTodayLiturgy,
  loadDailyReadingProgress,
  markDailyReadingComplete,
  recordDailyScriptureCompletion,
} = jest.requireMock("@/features/liturgy") as {
  fetchLiturgyReadings: jest.Mock;
  fetchTodayLiturgy: jest.Mock;
  loadDailyReadingProgress: jest.Mock;
  markDailyReadingComplete: jest.Mock;
  recordDailyScriptureCompletion: jest.Mock;
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
  completion: { completed: false, completedAt: null },
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
    mockCurrentLocalDate = "2026-08-21";
    mockLocale = "en-US";
    fetchLiturgyReadings.mockResolvedValue(liturgy);
    fetchTodayLiturgy.mockResolvedValue(liturgy);
    loadDailyReadingProgress.mockResolvedValue(emptyProgress);
  });

  it("uses the today endpoint for today and the dated endpoint when browsing", async () => {
    fetchLiturgyReadings.mockImplementation((date: string) => Promise.resolve({ ...liturgy, date }));
    const view = await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(fetchTodayLiturgy).toHaveBeenCalledWith("en-US"));

    await fireEvent.press(screen.getByLabelText("Show the previous day's liturgy"));
    await waitFor(() => expect(fetchLiturgyReadings).toHaveBeenLastCalledWith("2026-08-20", "en-US"));

    mockCurrentLocalDate = "2026-08-22";
    fetchTodayLiturgy.mockResolvedValue({ ...liturgy, date: "2026-08-22" });
    await view.rerender(<DailyLiturgyDashboard />);

    await waitFor(() => expect(fetchTodayLiturgy).toHaveBeenLastCalledWith("en-US"));
    expect(loadDailyReadingProgress).toHaveBeenLastCalledWith("2026-08-22", "US");
  });

  it("reloads the displayed day with the selected locale", async () => {
    const view = await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(fetchTodayLiturgy).toHaveBeenCalledWith("en-US"));

    mockLocale = "es-419";
    await view.rerender(<DailyLiturgyDashboard />);

    await waitFor(() => expect(fetchTodayLiturgy).toHaveBeenLastCalledWith("es-419"));
  });

  it("ignores a previous day's response when it finishes after the new day's request", async () => {
    let resolvePreviousDay: (value: typeof liturgy) => void = () => undefined;
    const previousDayRequest = new Promise<typeof liturgy>((resolve) => {
      resolvePreviousDay = resolve;
    });
    const nextLiturgy = {
      ...liturgy,
      celebration: { ...liturgy.celebration, name: "Memorial of the Queenship of Mary" },
      date: "2026-08-22",
    };
    fetchTodayLiturgy.mockImplementationOnce(() => previousDayRequest).mockResolvedValueOnce(nextLiturgy);
    const view = await render(<DailyLiturgyDashboard />);

    mockCurrentLocalDate = "2026-08-22";
    await view.rerender(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByText("Memorial of the Queenship of Mary")).toBeTruthy());

    await act(async () => {
      resolvePreviousDay(liturgy);
      await previousDayRequest;
    });

    expect(screen.getByText("Memorial of the Queenship of Mary")).toBeTruthy();
    expect(screen.queryByText("Memorial of Saint Pius X, Pope")).toBeNull();
  });

  it("shows a loading skeleton while fetching", async () => {
    fetchTodayLiturgy.mockImplementation(() => new Promise(() => undefined));
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
    fetchTodayLiturgy.mockRejectedValue(new Error("Network error"));
    await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByText("Unable to load this day's liturgy.")).toBeTruthy());
    expect(screen.getByText("Retry")).toBeTruthy();
  });

  it("retries fetching when the Retry button is pressed", async () => {
    fetchTodayLiturgy.mockRejectedValueOnce(new Error("first failure")).mockResolvedValue(liturgy);
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
    await waitFor(() => expect(fetchLiturgyReadings).toHaveBeenCalledTimes(1));
  });

  it("records the liturgy completion only after the final reading is marked", async () => {
    const randomUUID = jest.spyOn(crypto, "randomUUID").mockReturnValue("00000000-0000-4000-8000-000000000000");
    const afterProgress = {
      completedReadingIds: ["first-reading", "gospel"],
      country: "US",
      date: "2026-08-21",
    };
    markDailyReadingComplete.mockResolvedValue({
      allReadingsCompleted: true,
      didCompleteAllReadings: true,
      progress: afterProgress,
    });
    recordDailyScriptureCompletion.mockResolvedValue({ completed: true, completedAt: "2026-08-21T21:22:25.672Z" });
    loadDailyReadingProgress.mockResolvedValue({
      completedReadingIds: ["first-reading"],
      country: "US",
      date: "2026-08-21",
    });
    await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByText("Mt 22:34-40")).toBeTruthy());

    const toggle = screen.getByLabelText("Expand GOSPEL, Mt 22:34-40");
    await fireEvent.press(toggle);

    const scrollView = screen.getByLabelText("GOSPEL, Mt 22:34-40, Scripture text");
    await fireEvent(scrollView, "layout", { nativeEvent: { layout: { height: 300 } } });
    await fireEvent(scrollView, "contentSizeChange", 0, 300);

    await act(async () => {
      await fireEvent.press(screen.getByText("Mark as Read"));
    });

    await waitFor(() =>
      expect(recordDailyScriptureCompletion).toHaveBeenCalledWith(
        expect.objectContaining({ idempotencyKey: "00000000-0000-4000-8000-000000000000", readingDate: "2026-08-21" }),
      ),
    );
    expect(screen.getByText("2 of 2 completed")).toBeTruthy();
    expect(mockQueueAchievement).toHaveBeenCalledWith({ type: "daily-scripture-complete" });
    randomUUID.mockRestore();
  });

  it("shows all readings as completed when the liturgy response is already completed", async () => {
    fetchTodayLiturgy.mockResolvedValue({
      ...liturgy,
      completion: { completed: true, completedAt: "2026-08-21T21:22:25.672Z" },
    });

    await render(<DailyLiturgyDashboard />);

    await waitFor(() => expect(screen.getByText("2 of 2 completed")).toBeTruthy());
  });

  it("marks the final reading complete when the completion endpoint replays a prior request", async () => {
    markDailyReadingComplete.mockResolvedValue({
      allReadingsCompleted: true,
      didCompleteAllReadings: true,
      progress: { completedReadingIds: ["first-reading", "gospel"], country: "US", date: "2026-08-21" },
    });
    recordDailyScriptureCompletion.mockResolvedValue({ completed: true, completedAt: null });
    loadDailyReadingProgress.mockResolvedValue({
      completedReadingIds: ["first-reading"],
      country: "US",
      date: "2026-08-21",
    });
    await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByText("Mt 22:34-40")).toBeTruthy());

    await fireEvent.press(screen.getByLabelText("Expand GOSPEL, Mt 22:34-40"));
    const scrollView = screen.getByLabelText("GOSPEL, Mt 22:34-40, Scripture text");
    await fireEvent(scrollView, "layout", { nativeEvent: { layout: { height: 300 } } });
    await fireEvent(scrollView, "contentSizeChange", 0, 300);
    await fireEvent.press(screen.getByText("Mark as Read"));

    await waitFor(() => expect(screen.getByText("2 of 2 completed")).toBeTruthy());
  });

  it("keeps the final reading incomplete and displays a retryable error when completion fails", async () => {
    markDailyReadingComplete.mockResolvedValue({
      allReadingsCompleted: true,
      didCompleteAllReadings: true,
      progress: { completedReadingIds: ["first-reading", "gospel"], country: "US", date: "2026-08-21" },
    });
    recordDailyScriptureCompletion.mockRejectedValue(new Error("Network error"));
    loadDailyReadingProgress.mockResolvedValue({
      completedReadingIds: ["first-reading"],
      country: "US",
      date: "2026-08-21",
    });
    await render(<DailyLiturgyDashboard />);
    await waitFor(() => expect(screen.getByText("Mt 22:34-40")).toBeTruthy());

    await fireEvent.press(screen.getByLabelText("Expand GOSPEL, Mt 22:34-40"));
    const scrollView = screen.getByLabelText("GOSPEL, Mt 22:34-40, Scripture text");
    await fireEvent(scrollView, "layout", { nativeEvent: { layout: { height: 300 } } });
    await fireEvent(scrollView, "contentSizeChange", 0, 300);
    await fireEvent.press(screen.getByText("Mark as Read"));

    expect(await screen.findByRole("alert")).toHaveTextContent("Your reading could not be saved. Please try again.");
    expect(screen.getByText("1 of 2 completed")).toBeTruthy();
    expect(mockQueueAchievement).not.toHaveBeenCalled();
  });
});
