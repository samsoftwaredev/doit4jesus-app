import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import type { ResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { i18n } from "@/localization";
import { UserProgressSection } from "./UserProgressSection";

const mockPush = jest.fn();
const mockFetchRosaryStreak = jest.fn();
const mockFetchRosaryStats = jest.fn();
const mockFetchUserProgress = jest.fn();
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

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/features/prayer/rosary/garden/api", () => ({
  fetchRosaryStreak: (...args: unknown[]) => mockFetchRosaryStreak(...args),
}));

jest.mock("@/hooks/useResponsiveLayout", () => ({
  useResponsiveLayout: () => mockResponsiveLayout(),
}));

jest.mock("./progress.api", () => ({
  fetchRosaryStats: (...args: unknown[]) => mockFetchRosaryStats(...args),
  fetchUserProgress: (...args: unknown[]) => mockFetchUserProgress(...args),
}));

function mockSuccessfulRequests() {
  mockFetchRosaryStreak.mockResolvedValue({ currentStreak: 14, longestStreak: 27 });
  mockFetchRosaryStats.mockResolvedValue({ rosariesPrayed: 25 });
  mockFetchUserProgress.mockResolvedValue({ lifetimePoints: 4320 });
}

describe("UserProgressSection", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockResponsiveLayout.mockReturnValue(phoneLayout);
    mockSuccessfulRequests();
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders inspiration cards directly after the two Rosary streak statistics", async () => {
    await render(<UserProgressSection />);

    expect(await screen.findByLabelText("STREAK, 14 days")).toBeTruthy();
    expect(screen.getByLabelText("LONGEST STREAK, 27 days")).toBeTruthy();
    expect(screen.getByText("Plant Today’s Flower")).toBeTruthy();
    expect(screen.getByLabelText("Devotional quote from Our Lady of Fatima")).toBeTruthy();

    const sectionChildren = screen.getByLabelText("User progress").props.children;
    expect(sectionChildren[0].props.testID).toBe("progress-streak-area");
    expect(sectionChildren[1].props.testID).toBe("progress-inspiration-cards");

    const inspirationCards = screen.getByTestId("progress-inspiration-cards").props.children;
    expect(inspirationCards.map((card: { props: { testID?: string } }) => card.props.testID)).toEqual([
      "garden-motivation-card-container",
      "garden-quote-card-container",
    ]);
  });

  it("stacks inspiration cards on phones and large text, then uses columns on tablets", async () => {
    const rendered = await render(<UserProgressSection />);
    const getLayout = () => StyleSheet.flatten(screen.getByTestId("progress-inspiration-cards").props.style);

    expect(getLayout().flexDirection).not.toBe("row");

    mockResponsiveLayout.mockReturnValue({
      ...phoneLayout,
      contentWidth: 736,
      height: 1024,
      isTablet: true,
      size: "tablet",
      width: 768,
    });
    await rendered.rerender(<UserProgressSection />);
    expect(getLayout().flexDirection).toBe("row");

    mockResponsiveLayout.mockReturnValue({
      ...phoneLayout,
      contentWidth: 736,
      fontScale: 1.6,
      height: 1024,
      isLargeText: true,
      isTablet: true,
      size: "tablet",
      width: 768,
    });
    await rendered.rerender(<UserProgressSection />);
    expect(getLayout().flexDirection).not.toBe("row");
  });

  it("keeps inspiration available while progress is loading or unavailable", async () => {
    mockFetchRosaryStreak.mockReturnValueOnce(new Promise(() => undefined));
    const rendered = await render(<UserProgressSection />);

    expect(screen.getByText("Plant Today’s Flower")).toBeTruthy();
    expect(screen.getByLabelText("Devotional quote from Our Lady of Fatima")).toBeTruthy();

    mockFetchRosaryStreak.mockRejectedValueOnce(new Error("offline"));
    await rendered.rerender(<UserProgressSection key="error" />);

    expect(await screen.findByRole("button", { name: "Try again" })).toBeTruthy();
    expect(screen.getByText("Plant Today’s Flower")).toBeTruthy();
    expect(screen.getByLabelText("Devotional quote from Our Lady of Fatima")).toBeTruthy();
  });

  it("retries failed progress requests", async () => {
    mockFetchRosaryStreak.mockRejectedValueOnce(new Error("offline"));

    await render(<UserProgressSection />);
    await fireEvent.press(await screen.findByRole("button", { name: "Try again" }));
    expect(await screen.findByLabelText("STREAK, 14 days")).toBeTruthy();
    expect(mockFetchRosaryStreak).toHaveBeenCalledTimes(2);
  });

  it("retains localized Spanish inspiration copy", async () => {
    await i18n.changeLanguage("es");
    await render(<UserProgressSection />);

    expect(screen.getByText("Planta la flor de hoy")).toBeTruthy();
    expect(screen.getByLabelText("Cita devocional de Nuestra Señora de Fátima")).toBeTruthy();
  });
});
