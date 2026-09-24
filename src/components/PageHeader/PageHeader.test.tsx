import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { PageHeader } from "./PageHeader";

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
let mockColorScheme: "light" | "dark" = "dark";

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
}));

jest.mock("@/theme/AppThemeProvider", () => ({
  useAppTheme: () => ({ colorScheme: mockColorScheme }),
}));

describe("PageHeader", () => {
  beforeEach(() => {
    mockColorScheme = "dark";
    mockResponsiveLayout.mockClear();
  });

  it("renders a hero heading, description, and actions without branding by default", async () => {
    await render(
      <PageHeader actions={<Text>Header actions</Text>} description="Grow in faith." title="Welcome home" />,
    );

    expect(screen.getByRole("header", { name: "Welcome home" })).toBeTruthy();
    expect(screen.getByText("Grow in faith.")).toBeTruthy();
    expect(screen.getByText("Header actions")).toBeTruthy();
    expect(screen.queryByLabelText("Do It for Jesus")).toBeNull();
  });

  it("uses the theme-appropriate company logo when explicitly enabled", async () => {
    const rendered = await render(<PageHeader description="Grow in faith." showLogo title="Welcome home" />);

    expect(screen.getByLabelText("Do It for Jesus").props.source).toEqual([
      require("../../../assets/svgs/whiteCompanyLogo.svg"),
    ]);

    mockColorScheme = "light";
    await rendered.rerender(<PageHeader description="Grow in faith." showLogo title="Welcome home" />);

    expect(screen.getByLabelText("Do It for Jesus").props.source).toEqual([
      require("../../../assets/svgs/blackCompanyLogo.svg"),
    ]);
  });

  it("places branded actions beside the logo and lets titleless copy span the header", async () => {
    await render(
      <PageHeader actions={<Text>Header actions</Text>} description="Grow in faith." showLogo title={undefined} />,
    );

    expect(screen.queryByRole("header")).toBeNull();
    expect(screen.getByTestId("page-header-brand-row")).toBeTruthy();
    expect(screen.getByTestId("page-header-brand-row").props.style).toEqual(
      expect.objectContaining({ flexDirection: "row" }),
    );
    expect(screen.getByTestId("page-header-description").props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: "100%" })]),
    );
  });

  it("renders compact navigation with an accessible back action", async () => {
    const onBack = jest.fn();

    await render(
      <PageHeader description="Review your requests." onBack={onBack} title="Friend Requests" variant="compact" />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Go back" }));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("header", { name: "Friend Requests" })).toBeTruthy();
    expect(screen.getByText("Review your requests.")).toBeTruthy();
  });

  it("stacks hero copy and actions when large text needs more room", async () => {
    mockResponsiveLayout.mockReturnValueOnce({
      ...mockResponsiveLayout(),
      fontScale: 1.6,
      isLargeText: true,
    });

    await render(<PageHeader actions={<Text>Action</Text>} description="Description" title="Title" />);

    expect(screen.getByTestId("page-header-main-row").props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ flexDirection: "column" })]),
    );
  });
});
