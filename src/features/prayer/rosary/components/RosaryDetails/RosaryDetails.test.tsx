import { act, render, screen } from "@testing-library/react-native";
import { Dimensions } from "react-native";

import type { RosaryMystery, RosaryPrayer } from "@/features/prayer/rosary/types";
import { i18n } from "@/localization";

import { RosaryDetails, type RosaryDetailsProps } from "./RosaryDetails";

const prayer: RosaryPrayer = {
  beadType: "hailMary",
  id: "hail-mary",
  name: "Hail Mary",
  text: "Hail Mary, full of grace.",
};
const mystery: RosaryMystery = {
  backgroundImageSources: [{ uri: "mystery-art" }],
  category: "Joyful Mysteries",
  fruit: "Humility",
  fruitDescription: "Ask for the grace of humility.",
  id: "annunciation",
  imageAlt: "The Annunciation",
  imageSource: { uri: "mystery-art" },
  prayers: [prayer],
  scriptureReference: "Luke 1:26-38",
  scriptureText: "The angel Gabriel was sent from God.",
  title: "The Annunciation",
};
const defaultProps: RosaryDetailsProps = {
  artworkSource: mystery.imageSource,
  mystery,
  prayer,
  scriptureQuotation: mystery.scriptureText,
  scriptureReference: mystery.scriptureReference,
};

describe("RosaryDetails", () => {
  beforeEach(async () => {
    await act(async () => i18n.changeLanguage("en"));
    Dimensions.set({
      screen: { fontScale: 1, height: 844, scale: 3, width: 390 },
      window: { fontScale: 1, height: 844, scale: 3, width: 390 },
    });
  });

  it("shows the mystery, artwork, fruit, scripture and prayer together in one view", async () => {
    await render(<RosaryDetails {...defaultProps} />);

    expect(screen.getByText("CURRENT MYSTERY")).toBeTruthy();
    expect(screen.getByTestId("rosary-artwork-image").props.source).toEqual([mystery.imageSource]);
    expect(screen.getByText("FRUIT OF THE MYSTERY")).toBeTruthy();
    expect(screen.getByText("Humility")).toBeTruthy();
    expect(screen.getByText("HAIL MARY")).toBeTruthy();
    expect(screen.getByTestId("rosary-scripture-inline")).toHaveTextContent(/^Luke 1:26-38 The angel Gabriel/);
  });

  it("has no carousel pagination or swipe gesture", async () => {
    await render(<RosaryDetails {...defaultProps} />);

    expect(screen.queryByRole("button", { name: /Show .+, page \d of \d/ })).toBeNull();
    expect(screen.queryByTestId("rosary-detail-carousel")).toBeNull();
  });

  it("keeps the artwork in sync when its source changes", async () => {
    const rendered = await render(<RosaryDetails {...defaultProps} />);

    await rendered.rerender(<RosaryDetails {...defaultProps} artworkSource={{ uri: "updated-art" }} />);

    expect(screen.getByTestId("rosary-artwork-image").props.source).toEqual([{ uri: "updated-art" }]);
  });

  it("shows the fruit during its narration step and hides the empty prayer", async () => {
    const narration = { ...prayer, beadType: "narration" as const, name: "Mystery Reflection", text: "" };
    await render(<RosaryDetails {...defaultProps} isNarrationOnly prayer={narration} />);

    expect(screen.getAllByText("FRUIT OF THE MYSTERY")).toHaveLength(1);
    expect(screen.queryByText("MYSTERY REFLECTION")).toBeNull();
  });
});
