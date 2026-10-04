import { render, screen } from "@testing-library/react-native";

import { rosaryMysteries } from "@/features/prayer/rosary/data/rosaryMysteries";

import { MysteryCard } from "./MysteryCard";

describe("MysteryCard", () => {
  it("shows the active mystery details without rendering inline artwork", async () => {
    await render(<MysteryCard mystery={rosaryMysteries[0]} />);

    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();
    expect(screen.getByRole("header", { name: "The Annunciation" })).toBeTruthy();
    expect(screen.getByText("Joyful Mysteries")).toBeTruthy();
    expect(screen.queryByLabelText(rosaryMysteries[0].imageAlt)).toBeNull();
  });
});
