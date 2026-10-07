import { fireEvent, render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { RosaryGuideCards } from "./RosaryGuideCards";

describe("RosaryGuideCards", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("starts collapsed and reveals each Rosary guide card independently", async () => {
    await render(<RosaryGuideCards />);

    const historyToggle = screen.getByRole("button", { name: "Expand A short history" });
    const promisesToggle = screen.getByRole("button", { name: "Expand What it promises" });

    expect(historyToggle.props.accessibilityState).toEqual({ expanded: false });
    expect(promisesToggle.props.accessibilityState).toEqual({ expanded: false });
    expect(screen.queryByText(/^Our fathers began long ago\./)).toBeNull();
    expect(screen.queryByText(/^The promises come down to us/)).toBeNull();

    await fireEvent.press(historyToggle);

    expect(screen.getByText(/^Our fathers began long ago\./)).toBeTruthy();
    expect(historyToggle.props.accessibilityState).toEqual({ expanded: true });
    expect(promisesToggle.props.accessibilityState).toEqual({ expanded: false });

    await fireEvent.press(promisesToggle);

    expect(screen.getByText(/^The promises come down to us/)).toBeTruthy();
    expect(screen.getByText(/Ave Maria, gratia plena\.\.\./)).toBeTruthy();
    expect(promisesToggle.props.accessibilityState).toEqual({ expanded: true });
  });

  it("uses Spanish guide copy and accessible accordion labels", async () => {
    await i18n.changeLanguage("es");
    await render(<RosaryGuideCards />);

    const historyToggle = screen.getByRole("button", { name: "Expandir Una breve historia" });
    await fireEvent.press(historyToggle);

    expect(screen.getByText(/^Nuestros padres comenzaron hace mucho tiempo\./)).toBeTruthy();
    expect(historyToggle.props.accessibilityState).toEqual({ expanded: true });
  });
});
