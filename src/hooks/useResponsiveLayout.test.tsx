import AsyncStorage from "@react-native-async-storage/async-storage";
import { renderHook, waitFor } from "@testing-library/react-native";

import { AppThemeProvider, APP_TEXT_SIZE_PREFERENCE_STORAGE_KEY } from "@/theme/AppThemeProvider";
import { useResponsiveLayout } from "./useResponsiveLayout";

const mockWindowDimensions = jest.fn();
const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;

jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  __esModule: true,
  default: () => mockWindowDimensions(),
}));

function setViewport(width: number, height: number, fontScale = 1) {
  mockWindowDimensions.mockReturnValue({ fontScale, height, scale: 2, width });
}

describe("useResponsiveLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
  });

  it.each([
    [320, 568, "phone"],
    [390, 844, "phone"],
    [768, 1024, "tablet"],
    [1024, 768, "desktop"],
  ] as const)("classifies a %ipx by %ipx viewport as %s", async (width, height, expectedSize) => {
    setViewport(width, height);

    const { result } = await renderHook(() => useResponsiveLayout());

    expect(result.current.size).toBe(expectedSize);
    expect(result.current.isLandscape).toBe(width > height);
  });

  it("reserves the desktop rail and flags layouts that need extra text room", async () => {
    setViewport(1440, 900, 1.6);

    const { result } = await renderHook(() => useResponsiveLayout());

    expect(result.current.contentWidth).toBe(1200);
    expect(result.current.isLargeText).toBe(true);
    expect(result.current.gutter).toBeGreaterThan(16);
  });

  it("combines the device font scale with the in-app preference for responsive layouts", async () => {
    setViewport(390, 844, 1);
    mockGetItem.mockImplementation(async (key) => (key === APP_TEXT_SIZE_PREFERENCE_STORAGE_KEY ? "130" : null));

    const { result } = await renderHook(() => useResponsiveLayout(), { wrapper: AppThemeProvider });

    await waitFor(() => expect(result.current.fontScale).toBe(1.3));
    expect(result.current.isLargeText).toBe(true);
  });
});
