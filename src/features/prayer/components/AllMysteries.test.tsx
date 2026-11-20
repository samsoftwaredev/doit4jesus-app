import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { rosaryMysterySets } from "@/features/prayer/rosary/data/rosaryMysteries";

import { AllMysteries } from "./AllMysteries";

const mockResponsiveLayout = jest.fn();

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
}));

function setViewport(width: number) {
  const isDesktop = width >= 1024;
  const isTablet = width >= 768;

  mockResponsiveLayout.mockReturnValue({
    contentWidth: width,
    fontScale: 1,
    gutter: 16,
    height: 900,
    isDesktop,
    isLandscape: width > 900,
    isLargeText: false,
    isNarrowPhone: width < 360,
    isTablet,
    size: isDesktop ? "desktop" : isTablet ? "tablet" : "phone",
    width,
  });
}

describe("AllMysteries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setViewport(390);
  });

  /** Renders the grid and reports a measured width, as the device layout pass would. */
  async function renderMeasured(onOpenMystery = jest.fn()) {
    await render(<AllMysteries gap={8} onOpenMystery={onOpenMystery} />);
    await fireEvent(screen.getByTestId("all-mysteries-grid"), "layout", {
      nativeEvent: { layout: { height: 400, width: 328, x: 0, y: 0 } },
    });
    return onOpenMystery;
  }

  it("renders every mystery set and reports the selected mystery", async () => {
    const onOpenMystery = await renderMeasured();

    expect(screen.getByRole("header", { name: "All Mysteries" })).toBeTruthy();
    rosaryMysterySets.forEach((set) => {
      expect(screen.getByText(set.title)).toBeTruthy();
    });

    await fireEvent.press(screen.getByLabelText(`Open ${rosaryMysterySets[1].title}`));

    expect(onOpenMystery).toHaveBeenCalledWith(rosaryMysterySets[1].type);
  });

  it.each([
    ["mobile", 390],
    ["tablet", 768],
    ["desktop", 1024],
  ] as const)("always lays mysteries out as a wrapping 2x2 grid on %s", async (_name, width) => {
    setViewport(width);

    await renderMeasured();

    expect(StyleSheet.flatten(screen.getByTestId("all-mysteries-grid").props.style)).toEqual(
      expect.objectContaining({ flexWrap: "wrap" }),
    );
    const card = screen.getByLabelText(`Open ${rosaryMysterySets[0].title}`);
    expect(StyleSheet.flatten(card.props.style).width).toBe(160);
  });
});
