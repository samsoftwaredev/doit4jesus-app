import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { EarnedBadgesSection } from "./EarnedBadgesSection";

const mockFetchBadgeCatalog = jest.fn();

jest.mock("./progress.api", () => ({
  fetchBadgeCatalog: (...args: unknown[]) => mockFetchBadgeCatalog(...args),
}));

function makeBadge(name: string, code: string, earnedAt: string | null) {
  return {
    category: "prayer",
    code,
    description: `${name} description`,
    earned: earnedAt ? [{ earnedAt, id: `earned-${code}` }] : [],
    iconUrl: null,
    id: `definition-${code}`,
    isRepeatable: false,
    name,
    pointsReward: 25,
    progress: null,
    rarity: "common",
    requirementValue: 1,
    requirements: [],
  };
}

const badgeCatalog = [
  makeBadge("Oldest Badge", "OLDEST", "2026-01-01T12:00:00.000Z"),
  makeBadge("First Rosary", "FIRST_ROSARY", "2026-04-01T12:00:00.000Z"),
  makeBadge("Second Badge", "SECOND", "2026-03-01T12:00:00.000Z"),
  makeBadge("Third Badge", "THIRD", "2026-02-01T12:00:00.000Z"),
  makeBadge("Locked Badge", "LOCKED", null),
];

describe("EarnedBadgesSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchBadgeCatalog.mockResolvedValue(badgeCatalog);
  });

  it("renders the three most recent earned badges and opens the complete catalog", async () => {
    await render(<EarnedBadgesSection />);

    expect(screen.getByRole("header", { name: "BADGES" })).toBeTruthy();
    expect(await screen.findByText("First Rosary")).toBeTruthy();
    expect(screen.getByText("Second Badge")).toBeTruthy();
    expect(screen.getByText("Third Badge")).toBeTruthy();
    expect(screen.queryByText("Oldest Badge")).toBeNull();
    expect(screen.queryByText("Locked Badge")).toBeNull();
    expect(screen.getByLabelText(/Badge earned: First Rosary/)).toBeTruthy();
    expect(screen.getByTestId("badge-artwork-earned-FIRST_ROSARY")).toBeTruthy();

    await act(async () => fireEvent.press(screen.getByRole("button", { name: "View All Badges" })));
    expect(await screen.findByRole("header", { name: "All Badges" })).toBeTruthy();
    expect(screen.getByText("Oldest Badge")).toBeTruthy();
    expect(screen.getByText("Locked Badge")).toBeTruthy();
  });

  it("shows three accessible placeholders while badges load", async () => {
    mockFetchBadgeCatalog.mockReturnValue(new Promise<never>(() => undefined));

    await render(<EarnedBadgesSection />);

    expect(screen.getAllByLabelText("Loading badge")).toHaveLength(3);
  });

  it("shows the compact empty state when no badges have been earned", async () => {
    mockFetchBadgeCatalog.mockResolvedValue([makeBadge("Locked Badge", "LOCKED", null)]);

    await render(<EarnedBadgesSection />);

    expect(await screen.findByText("No badges earned yet.")).toBeTruthy();
    expect(screen.getByText("Complete Rosaries and build your streak to earn your first badge.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "View All Badges" })).toBeTruthy();
  });

  it("shows a recoverable error and retries the badges request", async () => {
    mockFetchBadgeCatalog.mockRejectedValueOnce(new Error("offline"));

    await render(<EarnedBadgesSection />);

    expect(await screen.findByText("We couldn't load your badges.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Try again loading badges" }));
    expect(await screen.findByText("First Rosary")).toBeTruthy();
    expect(mockFetchBadgeCatalog).toHaveBeenCalledTimes(2);
  });
});
