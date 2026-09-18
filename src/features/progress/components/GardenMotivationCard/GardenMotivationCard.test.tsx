import { render, screen } from "@testing-library/react-native";
import type { ResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { i18n } from "@/localization";

import { GardenMotivationCard } from "./GardenMotivationCard";

const phoneLayout: ResponsiveLayout = {
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
};
const mockResponsiveLayout = jest.fn(() => phoneLayout);

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
}));

describe("GardenMotivationCard", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockResponsiveLayout.mockReturnValue(phoneLayout);
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders English motivation with decorative artwork and a compact phone layout", async () => {
    await render(<GardenMotivationCard />);

    expect(screen.getByText("Plant Today’s Flower")).toBeTruthy();
    expect(screen.getByText(/Pray your rosary and help/)).toBeTruthy();
    expect(screen.queryByText("FAITH • HOPE • LOVE")).toBeNull();
    expect(screen.getByTestId("garden-motivation-artwork").props.accessible).toBe(false);
  });

  it("shows the virtue treatment when space allows and localizes Spanish copy", async () => {
    mockResponsiveLayout.mockReturnValue({
      ...phoneLayout,
      contentWidth: 736,
      height: 1024,
      isTablet: true,
      size: "tablet",
      width: 768,
    });
    await i18n.changeLanguage("es");
    await render(<GardenMotivationCard />);

    expect(screen.getByText("Planta la flor de hoy")).toBeTruthy();
    expect(screen.getByText("Crece en la fe.\nFlorece en la virtud.")).toBeTruthy();
  });
});
