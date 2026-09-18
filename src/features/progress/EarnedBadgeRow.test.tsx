import { act, render, screen } from "@testing-library/react-native";

import { EarnedBadgeRow } from "./EarnedBadgeRow";

describe("EarnedBadgeRow", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.example.test";
    process.env.EXPO_PUBLIC_SUPABASE_URL = "https://storage.example.test";
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_API_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
  });

  it("uses a relative backend image URL and formats the earned date", async () => {
    await render(
      <EarnedBadgeRow
        badge={{
          code: "ROSARY_STREAK_7",
          description: "Prayed seven days in a row.",
          earnedAt: "2026-01-10T12:00:00.000Z",
          iconUrl: "/badges/streak.png",
          id: "earned-1",
          name: "Seven Day Streak",
        }}
        isLast
      />,
    );

    expect(screen.getByLabelText(/Badge earned: Seven Day Streak/)).toBeTruthy();
    expect(screen.getByText("Prayed seven days in a row.")).toBeTruthy();
    expect(screen.getByTestId("badge-artwork-earned-1").props.source).toEqual([
      { uri: "https://storage.example.test/badges/streak.png" },
    ]);
  });

  it("falls back to a supported icon and date message when metadata is unavailable", async () => {
    delete process.env.EXPO_PUBLIC_API_URL;

    await render(
      <EarnedBadgeRow
        badge={{
          code: "UNKNOWN_BADGE",
          description: "A special achievement.",
          earnedAt: "not-a-date",
          iconUrl: "/badges/unknown.png",
          id: "earned-2",
          name: "Unknown Badge",
        }}
        isLast={false}
      />,
    );

    expect(screen.getByLabelText(/Earned Date unavailable/)).toBeTruthy();
  });

  it("accepts absolute badge image URLs", async () => {
    await render(
      <EarnedBadgeRow
        badge={{
          code: "ROSARY_MASTER",
          description: "Prayed many Rosaries.",
          earnedAt: "2026-02-05T12:00:00.000Z",
          iconUrl: "https://cdn.example.test/badges/master.png",
          id: "earned-3",
          name: "Rosary Master",
        }}
        isLast
      />,
    );

    expect(screen.getByLabelText(/Badge earned: Rosary Master/)).toBeTruthy();
    expect(screen.getByTestId("badge-artwork-earned-3").props.source).toEqual([
      { uri: "https://cdn.example.test/badges/master.png" },
    ]);
  });

  it("falls back to the API origin for relative artwork when no Supabase URL is configured", async () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;

    await render(
      <EarnedBadgeRow
        badge={{
          code: "ROSARY_MASTER",
          description: "Prayed many Rosaries.",
          earnedAt: "2026-02-05T12:00:00.000Z",
          iconUrl: "/badges/master.png",
          id: "earned-api-relative",
          name: "Rosary Master",
        }}
        isLast
      />,
    );

    expect(screen.getByTestId("badge-artwork-earned-api-relative").props.source).toEqual([
      { uri: "https://api.example.test/badges/master.png" },
    ]);
  });

  it("rewrites loopback storage origins through the configured Supabase URL", async () => {
    await render(
      <EarnedBadgeRow
        badge={{
          code: "FIRST_ROSARY",
          description: "Prayed a first Rosary.",
          earnedAt: "2026-02-05T12:00:00.000Z",
          iconUrl: "http://127.0.0.1:54321/storage/v1/object/public/images/badges/first-rosary.png?version=2",
          id: "earned-loopback",
          name: "First Rosary",
        }}
        isLast
      />,
    );

    const artwork = screen.getByTestId("badge-artwork-earned-loopback");
    expect(artwork.props.source).toEqual([
      {
        uri: "https://storage.example.test/storage/v1/object/public/images/badges/first-rosary.png?version=2",
      },
    ]);
    expect(artwork.props.cachePolicy).toBe("memory-disk");
    expect(artwork.props.transition).toEqual({ duration: 0 });
  });

  it("uses the badge glyph for an unsupported artwork protocol", async () => {
    await render(
      <EarnedBadgeRow
        badge={{
          code: "FIRST_ROSARY",
          description: "Prayed a first Rosary.",
          earnedAt: "2026-02-05T12:00:00.000Z",
          iconUrl: "ftp://files.example.test/badges/first-rosary.png",
          id: "earned-invalid-url",
          name: "First Rosary",
        }}
        isLast
      />,
    );

    expect(screen.queryByTestId("badge-artwork-earned-invalid-url")).toBeNull();
    expect(screen.getByTestId("badge-icon-fallback-earned-invalid-url")).toBeTruthy();
  });

  it("falls back to the badge glyph when remote artwork fails", async () => {
    await render(
      <EarnedBadgeRow
        badge={{
          code: "FIRST_ROSARY",
          description: "Prayed a first Rosary.",
          earnedAt: "2026-02-05T12:00:00.000Z",
          iconUrl: "https://cdn.example.test/badges/broken.png",
          id: "earned-broken",
          name: "First Rosary",
        }}
        isLast
      />,
    );

    await act(async () => {
      screen.getByTestId("badge-artwork-earned-broken").props.onError({ nativeEvent: {} });
    });

    expect(screen.queryByTestId("badge-artwork-earned-broken")).toBeNull();
    expect(screen.getByTestId("badge-icon-fallback-earned-broken")).toBeTruthy();
  });
});
