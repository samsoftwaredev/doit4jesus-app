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
  it("shows the current mystery without any Scripture section", async () => {
    await render(<MysteryScriptureCard mystery={mystery} />);

    expect(screen.getByTestId("mystery-scripture-card")).toBeTruthy();
    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();
    expect(screen.getByRole("header", { name: "The Annunciation" })).toBeTruthy();
    expect(screen.getByText("Joyful Mysteries")).toBeTruthy();
    expect(screen.queryByText("SCRIPTURE")).toBeNull();
  });

  it("keeps a useful empty state when mystery data is unavailable", async () => {
    await render(<MysteryScriptureCard />);

    expect(screen.getByLabelText("No Rosary mystery available")).toBeTruthy();
    expect(screen.getByText("No mystery available")).toBeTruthy();
  });
});
