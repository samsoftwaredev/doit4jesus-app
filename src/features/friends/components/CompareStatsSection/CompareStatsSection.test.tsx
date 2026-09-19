import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { i18n } from "@/localization";

import { comparison } from "../../screens/friends.test-utils";
import { CompareStatsSection } from "./CompareStatsSection";

const mockUseFriendsComparison = jest.fn();
const mockUseResponsiveLayout = jest.fn();

jest.mock("../../friends.hooks", () => ({
  useFriendsComparison: (...args: unknown[]) => mockUseFriendsComparison(...args),
}));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useResponsiveLayout: () => mockUseResponsiveLayout(),
}));

describe("CompareStatsSection", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
    mockUseResponsiveLayout.mockReturnValue({ isLargeText: false, isNarrowPhone: false });
    mockUseFriendsComparison.mockReturnValue({
      comparison,
      currentUser: comparison.entries[0],
      error: undefined,
      friend: comparison.entries[1],
      isLoading: false,
      periodType: "weekly",
      reload: jest.fn(),
      setPeriodType: jest.fn(),
    });
  });

  it("renders comparison content and switches periods without a nested scroll region", async () => {
    const setPeriodType = jest.fn();
    mockUseFriendsComparison.mockReturnValue({
      ...mockUseFriendsComparison(),
      setPeriodType,
    });
    await render(<CompareStatsSection friendId="friend-maria" />);

    expect(screen.getByRole("header", { name: "Compare Stats" })).toBeTruthy();
    expect(screen.getByText("Compare your prayer progress side by side.")).toBeTruthy();
    expect(screen.getByText("Total Rosaries")).toBeTruthy();
    expect(screen.getByText("120 points to catch up. Every prayer moves you forward.")).toBeTruthy();
    expect(screen.queryByLabelText("Compare Stats scroll region")).toBeNull();

    await fireEvent.press(screen.getByRole("tab", { name: "This Year" }));
    expect(setPeriodType).toHaveBeenCalledWith("yearly");
  });

  it("keeps loading and retry states local to the comparison section", async () => {
    const reload = jest.fn();
    mockUseFriendsComparison.mockReturnValue({ error: undefined, isLoading: true, reload });
    const view = await render(<CompareStatsSection friendId="friend-maria" />);
    expect(screen.getByText("Loading your comparison…")).toBeTruthy();

    mockUseFriendsComparison.mockReturnValue({ error: "Comparison unavailable", isLoading: false, reload });
    await view.rerender(<CompareStatsSection friendId="friend-maria" />);
    expect(screen.getByText("Comparison unavailable")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Try again" }));
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("stacks participant names on narrow screens and with large text", async () => {
    mockUseResponsiveLayout.mockReturnValue({ isLargeText: false, isNarrowPhone: true });
    const view = await render(<CompareStatsSection friendId="friend-maria" />);
    expect(StyleSheet.flatten(screen.getByTestId("compare-stats-names").props.style).flexDirection).toBe("column");

    mockUseResponsiveLayout.mockReturnValue({ isLargeText: true, isNarrowPhone: false });
    await view.rerender(<CompareStatsSection friendId="friend-maria" />);
    expect(StyleSheet.flatten(screen.getByTestId("compare-stats-names").props.style).flexDirection).toBe("column");
  });

  it("localizes the embedded section in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(<CompareStatsSection friendId="friend-maria" />);

    expect(screen.getByRole("header", { name: "Comparar estadísticas" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Esta semana" })).toBeTruthy();
  });
});
