import { render, screen } from "@testing-library/react-native";

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
});
