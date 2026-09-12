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
      <ScreenShell description="A calm place to grow." title="Welcome">
        <Text>Screen content</Text>
      </ScreenShell>,
    );

    expect(screen.getByTestId("sacred-atmosphere").props.pointerEvents).toBe("none");
    expect(screen.getByTestId("sacred-atmosphere-foreground").props.pointerEvents).toBe("none");
    expect(screen.getByText("Screen content")).toBeTruthy();
  });

  it("keeps the shared atmosphere when a screen supplies its own background", async () => {
    await render(
      <ScreenShell background={<View testID="route-background" />} description="A calm place to grow." title="Welcome">
        <Text>Screen content</Text>
      </ScreenShell>,
    );

    expect(screen.getByTestId("route-background")).toBeTruthy();
    expect(screen.getByTestId("sacred-atmosphere")).toBeTruthy();
    expect(screen.getByTestId("sacred-atmosphere-foreground")).toBeTruthy();
  });

  it("stacks the heading and actions when large text needs more horizontal room", async () => {
    mockResponsiveLayout.mockReturnValue({
      ...mockResponsiveLayout(),
      fontScale: 1.6,
      isLargeText: true,
    });

    await render(
      <ScreenShell actions={<Text>Header action</Text>} description="A calm place to grow." title="Welcome">
        <Text>Screen content</Text>
      </ScreenShell>,
    );

    expect(screen.getByTestId("page-header-main-row").props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ flexDirection: "column" })]),
    );
    expect(screen.getByText("Header action")).toBeTruthy();
  });

  it("shows the company logo only when a screen opts in", async () => {
    const rendered = await render(
      <ScreenShell description="A calm place to grow." title="Welcome">
        <Text>Screen content</Text>
      </ScreenShell>,
    );

    expect(screen.queryByLabelText("Do It for Jesus")).toBeNull();

    await rendered.rerender(
      <ScreenShell description="A calm place to grow." showLogo title="Welcome">
        <Text>Screen content</Text>
      </ScreenShell>,
    );

    expect(screen.getByLabelText("Do It for Jesus")).toBeTruthy();
  });
});
