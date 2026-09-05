import { fireEvent, render, screen, within } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import type { ApprovedPrayerIntention } from "@/features/prayer/intentions";
import { theme } from "@/theme/tokens";

import { PrayersByOthers } from "./PrayersByOthers";

const mockResponsiveLayout = jest.fn();

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
}));

function setResponsiveLayout(isLargeText = false) {
  mockResponsiveLayout.mockReturnValue({
    contentWidth: 390,
    fontScale: isLargeText ? 1.6 : 1,
    gutter: 16,
    height: 844,
    isDesktop: false,
    isLandscape: false,
    isLargeText,
    isNarrowPhone: false,
    isTablet: false,
    size: "phone",
    width: 390,
  });
}

const intention: ApprovedPrayerIntention = {
  approvedAt: "2026-08-01T00:00:00.000Z",
  createdAt: "2026-07-28T00:00:00.000Z",
  creator: { avatarUrl: null, countryCode: "US", displayName: "John Paul" },
  description: "Please pray for healing and strength.",
  expiresAt: "2026-09-01T00:00:00.000Z",
  id: "intention-1",
  symbol: "candle",
  title: "Praying for Recovery",
};

const defaultProps = {
  errorMessage: undefined,
  hasMore: true,
  intentions: [intention],
  isLoading: false,
  isLoadingMore: false,
  onCreateIntention: jest.fn(),
  onLoadMore: jest.fn(),
  onOpenIntention: jest.fn(),
  onOpenMyIntentions: jest.fn(),
  onRetry: jest.fn(),
  onSeeAll: jest.fn(),
};

describe("PrayersByOthers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setResponsiveLayout();
  });

  it("renders intentions and exposes the section actions", async () => {
    await render(<PrayersByOthers {...defaultProps} />);

    expect(screen.getByRole("header", { name: "Prayers by Others" })).toBeTruthy();
    expect(screen.getByText(intention.title)).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("See all prayer intentions"));
    await fireEvent.press(screen.getByLabelText(`Open prayer intention from John Paul: ${intention.title}`));
    await fireEvent.press(screen.getByLabelText("Share an intention"));
    await fireEvent.press(screen.getByLabelText("View my prayer intentions"));

    expect(defaultProps.onSeeAll).toHaveBeenCalledTimes(1);
    expect(defaultProps.onOpenIntention).toHaveBeenCalledWith(intention.id);
    expect(defaultProps.onCreateIntention).toHaveBeenCalledTimes(1);
    expect(defaultProps.onOpenMyIntentions).toHaveBeenCalledTimes(1);
  });

  it("renders the share action as the first carousel card with a large plus sign", async () => {
    await render(<PrayersByOthers {...defaultProps} />);

    const carousel = screen.getByTestId("prayer-intentions-carousel");
    const carouselButtons = within(carousel).getAllByRole("button");

    expect(carouselButtons[0].props.accessibilityLabel).toBe("Share an intention");
    expect(StyleSheet.flatten(screen.getByTestId("share-intention-plus").props.style)).toEqual(
      expect.objectContaining({ fontSize: theme.sizes.iconHero }),
    );
  });

  it("uses horizontal card snapping and requests the next page near the end", async () => {
    await render(<PrayersByOthers {...defaultProps} />);

    const carousel = screen.getByTestId("prayer-intentions-carousel");
    expect(carousel.props.horizontal).toBe(true);
    expect(carousel.props.snapToInterval).toBeGreaterThan(0);

    await fireEvent(carousel, "endReached");

    expect(defaultProps.onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("keeps the share card and snap interval aligned for large text", async () => {
    setResponsiveLayout(true);

    await render(<PrayersByOthers {...defaultProps} />);

    expect(StyleSheet.flatten(screen.getByLabelText("Share an intention").props.style)).toEqual(
      expect.objectContaining({ minHeight: 240, width: 220 }),
    );
    expect(screen.getByTestId("prayer-intentions-carousel").props.snapToInterval).toBe(228);
  });

  it("does not request another page when all intentions are loaded", async () => {
    await render(<PrayersByOthers {...defaultProps} hasMore={false} />);

    await fireEvent(screen.getByTestId("prayer-intentions-carousel"), "endReached");

    expect(defaultProps.onLoadMore).not.toHaveBeenCalled();
  });

  it("shows a loading state", async () => {
    await render(<PrayersByOthers {...defaultProps} intentions={[]} isLoading />);

    expect(screen.getByLabelText("Loading prayer intentions")).toBeTruthy();
  });

  it("shows an error and retries", async () => {
    await render(<PrayersByOthers {...defaultProps} errorMessage="Network unavailable" intentions={[]} />);

    expect(screen.getByRole("alert")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Try Again" }));

    expect(defaultProps.onRetry).toHaveBeenCalledTimes(1);
  });

  it("shows an empty state and lets the user share an intention", async () => {
    await render(<PrayersByOthers {...defaultProps} intentions={[]} />);

    expect(screen.getByText("No prayer intentions yet.")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Share an intention"));

    expect(defaultProps.onCreateIntention).toHaveBeenCalledTimes(1);
  });
});
