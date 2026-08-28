import { render, screen } from "@testing-library/react-native";

import { CelebrationHeroCard } from "./CelebrationHeroCard";

const baseCelebration = {
  grade: "MEMORIAL",
  id: "saint-pius-x",
  name: "Memorial of Saint Pius X, Pope",
  season: "ORDINARY_TIME",
  liturgicalColor: "WHITE" as const,
};

describe("CelebrationHeroCard", () => {
  it("renders the celebration name", async () => {
    await render(<CelebrationHeroCard celebration={baseCelebration} />);
    expect(screen.getByText("Memorial of Saint Pius X, Pope")).toBeTruthy();
  });

  it("renders the season with underscores replaced by spaces", async () => {
    await render(<CelebrationHeroCard celebration={baseCelebration} />);
    expect(screen.getByText("ORDINARY TIME")).toBeTruthy();
  });

  it("renders the grade with underscores replaced by spaces", async () => {
    await render(<CelebrationHeroCard celebration={baseCelebration} />);
    expect(screen.getByText("MEMORIAL")).toBeTruthy();
  });

  it("has an accessibility label describing the celebration and color", async () => {
    await render(<CelebrationHeroCard celebration={baseCelebration} />);
    expect(screen.getByLabelText("Celebration: Memorial of Saint Pius X, Pope. Liturgical color white.")).toBeTruthy();
  });

  it("renders correctly for a RED liturgical season", async () => {
    await render(
      <CelebrationHeroCard celebration={{ ...baseCelebration, liturgicalColor: "RED", name: "Pentecost Sunday" }} />,
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
      />,
    );
    expect(screen.getByText("First Sunday of Advent")).toBeTruthy();
    expect(screen.getByText("ADVENT")).toBeTruthy();
  });
});
