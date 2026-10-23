import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { rosaryMysteries } from "@/features/prayer/rosary/data/rosaryMysteries";

import { PrayerCard } from "./PrayerCard";

describe("PrayerCard", () => {
  it("renders an empty-data fallback when no prayer text is available", async () => {
    await render(<PrayerCard />);

    expect(screen.getByLabelText("Prayer text unavailable")).toBeTruthy();
  });

  it("preserves a configured prayer name when its text is empty", async () => {
    await render(<PrayerCard prayer={{ ...rosaryMysteries[0].prayers[1], text: "" }} />);

    expect(screen.getByText("HAIL MARY")).toBeTruthy();
    expect(screen.getByLabelText("Prayer text unavailable")).toBeTruthy();
  });

  it("uses a generic accessibility name for incomplete prayer data", async () => {
    await render(
      <PrayerCard
        prayer={{
          beadType: "hailMary",
          id: "partial-prayer",
          name: undefined as unknown as string,
          text: "A short prayer.",
        }}
      />,
    );

    expect(screen.getByLabelText("Prayer text")).toBeTruthy();
  });

  it("renders the complete prayer at natural height without a nested scroll view", async () => {
    const longPrayer = Array.from({ length: 20 }, (_, index) => `Prayer line ${index + 1}.`).join(" ");

    await render(
      <PrayerCard
        prayer={{
          ...rosaryMysteries[0].prayers[1],
          text: longPrayer,
        }}
      />,
    );

    const prayerText = screen.getByLabelText("Hail Mary text");
    expect(prayerText.props.scrollEnabled).toBeUndefined();
    expect(prayerText.props.contentContainerStyle).toBeUndefined();
    expect(StyleSheet.flatten(prayerText.props.style)).not.toHaveProperty("maxHeight");
    expect(screen.getByText(longPrayer)).toBeTruthy();
  });
});
