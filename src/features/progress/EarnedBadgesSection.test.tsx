import { fireEvent, render, screen } from "@testing-library/react-native";

import { EarnedBadgesSection } from "./EarnedBadgesSection";

const mockFetchEarnedBadges = jest.fn();

jest.mock("./progress.api", () => ({
  fetchEarnedBadges: (...args: unknown[]) => mockFetchEarnedBadges(...args),
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

describe("EarnedBadgesSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchEarnedBadges.mockResolvedValue(earnedBadges);
  });

  it("renders the complete earned-badges section", async () => {
    await render(<EarnedBadgesSection />);

    expect(screen.getByRole("header", { name: "ALL BADGES EARNED" })).toBeTruthy();
    expect(await screen.findByText("First Rosary")).toBeTruthy();
    expect(screen.getByText("Devoted")).toBeTruthy();
    expect(screen.getByText("Prayed your first rosary.")).toBeTruthy();
    expect(screen.getByText("Prayed 25 rosaries.")).toBeTruthy();
    expect(screen.getByLabelText(/Badge earned: First Rosary/)).toBeTruthy();
    expect(screen.getByLabelText(/Badge earned: Devoted/)).toBeTruthy();
  });

  it("shows three accessible placeholders while badges load", async () => {
    mockFetchEarnedBadges.mockReturnValue(new Promise<never>(() => undefined));

    await render(<EarnedBadgesSection />);

    expect(screen.getAllByLabelText("Loading badge")).toHaveLength(3);
  });

  it("shows the compact empty state when no badges have been earned", async () => {
    mockFetchEarnedBadges.mockResolvedValue([]);

    await render(<EarnedBadgesSection />);

    expect(await screen.findByText("No badges earned yet.")).toBeTruthy();
    expect(screen.getByText("Complete Rosaries and build your streak to earn your first badge.")).toBeTruthy();
  });

  it("shows a recoverable error and retries the badges request", async () => {
    mockFetchEarnedBadges.mockRejectedValueOnce(new Error("offline"));

    await render(<EarnedBadgesSection />);

    expect(await screen.findByText("We couldn't load your badges.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Try again loading badges" }));
    expect(await screen.findByText("First Rosary")).toBeTruthy();
    expect(mockFetchEarnedBadges).toHaveBeenCalledTimes(2);
  });
});
