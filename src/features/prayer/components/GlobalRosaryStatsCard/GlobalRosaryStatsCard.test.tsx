import { fireEvent, render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { GlobalRosaryStatsCard } from "./GlobalRosaryStatsCard";

describe("GlobalRosaryStatsCard", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("shows the locale-formatted global total and current-user contribution", async () => {
    await render(
      <GlobalRosaryStatsCard
        error={false}
        isLoading={false}
        onRetry={jest.fn()}
        stats={{
          currentUserContribution: { percentage: 96.1538, rosariesPrayed: 25 },
          totalRosariesPrayed: 26,
        }}
      />,
    );

    expect(screen.getByRole("header", { name: "Rosaries Prayed Globally" })).toBeTruthy();
    expect(screen.getByLabelText("26 Rosaries prayed globally")).toBeTruthy();
    expect(screen.getByText("Your contribution: 25")).toBeTruthy();
    expect(screen.getByText("96.15%")).toBeTruthy();
    expect(screen.getByText("of all Rosaries prayed worldwide")).toBeTruthy();
    expect(screen.getByText("Every Rosary helps this worldwide prayer grow.")).toBeTruthy();
    const progress = screen.getByRole("progressbar", { name: "Your global Rosary contribution: 96.15%" });
    expect(progress.props.accessibilityValue).toEqual({ max: 100, min: 0, now: 96.1538 });
  });

  it("hides only a null contribution and keeps zero visible", async () => {
    const rendered = await render(
      <GlobalRosaryStatsCard
        error={false}
        isLoading={false}
        onRetry={jest.fn()}
        stats={{ currentUserContribution: null, totalRosariesPrayed: 26 }}
      />,
    );

    expect(screen.queryByText(/Your contribution/)).toBeNull();
    expect(screen.queryByText("Every Rosary helps this worldwide prayer grow.")).toBeNull();

    await rendered.rerender(
      <GlobalRosaryStatsCard
        error={false}
        isLoading={false}
        onRetry={jest.fn()}
        stats={{ currentUserContribution: { percentage: 0, rosariesPrayed: 0 }, totalRosariesPrayed: 26 }}
      />,
    );
    expect(screen.getByText("Your contribution: 0")).toBeTruthy();
  });

  it("provides loading and recoverable failure states", async () => {
    const onRetry = jest.fn();
    const rendered = await render(<GlobalRosaryStatsCard error={false} isLoading onRetry={onRetry} stats={null} />);

    expect(screen.getByLabelText("Loading global Rosary statistics")).toBeTruthy();

    await rendered.rerender(<GlobalRosaryStatsCard error isLoading={false} onRetry={onRetry} stats={null} />);
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("Global Rosary statistics unavailable.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Retry global Rosary statistics" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("localizes the card in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(
      <GlobalRosaryStatsCard
        error={false}
        isLoading={false}
        onRetry={jest.fn()}
        stats={{
          currentUserContribution: { percentage: 96.1538, rosariesPrayed: 25 },
          totalRosariesPrayed: 26,
        }}
      />,
    );

    expect(screen.getByRole("header", { name: "Rosarios rezados en todo el mundo" })).toBeTruthy();
    expect(screen.getByLabelText("26 Rosarios rezados en todo el mundo")).toBeTruthy();
    expect(screen.getByText("Tu contribución: 25")).toBeTruthy();
    expect(screen.getByText("96.15%")).toBeTruthy();
    expect(screen.getByText("de todos los Rosarios rezados en el mundo")).toBeTruthy();
    expect(screen.getByText("Cada Rosario ayuda a que esta oración mundial siga creciendo.")).toBeTruthy();
    expect(screen.getByRole("progressbar", { name: "Tu contribución global al Rosario: 96.15%" })).toBeTruthy();
  });
});
