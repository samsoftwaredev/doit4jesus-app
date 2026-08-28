import { render, screen } from "@testing-library/react-native";

import { ScriptureCard } from "./ScriptureCard";

describe("ScriptureCard", () => {
  it("renders configured scripture content and fallback copy", async () => {
    await render(<ScriptureCard quotation="A configured quotation." reference="John 1:1" />);
    expect(screen.getByText("John 1:1")).toBeTruthy();
    expect(screen.getByText("A configured quotation.")).toBeTruthy();

    await render(<ScriptureCard />);
    expect(screen.getByText("Scripture reference unavailable")).toBeTruthy();
  });
});
