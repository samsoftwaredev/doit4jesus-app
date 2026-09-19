import { fireEvent, render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { LeaderboardPeriodSelector } from "./LeaderboardPeriodSelector";

describe("LeaderboardPeriodSelector", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("offers only weekly and yearly periods with accessible selected state", async () => {
    const onChange = jest.fn();
    await render(<LeaderboardPeriodSelector onChange={onChange} value="weekly" />);

    expect(screen.getByRole("tab", { name: "This Week" }).props.accessibilityState).toEqual({ selected: true });
    expect(screen.getByRole("tab", { name: "This Year" }).props.accessibilityState).toEqual({ selected: false });
    expect(screen.queryByText("Today")).toBeNull();
    expect(screen.queryByText("This Month")).toBeNull();

    await fireEvent.press(screen.getByRole("tab", { name: "This Year" }));
    expect(onChange).toHaveBeenCalledWith("yearly");
  });

  it("localizes both periods in Spanish", async () => {
    await i18n.changeLanguage("es");
    await render(<LeaderboardPeriodSelector onChange={jest.fn()} value="yearly" />);

    expect(screen.getByRole("tab", { name: "Esta semana" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Este año" }).props.accessibilityState).toEqual({ selected: true });
  });
});
