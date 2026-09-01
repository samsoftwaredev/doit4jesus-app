import { render, screen } from "@testing-library/react-native";
import { View } from "react-native";

import { Confetti } from "./Confetti";

describe("Confetti", () => {
  it("renders the requested number of falling particles", async () => {
    await render(
      <View style={{ flex: 1 }}>
        <Confetti particleCount={5} testID="confetti" />
      </View>,
    );

    expect(screen.getByTestId("confetti")).toBeTruthy();
    expect(screen.getAllByTestId("confetti-particle")).toHaveLength(5);
  });

  it("does not render while inactive", async () => {
    await render(<Confetti active={false} testID="confetti" />);

    expect(screen.queryByTestId("confetti")).toBeNull();
  });
});
