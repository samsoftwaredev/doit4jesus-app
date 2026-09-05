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

  it("renders every mystery set and reports the selected mystery", async () => {
    const onOpenMystery = jest.fn();

    await render(<AllMysteries cardWidth={160} gap={8} onOpenMystery={onOpenMystery} />);

    expect(screen.getByRole("header", { name: "All Mysteries" })).toBeTruthy();
    rosaryMysterySets.forEach((set) => {
      expect(screen.getByText(set.title)).toBeTruthy();
    });

    await fireEvent.press(screen.getByLabelText(`Open ${rosaryMysterySets[1].title}`));

    expect(onOpenMystery).toHaveBeenCalledWith(rosaryMysterySets[1].type);
  });

  it.each([
    ["mobile", 390, "wrap"],
    ["tablet", 768, "wrap"],
    ["desktop", 1024, "nowrap"],
  ] as const)("uses the expected mystery row layout on %s", async (_name, width, flexWrap) => {
    setViewport(width);

    await render(<AllMysteries cardWidth={160} gap={8} onOpenMystery={jest.fn()} />);

    expect(StyleSheet.flatten(screen.getByTestId("all-mysteries-grid").props.style)).toEqual(
      expect.objectContaining({ flexWrap }),
    );
  });
});
