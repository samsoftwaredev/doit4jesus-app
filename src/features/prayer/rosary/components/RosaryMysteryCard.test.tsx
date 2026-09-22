import { fireEvent, render, screen } from "@testing-library/react-native";

import { rosaryMysterySets } from "@/features/prayer/rosary/data/rosaryMysteries";
import { theme } from "@/theme/tokens";

import { RosaryMysteryCard } from "./RosaryMysteryCard";

describe("RosaryMysteryCard", () => {
  it("uses a dark enough image overlay to preserve readable card copy", () => {
    expect(theme.colors.gradients.mysteryImage).toEqual([
      "rgba(3, 13, 24, 0.22)",
      "rgba(3, 13, 24, 0.68)",
      "rgba(3, 13, 24, 0.96)",
    ]);
  });

  it("renders the selected mystery set and opens it from the full card", async () => {
    const onPress = jest.fn();
    const mysterySet = rosaryMysterySets[0];

    await render(<RosaryMysteryCard mysterySet={mysterySet} onPress={onPress} width={160} />);

    expect(screen.getByText(mysterySet.title)).toBeTruthy();
    expect(screen.getByText(mysterySet.subtitle)).toBeTruthy();

    await fireEvent.press(screen.getByLabelText(`Open ${mysterySet.title}`));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
