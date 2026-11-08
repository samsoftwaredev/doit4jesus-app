import { act, fireEvent, render, screen } from "@testing-library/react-native";

const mockScrollTo = jest.fn();
const mockSetParams = jest.fn();
let mockScrollParam: string | undefined;

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ scrollTo: mockScrollParam }),
  useRouter: () => mockRouter,
}));

const mockRouter = { push: jest.fn(), setParams: mockSetParams };

jest.mock("@/components/screen-shell", () => {
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    ScreenShell: ({ children, scrollViewRef }: { children: React.ReactNode; scrollViewRef: { current: unknown } }) => {
      scrollViewRef.current = { scrollTo: mockScrollTo };
      return <View>{children}</View>;
    },
  };
});

jest.mock("@/components/ui", () => ({ HeaderActionGroup: () => null }));
jest.mock("@/features/screen-data", () => ({ fetchScreenData: jest.fn().mockResolvedValue({}) }));
jest.mock("@/localization", () => ({ useAppLanguage: () => ({ locale: "en-US" }) }));
jest.mock("@/features/dashboard", () => {
  const { View } = jest.requireActual<typeof import("react-native")>("react-native");
  return {
    HolyProgressDashboard: ({ onGardenLayout }: { onGardenLayout: (event: unknown) => void }) => (
      <View onLayout={onGardenLayout} testID="rosary-garden-section-container" />
    ),
  };
});

const HomeScreen = jest.requireActual<typeof import("@/app/(tabs)/home")>("@/app/(tabs)/home").default;

function layout(testID: string, y: number) {
  return fireEvent(screen.getByTestId(testID), "layout", {
    nativeEvent: { layout: { height: 100, width: 390, x: 0, y } },
  });
}

describe("Home Garden route target", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockScrollParam = "garden";
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  async function renderHome() {
    await render(<HomeScreen />);
    await act(async () => {
      await Promise.resolve();
    });
  }

  it("scrolls to the Garden measured from the top of Home, including the header above the dashboard", async () => {
    await renderHome();
    await layout("home-dashboard-container", 180);
    await layout("rosary-garden-section-container", 1400);

    expect(mockScrollTo).toHaveBeenLastCalledWith({ animated: true, y: 1580 });
  });

  it("follows the Garden when cards above it finish loading, then clears the target once it settles", async () => {
    await renderHome();
    await layout("home-dashboard-container", 180);
    await layout("rosary-garden-section-container", 1400);
    await layout("rosary-garden-section-container", 1900);

    expect(mockScrollTo).toHaveBeenLastCalledWith({ animated: false, y: 2080 });
    expect(mockSetParams).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockSetParams).toHaveBeenCalledTimes(1);
    expect(mockSetParams).toHaveBeenCalledWith({ scrollTo: undefined });
  });

  it("does not scroll when Home is opened without a Garden target", async () => {
    mockScrollParam = undefined;
    await renderHome();
    await layout("home-dashboard-container", 180);
    await layout("rosary-garden-section-container", 1400);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});
