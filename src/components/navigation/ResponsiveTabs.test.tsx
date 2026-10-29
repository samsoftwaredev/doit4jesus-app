import { render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";
import { theme } from "@/theme/tokens";

import { ResponsiveTabs } from "./ResponsiveTabs";

const mockWindowDimensions = jest.fn();
const mockTabsProps = jest.fn();
const mockTabIcons = jest.fn();
const mockTabScreens = jest.fn();
let mockTextScale = 1;
const expectedTabIcons = [
  { color: theme.colors.icon.active, name: "home-variant-outline" },
  { color: theme.colors.icon.muted, name: "home-variant-outline" },
  { color: theme.colors.icon.active, name: "account-group-outline" },
  { color: theme.colors.icon.muted, name: "account-group-outline" },
  { color: theme.colors.icon.active, name: "account-circle-outline" },
  { color: theme.colors.icon.muted, name: "account-circle-outline" },
];

jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  __esModule: true,
  default: () => mockWindowDimensions(),
}));

jest.mock("expo-router", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const { Text, View } = jest.requireActual<typeof import("react-native")>("react-native");

  function Tabs({ children, ...props }: { children?: React.ReactNode }) {
    mockTabsProps(props);
    return React.createElement(View, { accessibilityLabel: "Primary navigation" }, children);
  }

  Tabs.Screen = function TabScreen({
    name,
    options,
  }: {
    name: string;
    options: {
      href?: null;
      tabBarAccessibilityLabel?: string;
      tabBarIcon?: (props: { color: string; focused: boolean; size: number }) => React.ReactNode;
      title?: string;
    };
  }) {
    mockTabScreens(name, options);
    if (options.href === null) return null;
    const mockTheme = jest.requireActual<typeof import("@/theme/tokens")>("@/theme/tokens").theme;
    const activeIcon = options.tabBarIcon?.({ color: mockTheme.colors.icon.active, focused: true, size: 24 });
    const inactiveIcon = options.tabBarIcon?.({ color: mockTheme.colors.icon.muted, focused: false, size: 24 });
    [activeIcon, inactiveIcon].forEach((icon) => {
      if (React.isValidElement<{ color: string; name: string }>(icon)) mockTabIcons(icon.props);
    });
    return React.createElement(
      Text,
      { accessibilityLabel: options.tabBarAccessibilityLabel },
      `${name}:${options.title}`,
    );
  };

  return { Tabs };
});

jest.mock("expo-image", () => {
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return { Image: View };
});

jest.mock("@/theme/AppThemeProvider", () => {
  const { theme } = jest.requireActual<typeof import("@/theme/tokens")>("@/theme/tokens");
  return { useAppTheme: () => ({ textScale: mockTextScale, theme }) };
});

function setViewport(width: number, height = 844, fontScale = 1) {
  mockWindowDimensions.mockReturnValue({ fontScale, height, scale: 2, width });
}

describe("ResponsiveTabs", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockTextScale = 1;
    await i18n.changeLanguage("en");
  });

  it("uses the journey card glyphs with active and inactive navigation tints", async () => {
    setViewport(390);
    await render(<ResponsiveTabs />);

    expect(mockTabIcons.mock.calls.map(([icon]) => ({ color: icon.color, name: icon.name }))).toEqual(expectedTabIcons);
  });

  it.each([320, 390, 768])("keeps bottom navigation at %ipx", async (width) => {
    setViewport(width);
    await render(<ResponsiveTabs />);

    expect(mockTabsProps.mock.lastCall?.[0].screenOptions.tabBarPosition).toBe("bottom");
  });

  it("uses an expanded, accessible 240px navigation rail at the desktop boundary", async () => {
    setViewport(1024, 768, 1.6);
    await render(<ResponsiveTabs />);

    const options = mockTabsProps.mock.lastCall?.[0].screenOptions;
    expect(options.tabBarPosition).toBe("left");
    expect(options.tabBarLabelPosition).toBe("beside-icon");
    expect(options.tabBarStyle).toEqual(expect.objectContaining({ width: 240 }));
    expect(screen.getByText("home:Home")).toBeTruthy();
    expect(screen.queryByText("prayer:Prayer")).toBeNull();
    expect(screen.getByText("community:Community")).toBeTruthy();
    expect(screen.getByText("profile:Profile")).toBeTruthy();
    expect(screen.getByLabelText("Home tab")).toBeTruthy();
    expect(screen.queryByLabelText("Prayer tab")).toBeNull();
    expect(screen.getByLabelText("Community tab")).toBeTruthy();
    expect(screen.getByLabelText("Profile tab")).toBeTruthy();
    expect(options.tabBarActiveTintColor).not.toBe(options.tabBarInactiveTintColor);
  });

  it("uses the in-app multiplier for tab labels and responsive bar height", async () => {
    mockTextScale = 1.3;
    setViewport(390, 844, 1);

    await render(<ResponsiveTabs />);

    const options = mockTabsProps.mock.lastCall?.[0].screenOptions;
    expect(options.tabBarLabelStyle).toMatchObject({ fontSize: 14.3, lineHeight: 18.2 });
    expect(options.tabBarStyle.height).toBeGreaterThan(theme.sizes.bottomNavigationHeight);
  });

  it("localizes tab names and accessible labels in Spanish", async () => {
    await i18n.changeLanguage("es");
    setViewport(390);

    await render(<ResponsiveTabs />);

    expect(screen.getByText("home:Inicio")).toBeTruthy();
    expect(screen.queryByText("prayer:Oración")).toBeNull();
    expect(screen.getByText("community:Comunidad")).toBeTruthy();
    expect(screen.getByText("profile:Perfil")).toBeTruthy();
    expect(screen.getByLabelText("Pestaña de inicio")).toBeTruthy();
    expect(screen.queryByLabelText("Pestaña de oración")).toBeNull();
    expect(mockTabScreens).toHaveBeenCalledWith("prayer", { href: null });
  });
});
