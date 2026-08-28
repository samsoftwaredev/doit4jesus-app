import { fireEvent, render, screen } from "@testing-library/react-native";

import { rosaryMysteries } from "@/features/prayer/rosary/data/rosaryMysteries";

import { MysteryCard } from "./MysteryCard";

describe("MysteryCard", () => {
  it("shows a graceful fallback when a mystery image cannot load", async () => {
    await render(<MysteryCard imageHeight={180} mystery={rosaryMysteries[0]} />);

    await fireEvent(screen.getByLabelText(rosaryMysteries[0].imageAlt), "error", { nativeEvent: {} });

    expect(screen.getByLabelText("Devotional image unavailable")).toBeTruthy();
  });
});
