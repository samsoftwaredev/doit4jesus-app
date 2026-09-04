import { render, screen } from "@testing-library/react-native";

import { FruitOfMysteryCard } from "./FruitOfMysteryCard";

describe("FruitOfMysteryCard", () => {
  it("presents the mystery fruit and its reflection as one accessible card", async () => {
    const description =
      "Jesus is born in a humble manger, revealing that true riches are found in God. Ask for grace to loosen attachment to material wealth and treasure what draws the heart toward him.";

    await render(<FruitOfMysteryCard description={description} fruit="Poverty of Spirit" />);

    expect(screen.getByText("FRUIT OF THE MYSTERY")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Poverty of Spirit" })).toBeTruthy();
    expect(screen.getByText(description)).toBeTruthy();
    expect(screen.getByLabelText(`Fruit of the mystery. Poverty of Spirit. ${description}`)).toBeTruthy();
  });

  it("provides useful fallback copy when fruit content is unavailable", async () => {
    await render(<FruitOfMysteryCard />);

    expect(screen.getByText("Fruit unavailable")).toBeTruthy();
    expect(screen.getByText("A reflection for this mystery is not available.")).toBeTruthy();
  });
});
