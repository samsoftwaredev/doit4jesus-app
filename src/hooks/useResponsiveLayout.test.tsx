import { renderHook } from "@testing-library/react-native";

import { useResponsiveLayout } from "./useResponsiveLayout";

const mockWindowDimensions = jest.fn();

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
});
