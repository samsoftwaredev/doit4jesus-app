import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

import { AppVisualEffectsProvider } from "@/theme/AppVisualEffectsProvider";

import { ScreenShell } from "./screen-shell";

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;

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
  beforeEach(() => {
    mockGetItem.mockResolvedValue(JSON.stringify({ dustEnabled: true, lightingEnabled: true }));
  });

  it("includes the shared decorative atmosphere when both effects are enabled", async () => {
    await render(
      <AppVisualEffectsProvider>
        <ScreenShell description="A calm place to grow." title="Welcome">
          <Text>Screen content</Text>
        </ScreenShell>
      </AppVisualEffectsProvider>,
    );

    expect((await screen.findByTestId("sacred-atmosphere")).props.pointerEvents).toBe("none");
    expect(screen.getByTestId("sacred-atmosphere-foreground").props.pointerEvents).toBe("none");
    expect(screen.getByText("Screen content")).toBeTruthy();
  });

  it("keeps the shared atmosphere when a screen supplies its own background", async () => {
    await render(
      <AppVisualEffectsProvider>
        <ScreenShell
          background={<View testID="route-background" />}
          description="A calm place to grow."
          title="Welcome"
        >
          <Text>Screen content</Text>
        </ScreenShell>
      </AppVisualEffectsProvider>,
    );

    expect(screen.getByTestId("route-background")).toBeTruthy();
    expect(await screen.findByTestId("sacred-atmosphere")).toBeTruthy();
    expect(screen.getByTestId("sacred-atmosphere-foreground")).toBeTruthy();
  });

  it("renders an interactive overlay above the scrollable screen content", async () => {
    await render(
      <AppVisualEffectsProvider>
        <ScreenShell description="A calm place to grow." overlay={<View testID="screen-toast" />} title="Welcome">
          <Text>Screen content</Text>
        </ScreenShell>
      </AppVisualEffectsProvider>,
    );

    expect(screen.getByTestId("screen-toast")).toBeTruthy();
    expect(screen.getByTestId("screen-shell-overlay").props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ position: "absolute", top: 0 })]),
    );
  });

  it("stacks the heading and actions when large text needs more horizontal room", async () => {
    mockResponsiveLayout.mockReturnValue({
      ...mockResponsiveLayout(),
      fontScale: 1.6,
      isLargeText: true,
    });

    await render(
      <AppVisualEffectsProvider>
        <ScreenShell actions={<Text>Header action</Text>} description="A calm place to grow." title="Welcome">
          <Text>Screen content</Text>
        </ScreenShell>
      </AppVisualEffectsProvider>,
    );

    expect(screen.getByTestId("page-header-main-row").props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ flexDirection: "column" })]),
    );
    expect(screen.getByText("Header action")).toBeTruthy();
  });

  it("shows the company logo only when a screen opts in", async () => {
    const rendered = await render(
      <AppVisualEffectsProvider>
        <ScreenShell description="A calm place to grow." title="Welcome">
          <Text>Screen content</Text>
        </ScreenShell>
      </AppVisualEffectsProvider>,
    );

    expect(screen.queryByLabelText("Do It for Jesus")).toBeNull();

    await rendered.rerender(
      <AppVisualEffectsProvider>
        <ScreenShell description="A calm place to grow." showLogo title="Welcome">
          <Text>Screen content</Text>
        </ScreenShell>
      </AppVisualEffectsProvider>,
    );

    expect(screen.getByLabelText("Do It for Jesus")).toBeTruthy();
  });
});
