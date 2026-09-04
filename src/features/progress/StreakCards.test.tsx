import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ["narrow phone", 320, false, 1, "column"],
    ["typical phone", 390, false, 1, "column"],
    ["tablet", 768, true, 1, "row"],
    ["desktop", 1024, true, 1, "row"],
    ["large-text tablet", 768, true, 1.6, "row"],
  ] as const)("lays out the cards in a %s viewport", async (_name, width, isTablet, fontScale, direction) => {
    setViewport(width, isTablet, fontScale);

    await render(<StreakCards currentStreak={14} longestStreak={27} />);

    expect(StyleSheet.flatten(screen.getByTestId("streak-cards-layout").props.style)).toEqual(
      expect.objectContaining({ flexDirection: direction }),
    );
    expect(screen.getByLabelText("STREAK, 14 days")).toBeTruthy();
    expect(screen.getByLabelText("LONGEST STREAK, 27 days")).toBeTruthy();
  });

  it("renders exactly two responsive placeholders while streaks load", async () => {
    setViewport(390, false);

    await render(<StreakCards isLoading />);

    expect(screen.getAllByLabelText("Loading streak statistic")).toHaveLength(2);
  });
});
