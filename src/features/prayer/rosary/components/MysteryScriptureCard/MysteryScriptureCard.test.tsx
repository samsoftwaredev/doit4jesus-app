import { render, screen } from "@testing-library/react-native";

import type { RosaryMystery } from "@/features/prayer/rosary/types";

import { MysteryScriptureCard } from "./MysteryScriptureCard";

const mystery: RosaryMystery = {
  backgroundImageSources: [1],
  category: "Joyful Mysteries",
  fruit: "Humility",
  fruitDescription: "Ask for the grace of humility.",
  id: "annunciation",
  imageAlt: "The Annunciation",
  imageSource: 1,
  prayers: [],
  scriptureReference: "Luke 1:26-38",
  scriptureText: "The angel Gabriel was sent from God.",
  title: "The Annunciation",
};

describe("MysteryScriptureCard", () => {
  it("combines the current mystery and Scripture in one accessible card", async () => {
    await render(
      <MysteryScriptureCard
        mystery={mystery}
        scriptureQuotation="Hail, favored one! The Lord is with you."
        scriptureReference="Luke 1:28"
      />,
    );

    expect(screen.getByTestId("mystery-scripture-card")).toBeTruthy();
    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();
    expect(screen.getByRole("header", { name: "The Annunciation" })).toBeTruthy();
    expect(screen.getByText("Joyful Mysteries")).toBeTruthy();
    expect(screen.getByText("SCRIPTURE")).toBeTruthy();
    expect(screen.getByText("Luke 1:28")).toBeTruthy();
    expect(screen.getByText("Hail, favored one! The Lord is with you.")).toBeTruthy();
    expect(screen.getByLabelText("Scripture. Luke 1:28")).toBeTruthy();
  });

  it("keeps both sections useful when mystery and Scripture data are unavailable", async () => {
    await render(<MysteryScriptureCard />);

    expect(screen.getByLabelText("No Rosary mystery available")).toBeTruthy();
    expect(screen.getByText("No mystery available")).toBeTruthy();
    expect(screen.getByText("Scripture reference unavailable")).toBeTruthy();
    expect(screen.getByText("Scripture quotation unavailable.")).toBeTruthy();
  });
});
