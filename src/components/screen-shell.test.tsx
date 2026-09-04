import { render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

import { ScreenShell } from "./screen-shell";

const mockResponsiveLayout = jest.fn(() => ({
  contentWidth: 390,
  fontScale: 1,
  gutter: 16,
  height: 844,
  isDesktop: false,
  isLandscape: false,
  isLargeText: false,
  isNarrowPhone: false,
  isTablet: false,
  size: "phone",
  width: 390,
}));

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
}));

describe("ScreenShell", () => {
  it("includes the shared decorative atmosphere by default", async () => {
    await render(
      <ScreenShell subtitle="A calm place to grow." title="Welcome">
        <Text>Screen content</Text>
      </ScreenShell>,
    );

    expect(screen.getByTestId("sacred-atmosphere").props.pointerEvents).toBe("none");
    expect(screen.getByTestId("sacred-atmosphere-foreground").props.pointerEvents).toBe("none");
    expect(screen.getByText("Screen content")).toBeTruthy();
  });

  it("keeps the shared atmosphere when a screen supplies its own background", async () => {
    await render(
      <ScreenShell background={<View testID="route-background" />} subtitle="A calm place to grow." title="Welcome">
        <Text>Screen content</Text>
      </ScreenShell>,
    );

    expect(screen.getByTestId("route-background")).toBeTruthy();
    expect(screen.getByTestId("sacred-atmosphere")).toBeTruthy();
    expect(screen.getByTestId("sacred-atmosphere-foreground")).toBeTruthy();
  });

  it("stacks the heading and actions when large text needs more horizontal room", async () => {
    mockResponsiveLayout.mockReturnValueOnce({
      ...mockResponsiveLayout(),
      fontScale: 1.6,
      isLargeText: true,
    });

    await render(
      <ScreenShell headerAccessory={<Text>Header action</Text>} subtitle="A calm place to grow." title="Welcome">
        <Text>Screen content</Text>
      </ScreenShell>,
    );

    expect(screen.getByTestId("screen-shell-heading-row").props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ flexDirection: "column" })]),
    );
    expect(screen.getByText("Header action")).toBeTruthy();
  });
});
