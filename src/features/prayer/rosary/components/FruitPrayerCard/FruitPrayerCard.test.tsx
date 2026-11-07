import { render, screen } from "@testing-library/react-native";

import type { RosaryPrayer } from "@/features/prayer/rosary/types";

import { FruitPrayerCard } from "./FruitPrayerCard";

const prayer: RosaryPrayer = {
  beadType: "hailMary",
  id: "hail-mary",
  name: "Hail Mary",
  text: "Hail Mary, full of grace.",
};

describe("FruitPrayerCard", () => {
  it("shows only the active prayer outside a mystery fruit narration step", async () => {
    await render(
      <FruitPrayerCard
        fruit="Humility"
        fruitDescription="Ask for the grace of humility."
        prayer={prayer}
        showFruit={false}
      />,
    );

    expect(screen.getByTestId("fruit-prayer-card")).toBeTruthy();
    expect(screen.queryByText("FRUIT OF THE MYSTERY")).toBeNull();
    expect(screen.getByText("HAIL MARY")).toBeTruthy();
    expect(screen.getByText("Hail Mary, full of grace.")).toBeTruthy();
  });

  it("shows the fruit while hiding an empty narration prayer", async () => {
    await render(
      <FruitPrayerCard
        fruit="Humility"
        fruitDescription="Ask for the grace of humility."
        hidePrayerWhenEmpty
        prayer={{ ...prayer, beadType: "narration", name: "Mystery Reflection", text: "" }}
        showFruit
      />,
    );

    expect(screen.getByText("FRUIT OF THE MYSTERY")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Humility" })).toBeTruthy();
    expect(screen.getByText("Ask for the grace of humility.")).toBeTruthy();
    expect(screen.queryByText("MYSTERY REFLECTION")).toBeNull();
    expect(screen.queryByLabelText("Prayer text unavailable")).toBeNull();
  });

  it("renders both sections inside the same card when both are requested", async () => {
    await render(
      <FruitPrayerCard fruit="Humility" fruitDescription="Ask for the grace of humility." prayer={prayer} showFruit />,
    );

    expect(screen.getAllByTestId("fruit-prayer-card")).toHaveLength(1);
    expect(screen.getByText("FRUIT OF THE MYSTERY")).toBeTruthy();
    expect(screen.getByText("HAIL MARY")).toBeTruthy();
  });

  it("renders no card when hidden narration has no qualifying fruit content", async () => {
    await render(
      <FruitPrayerCard
        hidePrayerWhenEmpty
        prayer={{ ...prayer, beadType: "narration", name: "Mystery Title", text: "" }}
        showFruit={false}
      />,
    );

    expect(screen.queryByTestId("fruit-prayer-card")).toBeNull();
    expect(screen.queryByText("MYSTERY TITLE")).toBeNull();
  });
});
