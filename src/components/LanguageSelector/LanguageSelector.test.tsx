import { fireEvent, render, screen } from "@testing-library/react-native";

import "@/localization/i18n";

import { LanguageSelector } from "./LanguageSelector";

describe("LanguageSelector", () => {
  it("exposes English and Spanish as an accessible single-selection group", async () => {
    const onChange = jest.fn();

    await render(<LanguageSelector language="en" onChange={onChange} />);

    const english = screen.getByRole("radio", { name: "English" });
    const spanish = screen.getByRole("radio", { name: "Español" });

    expect(english.props.accessibilityState).toMatchObject({ checked: true });
    expect(spanish.props.accessibilityState).toMatchObject({ checked: false });

    await fireEvent.press(spanish);
    expect(onChange).toHaveBeenCalledWith("es");
  });
});
