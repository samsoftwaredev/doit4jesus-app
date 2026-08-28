import { render, screen } from "@testing-library/react-native";

import { ArmorProgress } from "./ArmorProgress";

describe("ArmorProgress", () => {
  it("clamps the accessible progress value to a safe total", async () => {
    await render(<ArmorProgress equippedCount={7} totalCount={0} />);

    const progress = screen.getByLabelText("Armor Equipped: 7 of 0");
    expect(progress.props.accessibilityValue).toEqual({ max: 1, min: 0, now: 7 });
  });
});
