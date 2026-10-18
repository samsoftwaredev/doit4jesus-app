import { fireEvent, render, screen } from "@testing-library/react-native";

import NotFoundScreen from "@/app/+not-found";
import { i18n } from "@/localization/i18n";

const mockBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, canGoBack: mockCanGoBack, replace: mockReplace }),
}));

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => ({
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
  }),
}));

describe("NotFoundScreen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(true);
    await i18n.changeLanguage("en");
  });

  it("welcomes the lost visitor with accessible recovery actions", async () => {
    await render(<NotFoundScreen />);

    expect(screen.getByRole("header", { name: "One page has wandered off." })).toBeTruthy();
    expect(screen.getByText("Don’t worry—we left the ninety-nine to come find you.")).toBeTruthy();
    expect(screen.getByText("This page was last seen heading toward the wilderness. 🐑")).toBeTruthy();
    expect(screen.getByLabelText("A confused sheep holding a map beside a signpost")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Return to the flock" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retrace my steps" })).toBeTruthy();
  });

  it("returns home or retraces the visitor's steps", async () => {
    await render(<NotFoundScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Return to the flock" }));
    await fireEvent.press(screen.getByRole("button", { name: "Retrace my steps" }));

    expect(mockReplace).toHaveBeenCalledWith("/");
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("returns home when there is no navigation history to retrace", async () => {
    mockCanGoBack.mockReturnValue(false);
    await render(<NotFoundScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Retrace my steps" }));

    expect(mockBack).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("keeps the lost-sheep message in Spanish parity", async () => {
    await i18n.changeLanguage("es");
    await render(<NotFoundScreen />);

    expect(screen.getByRole("header", { name: "Una página se apartó del rebaño." })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Volver al rebaño" })).toBeTruthy();
    expect(screen.getByText("La última vez que vimos esta página, iba camino al desierto. 🐑")).toBeTruthy();
  });
});
