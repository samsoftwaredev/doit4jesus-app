import { fireEvent, render, screen } from "@testing-library/react-native";

import { UserProgressSection } from "./UserProgressSection";

const mockPush = jest.fn();
const mockFetchRosaryStreak = jest.fn();
const mockFetchRosaryStats = jest.fn();
const mockFetchUserProgress = jest.fn();
const mockFetchEarnedBadges = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/features/prayer/rosary/garden/api", () => ({
  fetchRosaryStreak: (...args: unknown[]) => mockFetchRosaryStreak(...args),
}));

jest.mock("./progress.api", () => ({
  fetchEarnedBadges: (...args: unknown[]) => mockFetchEarnedBadges(...args),
  fetchRosaryStats: (...args: unknown[]) => mockFetchRosaryStats(...args),
  fetchUserProgress: (...args: unknown[]) => mockFetchUserProgress(...args),
}));

const earnedBadges = [
  {
    code: "FIRST_ROSARY",
    description: "Prayed your first rosary.",
    earnedAt: "2026-01-10T12:00:00.000Z",
    iconUrl: null,
    id: "earned-1",
    name: "First Rosary",
  },
  {
    code: "DEVOTED",
    description: "Prayed 25 rosaries.",
    earnedAt: "2026-02-05T12:00:00.000Z",
    iconUrl: null,
    id: "earned-2",
    name: "Devoted",
  },
];

function mockSuccessfulRequests(badges = earnedBadges) {
  mockFetchRosaryStreak.mockResolvedValue({ currentStreak: 14, longestStreak: 27 });
  mockFetchRosaryStats.mockResolvedValue({ rosariesPrayed: 25 });
  mockFetchUserProgress.mockResolvedValue({ lifetimePoints: 4320 });
  mockFetchEarnedBadges.mockResolvedValue(badges);
}

describe("UserProgressSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSuccessfulRequests();
  });

  it("renders the four user statistics with locale-formatted points", async () => {
    await render(<UserProgressSection />);

    expect(await screen.findByLabelText("STREAK, 14 days")).toBeTruthy();
    expect(screen.getByLabelText("LONGEST STREAK, 27 days")).toBeTruthy();
    expect(screen.getByLabelText("ROSARIES PRAYED, 25 rosaries")).toBeTruthy();
    expect(screen.getByLabelText("POINTS EARNED, 4,320 points")).toBeTruthy();
  });

  it("navigates to the Rosary creation flow from the whole CTA", async () => {
    await render(<UserProgressSection />);

    await fireEvent.press(screen.getByRole("button", { name: "Create a Rosary today" }));

    expect(mockPush).toHaveBeenCalledWith({ pathname: "/rosary", params: { source: "home-progress" } });
  });

  it("renders every earned badge with descriptions and dates", async () => {
    await render(<UserProgressSection />);

    expect(await screen.findByText("First Rosary")).toBeTruthy();
    expect(screen.getByText("Devoted")).toBeTruthy();
    expect(screen.getByText("Prayed your first rosary.")).toBeTruthy();
    expect(screen.getByText("Prayed 25 rosaries.")).toBeTruthy();
    expect(screen.getByLabelText(/Badge earned: First Rosary/)).toBeTruthy();
    expect(screen.getByLabelText(/Badge earned: Devoted/)).toBeTruthy();
  });

  it("keeps the CTA available while progress and badge skeletons are loading", async () => {
    const unresolved = new Promise<never>(() => undefined);
    mockFetchRosaryStreak.mockReturnValue(unresolved);
    mockFetchRosaryStats.mockReturnValue(unresolved);
    mockFetchUserProgress.mockReturnValue(unresolved);
    mockFetchEarnedBadges.mockReturnValue(unresolved);

    await render(<UserProgressSection />);

    expect(screen.getAllByLabelText("Loading progress")).toHaveLength(4);
    expect(screen.getAllByLabelText("Loading badge")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Create a Rosary today" })).toBeTruthy();
  });

  it("shows a recoverable progress error without disabling Rosary creation", async () => {
    mockFetchRosaryStreak.mockRejectedValue(new Error("offline"));

    await render(<UserProgressSection />);

    expect(await screen.findByText("We couldn't load your progress.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create a Rosary today" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
  });

  it("shows the compact empty state when no badges have been earned", async () => {
    mockSuccessfulRequests([]);

    await render(<UserProgressSection />);

    expect(await screen.findByText("No badges earned yet.")).toBeTruthy();
    expect(screen.getByText("Complete Rosaries and build your streak to earn your first badge.")).toBeTruthy();
  });

  it("keeps statistics visible when badges fail to load", async () => {
    mockFetchEarnedBadges.mockRejectedValue(new Error("offline"));

    await render(<UserProgressSection />);

    expect(await screen.findByLabelText("STREAK, 14 days")).toBeTruthy();
    expect(screen.getByText("We couldn't load your badges.")).toBeTruthy();
  });

  it("uses an accessible fallback icon when a badge image is missing", async () => {
    await render(<UserProgressSection />);

    expect(await screen.findByLabelText(/Badge earned: First Rosary/)).toBeTruthy();
  });

  it("retries failed progress requests", async () => {
    mockFetchRosaryStreak.mockRejectedValueOnce(new Error("offline"));

    await render(<UserProgressSection />);
    await fireEvent.press(await screen.findByRole("button", { name: "Try again" }));
    expect(await screen.findByLabelText("STREAK, 14 days")).toBeTruthy();
    expect(mockFetchRosaryStreak).toHaveBeenCalledTimes(2);
  });
});
