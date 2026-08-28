import { fireEvent, render, screen } from "@testing-library/react-native";

import { PrayerIntentionCard } from "./PrayerIntentionCard";

import type { ApprovedPrayerIntention } from "@/features/prayer/intentions/data/prayerIntentions.types";

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

describe("PrayerIntentionCard", () => {
  it("renders the intention title", async () => {
    await render(<PrayerIntentionCard intention={intention} onPress={jest.fn()} />);
    expect(screen.getByText("Praying for Recovery")).toBeTruthy();
  });

  it("renders the description", async () => {
    await render(<PrayerIntentionCard intention={intention} onPress={jest.fn()} />);
    expect(screen.getByText("Please pray for healing and strength.")).toBeTruthy();
  });

  it("renders the creator display name", async () => {
    await render(<PrayerIntentionCard intention={intention} onPress={jest.fn()} />);
    expect(screen.getByText("John Paul")).toBeTruthy();
  });

  it("has an accessibility label combining creator and title", async () => {
    await render(<PrayerIntentionCard intention={intention} onPress={jest.fn()} />);
    expect(screen.getByLabelText("Open prayer intention from John Paul: Praying for Recovery")).toBeTruthy();
  });

  it("calls onPress when tapped", async () => {
    const onPress = jest.fn();
    await render(<PrayerIntentionCard intention={intention} onPress={onPress} />);
    await fireEvent.press(screen.getByLabelText("Open prayer intention from John Paul: Praying for Recovery"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("uses the fallback theme for unknown symbols", async () => {
    await render(<PrayerIntentionCard intention={{ ...intention, symbol: "unknown_symbol" }} onPress={jest.fn()} />);
    // The fallback theme renders the card without crashing
    expect(screen.getByText("Praying for Recovery")).toBeTruthy();
  });
});
