import { fireEvent, render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";
import { UserProgressSection } from "./UserProgressSection";

const mockPush = jest.fn();
const mockFetchRosaryStreak = jest.fn();
const mockFetchRosaryStats = jest.fn();
const mockFetchUserProgress = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/features/prayer/rosary/garden/api", () => ({
  fetchRosaryStreak: (...args: unknown[]) => mockFetchRosaryStreak(...args),
}));

jest.mock("./progress.api", () => ({
  fetchRosaryStats: (...args: unknown[]) => mockFetchRosaryStats(...args),
  fetchUserProgress: (...args: unknown[]) => mockFetchUserProgress(...args),
}));

function mockSuccessfulRequests() {
  mockFetchRosaryStreak.mockResolvedValue({ currentStreak: 14, longestStreak: 27 });
  mockFetchRosaryStats.mockResolvedValue({ rosariesPrayed: 25 });
  mockFetchUserProgress.mockResolvedValue({ lifetimePoints: 4320 });
}

describe("UserProgressSection", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockSuccessfulRequests();
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders only the Rosary streak statistics without duplicated inspiration content", async () => {
    await render(<UserProgressSection />);

    expect(await screen.findByLabelText("STREAK, 14 days")).toBeTruthy();
    expect(screen.getByLabelText("LONGEST STREAK, 27 days")).toBeTruthy();
    expect(screen.queryByText("Plant Today’s Flower")).toBeNull();
    expect(screen.queryByLabelText("Devotional quote from Our Lady of Fatima")).toBeNull();
  });

  it("keeps streak placeholders available while progress is loading", async () => {
    mockFetchRosaryStreak.mockReturnValueOnce(new Promise(() => undefined));
    await render(<UserProgressSection />);

    expect(screen.getAllByLabelText("Loading streak statistic")).toHaveLength(2);
  });

  it("retries failed progress requests", async () => {
    mockFetchRosaryStreak.mockRejectedValueOnce(new Error("offline"));

    await render(<UserProgressSection />);
    await fireEvent.press(await screen.findByRole("button", { name: "Try again" }));
    expect(await screen.findByLabelText("STREAK, 14 days")).toBeTruthy();
    expect(mockFetchRosaryStreak).toHaveBeenCalledTimes(2);
  });

  it("retains localized Spanish streak content", async () => {
    await i18n.changeLanguage("es");
    await render(<UserProgressSection />);

    expect(await screen.findByLabelText("RACHA, 14 días")).toBeTruthy();
    expect(screen.getByLabelText("RACHA MÁS LARGA, 27 días")).toBeTruthy();
  });
});
