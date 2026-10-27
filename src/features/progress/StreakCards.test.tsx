import { render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { StreakCards } from "./StreakCards";

const mockResponsiveLayout = jest.fn();

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
}));

function setViewport(width: number, isTablet: boolean, fontScale = 1) {
  mockResponsiveLayout.mockReturnValue({
    contentWidth: width,
    fontScale,
    gutter: 16,
    height: width >= 768 ? 1024 : 844,
    isDesktop: width >= 1024,
    isLandscape: false,
    isLargeText: fontScale >= 1.3,
    isNarrowPhone: width < 360,
    isTablet,
    size: width >= 1024 ? "desktop" : isTablet ? "tablet" : "phone",
    width,
  });
}

describe("StreakCards", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders the streak cards correctly", async () => {
    await render(<StreakCards currentStreak={14} longestStreak={27} />);

    expect(screen.getByText("Only one Rosary per day counts toward your daily streak.")).toBeTruthy();
    expect(screen.getByLabelText("STREAK, 14 days")).toBeTruthy();
    expect(screen.getByLabelText("LONGEST STREAK, 27 days")).toBeTruthy();
  });

  it("renders exactly two responsive placeholders while streaks load", async () => {
    setViewport(390, false);

    await render(<StreakCards isLoading />);

    expect(screen.getByText("Only one Rosary per day counts toward your daily streak.")).toBeTruthy();
    expect(screen.getAllByLabelText("Loading streak statistic")).toHaveLength(2);
  });

  it("renders the daily streak explanation in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(<StreakCards currentStreak={14} longestStreak={27} />);

    expect(screen.getByText("Solo un Rosario por día cuenta para tu racha diaria.")).toBeTruthy();
  });
});
