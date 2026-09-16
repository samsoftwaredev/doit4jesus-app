import { render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { ResponsiveTabs } from "./ResponsiveTabs";

const mockWindowDimensions = jest.fn();
const mockTabsProps = jest.fn();

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
    options: { tabBarAccessibilityLabel: string; title: string };
  }) {
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
  return { useAppTheme: () => ({ theme }) };
});

function setViewport(width: number, height = 844, fontScale = 1) {
  mockWindowDimensions.mockReturnValue({ fontScale, height, scale: 2, width });
}

describe("ResponsiveTabs", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
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
    expect(screen.getByText("prayer:Prayer")).toBeTruthy();
    expect(screen.getByText("community:Community")).toBeTruthy();
    expect(screen.getByText("profile:Profile")).toBeTruthy();
    expect(screen.getByLabelText("Home tab")).toBeTruthy();
    expect(screen.getByLabelText("Prayer tab")).toBeTruthy();
    expect(screen.getByLabelText("Community tab")).toBeTruthy();
    expect(screen.getByLabelText("Profile tab")).toBeTruthy();
    expect(options.tabBarActiveTintColor).not.toBe(options.tabBarInactiveTintColor);
  });

  it("localizes tab names and accessible labels in Spanish", async () => {
    await i18n.changeLanguage("es");
    setViewport(390);

    await render(<ResponsiveTabs />);

    expect(screen.getByText("home:Inicio")).toBeTruthy();
    expect(screen.getByText("prayer:Oración")).toBeTruthy();
    expect(screen.getByText("community:Comunidad")).toBeTruthy();
    expect(screen.getByText("profile:Perfil")).toBeTruthy();
    expect(screen.getByLabelText("Pestaña de inicio")).toBeTruthy();
  });
});
