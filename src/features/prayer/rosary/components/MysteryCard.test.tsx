import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { rosaryMysteries } from "@/features/prayer/rosary/data/rosaryMysteries";

import { MysteryCard } from "./MysteryCard";

describe("MysteryCard", () => {
  it("shows a graceful fallback when a mystery image cannot load", async () => {
    await render(<MysteryCard mystery={rosaryMysteries[0]} />);

    await fireEvent(screen.getByLabelText(rosaryMysteries[0].imageAlt), "error", { nativeEvent: {} });

    expect(screen.getByLabelText("Devotional image unavailable")).toBeTruthy();
  });

  it("sizes the mystery image responsively with the artwork's portrait ratio", async () => {
    await render(<MysteryCard mystery={rosaryMysteries[0]} />);

    const imageFrameStyle = StyleSheet.flatten(screen.getByTestId("mystery-image-frame").props.style);
    expect(imageFrameStyle.aspectRatio).toBeCloseTo(575 / 784);
    expect(imageFrameStyle.height).toBeUndefined();
    expect(imageFrameStyle.width).toBe("100%");
  });
});
