import { act, render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization/i18n";
import type { DashboardProgress } from "@/features/progress";
import { AvatarJourneyCard } from "./AvatarJourneyCard";

const progress: DashboardProgress = {
  currentLevel: { code: "disciple", levelNumber: 3, minimumTotalXp: 750, name: "Disciple" },
  levelProgressPercentage: 44,
  lifetimePoints: 1083,
  nextLevel: { code: "witness", levelNumber: 4, minimumTotalXp: 1500, name: "Witness" },
  totalXp: 1083,
  weeklyPoints: 90,
  xpIntoCurrentLevel: 333,
  xpRequiredForNextLevel: 750,
  yearlyPoints: 1083,
};

describe("AvatarJourneyCard", () => {
  beforeEach(async () => {
    await act(async () => i18n.changeLanguage("en"));
  });

  afterAll(async () => {
    await act(async () => i18n.changeLanguage("en"));
  });

  it("uses the current level's knight artwork and places it along the journey percentage", async () => {
    await render(<AvatarJourneyCard gender="male" isLoading={false} progress={progress} />);

    expect(screen.queryByText("Help your avatar progress and become a persevering disciple (level 10)")).toBeNull();
    expect(screen.getByTestId("avatar-journey-background").props.source).toEqual([
      require("../../../../../assets/images/backgrounds/walkingProgress/walking-progress-03.png"),
    ]);
    expect(screen.getByTestId("avatar-journey-character").props.source).toEqual([
      require("../../../../../assets/images/avatar/knightProgress/level-03-hopeful-servant.png"),
    ]);
    expect(screen.getByTestId("avatar-journey-character").props.style).toMatchObject({ left: "34.8%" });
    expect(screen.getByRole("progressbar").props.accessibilityValue).toEqual({ max: 100, min: 0, now: 44 });
  });

  it("uses princess artwork for female profiles and knight artwork when gender is absent", async () => {
    const rendered = await render(<AvatarJourneyCard gender="female" isLoading={false} progress={progress} />);

    expect(screen.getByTestId("avatar-journey-character").props.source).toEqual([
      require("../../../../../assets/images/avatar/princessProgress/level-03-hopeful-servant.png"),
    ]);

    await rendered.rerender(<AvatarJourneyCard gender={null} isLoading={false} progress={progress} />);
    expect(screen.getByTestId("avatar-journey-character").props.source).toEqual([
      require("../../../../../assets/images/avatar/knightProgress/level-03-hopeful-servant.png"),
    ]);
  });

  it("clamps unknown level numbers and progress while localizing the encouragement", async () => {
    await act(async () => i18n.changeLanguage("es"));
    await render(
      <AvatarJourneyCard
        gender="female"
        isLoading={false}
        progress={{
          ...progress,
          currentLevel: { ...progress.currentLevel!, levelNumber: 42 },
          levelProgressPercentage: 180,
        }}
      />,
    );

    expect(screen.getByRole("progressbar", { name: "Viaje del avatar: nivel 10, 100% completado." })).toBeTruthy();
    expect(screen.getByTestId("avatar-journey-background").props.source).toEqual([
      require("../../../../../assets/images/backgrounds/walkingProgress/walking-progress-10.png"),
    ]);
    expect(screen.getByTestId("avatar-journey-character").props.style).toMatchObject({ left: "74.0%" });
    expect(screen.getByRole("progressbar").props.accessibilityValue.now).toBe(100);
  });
});
