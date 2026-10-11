import { act, fireEvent, render, screen, within } from "@testing-library/react-native";

import { i18n } from "@/localization/i18n";

import type { DashboardProgress, LevelCatalogEntry } from "@/features/progress";
import { LevelProgressCard } from "./LevelProgressCard";

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

const progress: DashboardProgress = {
  currentLevel: { code: "disciple", levelNumber: 3, minimumTotalXp: 750, name: "Disciple" },
  levelProgressPercentage: 44.4,
  lifetimePoints: 1083,
  nextLevel: { code: "witness", levelNumber: 4, minimumTotalXp: 1500, name: "Witness" },
  totalXp: 1083,
  weeklyPoints: 90,
  xpIntoCurrentLevel: 333,
  xpRequiredForNextLevel: 750,
  yearlyPoints: 1083,
};

const levelCatalog: LevelCatalogEntry[] = [
  { code: "witness", levelNumber: 4, minimumTotalXp: 1500, name: "Witness" },
  { code: "awakened", levelNumber: 1, minimumTotalXp: 0, name: "Awakened" },
  { code: "disciple", levelNumber: 3, minimumTotalXp: 750, name: "Disciple" },
];

describe("LevelProgressCard", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => i18n.changeLanguage("en"));
  });

  afterAll(async () => {
    await act(async () => i18n.changeLanguage("en"));
  });

  it("shows current and next level artwork with clamped accessible progress", async () => {
    await render(
      <LevelProgressCard
        gender="female"
        isLoading={false}
        levelCatalog={levelCatalog}
        progress={{ ...progress, levelProgressPercentage: 140 }}
        progressError={false}
      />,
    );

    expect(screen.queryByRole("header", { name: "AVATAR JOURNEY" })).toBeNull();
    expect(screen.getByText("Help your avatar progress and become a persevering disciple (level 10)")).toBeTruthy();
    expect(screen.getByTestId("avatar-journey-background")).toBeTruthy();
    expect(screen.getByTestId("avatar-journey-character").props.source).toEqual([
      require("../../../../../assets/images/avatar/princessProgress/level-03-hopeful-servant.png"),
    ]);
    expect(screen.getByRole("header", { name: "LEVEL PROGRESS" })).toBeTruthy();
    expect(screen.getByText("The more you pray and read Scripture, the more you advance in levels.")).toBeTruthy();
    expect(screen.getByRole("image", { name: "Disciple level artwork" })).toBeTruthy();
    expect(screen.getByRole("image", { name: "Witness level artwork" })).toBeTruthy();
    expect(screen.getAllByRole("progressbar")[1].props.accessibilityValue).toEqual({ max: 100, min: 0, now: 100 });
    expect(screen.getByText("100% toward Witness")).toBeTruthy();
  });

  it("uses a shield for unknown codes and Awakened artwork for a new user", async () => {
    const rendered = await render(
      <LevelProgressCard
        isLoading={false}
        levelCatalog={levelCatalog}
        progress={{ ...progress, currentLevel: { ...progress.currentLevel!, code: "unknown-level" } }}
        progressError={false}
      />,
    );

    expect(screen.getByTestId("current-level-shield-fallback")).toBeTruthy();

    await rendered.rerender(
      <LevelProgressCard isLoading={false} levelCatalog={null} progress={null} progressError={false} />,
    );
    expect(screen.getByRole("image", { name: "Awakened level artwork" })).toBeTruthy();
    expect(screen.getByText("Next level unavailable")).toBeTruthy();
    expect(screen.queryByText("Highest level reached")).toBeNull();
  });

  it("maps the misspelled persevering-disciple asset through its corrected logical code", async () => {
    await render(
      <LevelProgressCard
        isLoading={false}
        levelCatalog={null}
        progress={{
          ...progress,
          currentLevel: {
            code: "persevering-disciple",
            levelNumber: 5,
            minimumTotalXp: 3000,
            name: "Persevering Disciple",
          },
        }}
        progressError={false}
      />,
    );

    expect(screen.getByRole("image", { name: "Persevering Disciple level artwork" })).toBeTruthy();
    expect(screen.queryByTestId("current-level-shield-fallback")).toBeNull();
  });

  it("shows the highest-level state at 100 percent", async () => {
    await render(
      <LevelProgressCard
        isLoading={false}
        levelCatalog={levelCatalog}
        progress={{ ...progress, currentLevel: progress.nextLevel, nextLevel: null }}
        progressError={false}
      />,
    );

    expect(screen.getAllByText("Highest level reached")).toHaveLength(2);
    expect(screen.getAllByRole("progressbar")[1].props.accessibilityValue.now).toBe(100);
  });

  it("hides the catalogue action when no catalogue is available", async () => {
    await render(<LevelProgressCard isLoading={false} levelCatalog={null} progress={progress} progressError={false} />);

    expect(screen.queryByRole("button", { name: "See all levels" })).toBeNull();
  });

  it("opens a sorted, accessible catalogue and closes it", async () => {
    await render(
      <LevelProgressCard isLoading={false} levelCatalog={levelCatalog} progress={progress} progressError={false} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "See all levels" }));
    const list = screen.getByLabelText("Levels in order");
    const rows = within(list).getAllByRole("summary");
    expect(rows.map((row) => row.props.accessibilityLabel)).toEqual([
      "Level 1, Awakened, 0 XP required",
      "Level 3, Disciple, 750 XP required, current level",
      "Level 4, Witness, 1,500 XP required",
    ]);
    expect(rows[1].props.accessibilityState).toEqual({ selected: true });

    await fireEvent.press(screen.getByRole("button", { name: "Close levels" }));
    expect(screen.queryByRole("header", { name: "All Levels" })).toBeNull();
  });

  it("stacks level panels on narrow screens and localizes the catalogue in Spanish", async () => {
    mockResponsiveLayout.mockReturnValueOnce({
      ...mockResponsiveLayout(),
      contentWidth: 300,
      isNarrowPhone: true,
      width: 320,
    });
    await act(async () => i18n.changeLanguage("es"));

    await render(
      <LevelProgressCard isLoading={false} levelCatalog={levelCatalog} progress={progress} progressError={false} />,
    );

    expect(screen.getByTestId("level-pair").props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ flexDirection: "column" })]),
    );
    expect(screen.getByRole("header", { name: "PROGRESO DE NIVEL" })).toBeTruthy();
    expect(
      screen.getByText("Mientras más ores y leas la Sagrada Escritura, más avanzarás en los niveles."),
    ).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Ver todos los niveles" }));
    expect(screen.getByRole("header", { name: "Todos los niveles" })).toBeTruthy();
  });

  it("stacks level panels when large text needs more room", async () => {
    mockResponsiveLayout.mockReturnValueOnce({
      ...mockResponsiveLayout(),
      fontScale: 1.6,
      isLargeText: true,
    });

    await render(
      <LevelProgressCard isLoading={false} levelCatalog={levelCatalog} progress={progress} progressError={false} />,
    );

    expect(screen.getByTestId("level-pair").props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ flexDirection: "column" })]),
    );
  });

  it("announces loading and error states", async () => {
    const rendered = await render(
      <LevelProgressCard isLoading levelCatalog={null} progress={null} progressError={false} />,
    );
    expect(screen.getByLabelText("Loading level progress")).toBeTruthy();

    await rendered.rerender(<LevelProgressCard isLoading={false} levelCatalog={null} progress={null} progressError />);
    expect(screen.getByText("Level progress unavailable")).toBeTruthy();
  });
});
