import { fireEvent, render, screen } from "@testing-library/react-native";

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
  beforeEach(() => {
    jest.clearAllMocks();
    mockSuccessfulRequests();
  });

  it("renders the two Rosary streak statistics", async () => {
    await render(<UserProgressSection />);

    expect(await screen.findByLabelText("STREAK, 14 days")).toBeTruthy();
    expect(screen.getByLabelText("LONGEST STREAK, 27 days")).toBeTruthy();
  });

  it("retries failed progress requests", async () => {
    mockFetchRosaryStreak.mockRejectedValueOnce(new Error("offline"));

    await render(<UserProgressSection />);
    await fireEvent.press(await screen.findByRole("button", { name: "Try again" }));
    expect(await screen.findByLabelText("STREAK, 14 days")).toBeTruthy();
    expect(mockFetchRosaryStreak).toHaveBeenCalledTimes(2);
  });
});
