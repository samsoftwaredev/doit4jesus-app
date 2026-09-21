import { act, fireEvent, render, screen, within } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { i18n } from "@/localization/i18n";

import { BadgeCatalogModal } from "./BadgeCatalogModal";

const mockWindowDimensions = jest.fn();

jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  __esModule: true,
  default: () => mockWindowDimensions(),
}));

function setViewport(width: number, height: number, fontScale = 1) {
  mockWindowDimensions.mockReturnValue({ fontScale, height, scale: 2, width });
}

const badges = [
  {
    category: "service",
    code: "COMMUNITY_HELPER",
    description: "Complete three acts of service.",
    earned: [],
    iconUrl: null,
    id: "badge-locked",
    isRepeatable: false,
    name: "Community Helper",
    pointsReward: 50,
    progress: null,
    rarity: "uncommon",
    requirementValue: 3,
    requirements: [],
  },
  {
    category: "prayer",
    code: "FIRST_ROSARY",
    description: "Pray your first complete rosary.",
    earned: [{ earnedAt: "2026-09-21T12:00:00.000Z", id: "earned-first" }],
    iconUrl: null,
    id: "badge-earned",
    isRepeatable: false,
    name: "First Rosary",
    pointsReward: 25,
    progress: null,
    rarity: "common",
    requirementValue: 1,
    requirements: [],
  },
  {
    category: "discipline",
    code: "BELT_OF_TRUTH",
    description: "Practice honesty and integrity each day.",
    earned: [],
    iconUrl: null,
    id: "badge-requirements",
    isRepeatable: false,
    name: "Belt of Truth",
    pointsReward: 75,
    progress: null,
    rarity: "uncommon",
    requirementValue: 7,
    requirements: [
      {
        complete: false,
        currentValue: 2,
        description: "Complete seven daily honesty reflections.",
        displayOrder: 1,
        id: "requirement-truth",
        requiredValue: 7,
      },
    ],
  },
  {
    category: "discipline",
    code: "PRAYER_STREAK",
    description: "Pray on seven consecutive days.",
    earned: [],
    iconUrl: null,
    id: "badge-progress",
    isRepeatable: false,
    name: "Prayer Streak",
    pointsReward: 100,
    progress: { currentValue: 3, percentage: 42.86, requiredValue: 7 },
    rarity: "rare",
    requirementValue: 7,
    requirements: [],
  },
];

describe("BadgeCatalogModal", () => {
  beforeEach(async () => {
    setViewport(390, 844);
    await act(async () => i18n.changeLanguage("en"));
  });

  afterAll(async () => {
    await act(async () => i18n.changeLanguage("en"));
  });

  it("orders and describes earned, in-progress, and locked badges accessibly", async () => {
    await render(<BadgeCatalogModal badges={badges} onClose={jest.fn()} visible />);

    expect(screen.getByRole("header", { name: "All Badges" })).toBeTruthy();
    const list = screen.getByLabelText("All available badges");
    const rows = within(list).getAllByRole("summary");
    expect(rows.map((row) => row.props.accessibilityLabel)).toEqual([
      expect.stringContaining("First Rosary. Earned."),
      expect.stringContaining("Belt of Truth. In progress, 29 percent."),
      expect.stringContaining("Prayer Streak. In progress, 43 percent."),
      expect.stringContaining("Community Helper. Not earned."),
    ]);
    expect(screen.getByText("3 / 7")).toBeTruthy();
    expect(screen.getByText("Complete seven daily honesty reflections.")).toBeTruthy();
    expect(screen.getByText("2 / 7")).toBeTruthy();
    expect(screen.getByText("Not started")).toBeTruthy();
    expect(screen.getByText("25 points")).toBeTruthy();
    expect(screen.getByText("Earned Sep 21, 2026")).toBeTruthy();

    const progressBars = screen.getAllByRole("progressbar");
    expect(progressBars.map((bar) => bar.props.accessibilityValue)).toEqual(
      expect.arrayContaining([
        { max: 100, min: 0, now: 100 },
        { max: 100, min: 0, now: 43 },
        { max: 7, min: 0, now: 2 },
      ]),
    );
    expect(screen.queryByTestId("badge-lock-overlay-badge-earned")).toBeNull();
    expect(screen.getByTestId("badge-lock-overlay-badge-locked")).toBeTruthy();
  });

  it("closes from its accessible action and localizes client-owned labels", async () => {
    const onClose = jest.fn();
    await act(async () => i18n.changeLanguage("es"));
    await render(<BadgeCatalogModal badges={[badges[3]]} onClose={onClose} visible />);

    expect(screen.getByRole("header", { name: "Todas las insignias" })).toBeTruthy();
    expect(screen.getByText("Rara")).toBeTruthy();
    fireEvent.press(screen.getByRole("button", { name: "Cerrar insignias" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it.each([
    [320, 568, 1.6, 560],
    [768, 1024, 1, 680],
    [1024, 768, 1, 680],
  ])("uses a responsive dialog at %ipx by %ipx", async (width, height, fontScale, expectedMaxWidth) => {
    setViewport(width, height, fontScale);
    await render(<BadgeCatalogModal badges={[badges[3]]} onClose={jest.fn()} visible />);

    expect(StyleSheet.flatten(screen.getByTestId("badge-catalog-dialog").props.style)).toEqual(
      expect.objectContaining({ maxWidth: expectedMaxWidth, width: "100%" }),
    );
    expect(screen.getByText("Pray on seven consecutive days.")).toBeTruthy();
  });
});
