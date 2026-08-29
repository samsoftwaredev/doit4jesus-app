import { render, screen } from "@testing-library/react-native";

import { CelebrationHeroCard } from "./CelebrationHeroCard";

const baseCelebration = {
  grade: "MEMORIAL",
  id: "saint-pius-x",
  name: "Memorial of Saint Pius X, Pope",
  season: "ORDINARY_TIME",
  liturgicalColor: "WHITE" as const,
};
const date = "2026-08-29";

describe("CelebrationHeroCard", () => {
  it("renders the celebration name", async () => {
    await render(<CelebrationHeroCard celebration={baseCelebration} date={date} />);
    expect(screen.getByText("Memorial of Saint Pius X, Pope")).toBeTruthy();
  });

  it("renders the season with underscores replaced by spaces", async () => {
    await render(<CelebrationHeroCard celebration={baseCelebration} date={date} />);
    expect(screen.getByText("ORDINARY TIME")).toBeTruthy();
  });

  it("renders the grade with underscores replaced by spaces", async () => {
    await render(<CelebrationHeroCard celebration={baseCelebration} date={date} />);
    expect(screen.getByText("MEMORIAL")).toBeTruthy();
  });

  it("has an accessibility label describing the celebration and color", async () => {
    await render(<CelebrationHeroCard celebration={baseCelebration} date={date} />);
    expect(screen.getByLabelText("Celebration: Memorial of Saint Pius X, Pope. Liturgical color white.")).toBeTruthy();
  });

  it("renders correctly for a RED liturgical season", async () => {
    await render(
      <CelebrationHeroCard
        celebration={{ ...baseCelebration, liturgicalColor: "RED", name: "Pentecost Sunday" }}
        date={date}
      />,
    );
    expect(screen.getByText("Pentecost Sunday")).toBeTruthy();
    expect(screen.getByLabelText("Celebration: Pentecost Sunday. Liturgical color red.")).toBeTruthy();
  });

  it("renders correctly for ADVENT season", async () => {
    await render(
      <CelebrationHeroCard
        celebration={{
          ...baseCelebration,
          liturgicalColor: "VIOLET",
          name: "First Sunday of Advent",
          season: "ADVENT",
        }}
        date={date}
      />,
    );
    expect(screen.getByText("First Sunday of Advent")).toBeTruthy();
    expect(screen.getByText("ADVENT")).toBeTruthy();
  });
});
