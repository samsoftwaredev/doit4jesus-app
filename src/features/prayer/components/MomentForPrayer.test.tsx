import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { MomentForPrayer } from "./MomentForPrayer";
import { rosaryMysterySets } from "@/features/prayer/rosary/data/rosaryMysteries";
import { i18n } from "@/localization";

describe("MomentForPrayer", () => {
  it("renders filled video and outlined digital Rosary actions", async () => {
    const onPrayVideo = jest.fn();
    const onPrayDigital = jest.fn();

    const mysteryImageSource = rosaryMysterySets[0].imageSource;
    await render(
      <MomentForPrayer
        mysteryImageSource={mysteryImageSource}
        mysteryTitle="Joyful Mysteries"
        onPrayDigital={onPrayDigital}
        onPrayVideo={onPrayVideo}
        weekday="Monday"
      />,
    );

    expect(screen.getByText("Joyful Mysteries")).toBeTruthy();
    expect(screen.queryByText("A MOMENT OF PRAYER")).toBeNull();
    expect(screen.getByTestId("today-rosary-mystery-image").props.source).toEqual([mysteryImageSource]);

    const videoAction = screen.getByRole("button", { name: "Pray video Rosary for today's Joyful Mysteries" });
    const digitalAction = screen.getByRole("button", { name: "Pray digital Rosary for today's Joyful Mysteries" });
    expect(videoAction.props.accessibilityHint).toBe("Opens today’s guided video Rosary.");
    expect(digitalAction.props.accessibilityHint).toBe("Opens today’s interactive bead-by-bead Rosary.");
    expect(videoAction.props.style).toEqual(expect.anything());
    expect(digitalAction.props.style).toEqual(expect.anything());

    await fireEvent.press(videoAction);
    await fireEvent.press(digitalAction);

    expect(onPrayVideo).toHaveBeenCalledTimes(1);
    expect(onPrayDigital).toHaveBeenCalledTimes(1);
  });

  it("localizes both Rosary formats in Spanish", async () => {
    await i18n.changeLanguage("es");

    await render(
      <MomentForPrayer
        mysteryImageSource={rosaryMysterySets[0].imageSource}
        mysteryTitle="Misterios Gozosos"
        onPrayDigital={jest.fn()}
        onPrayVideo={jest.fn()}
        weekday="Lunes"
      />,
    );

    const videoAction = screen.getByRole("button", {
      name: "Rezar el Rosario en video de los Misterios Gozosos",
    });
    const digitalAction = screen.getByRole("button", {
      name: "Rezar el Rosario digital de los Misterios Gozosos",
    });
    expect(videoAction.props.accessibilityHint).toBe("Abre el Rosario guiado en video de hoy.");
    expect(digitalAction.props.accessibilityHint).toBe("Abre el Rosario interactivo de hoy, cuenta por cuenta.");

    await act(async () => i18n.changeLanguage("en"));
  });
});
