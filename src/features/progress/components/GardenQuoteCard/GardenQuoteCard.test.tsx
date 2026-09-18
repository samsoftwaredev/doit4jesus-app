import { render, screen } from "@testing-library/react-native";
import { i18n } from "@/localization";

import { GardenQuoteCard } from "./GardenQuoteCard";

describe("GardenQuoteCard", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders the accessible English quote with decorative artwork", async () => {
    await render(<GardenQuoteCard />);

    expect(screen.getByLabelText("Devotional quote from Our Lady of Fatima")).toBeTruthy();
    expect(screen.getByText("– Our Lady of Fatima")).toBeTruthy();
    expect(screen.getByTestId("garden-quote-artwork").props.accessible).toBe(false);
  });

  it("retains localized Spanish quote content", async () => {
    await i18n.changeLanguage("es");
    await render(<GardenQuoteCard />);

    expect(screen.getByLabelText("Cita devocional de Nuestra Señora de Fátima")).toBeTruthy();
    expect(screen.getByText("– Nuestra Señora de Fátima")).toBeTruthy();
  });
});
