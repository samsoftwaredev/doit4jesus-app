import { render, screen } from "@testing-library/react-native";

import { i18n } from "@/localization";

import { JourneyWelcomeCard } from "./JourneyWelcomeCard";

describe("JourneyWelcomeCard", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("welcomes a male user with accessible overview of every tab", async () => {
    await render(<JourneyWelcomeCard displayName="Mateo" gender="male" />);

    expect(screen.getByRole("header", { name: "Your journey begins, Mateo!" })).toBeTruthy();
    expect(screen.getByText("Here's an overview of the app.")).toBeTruthy();
    expect(screen.getByLabelText("Your path through DoIt4Jesus")).toBeTruthy();
    expect(screen.getByTestId("journey-ornament")).toBeTruthy();
    expect(screen.getByTestId("journey-introduction-divider")).toBeTruthy();
    expect(screen.getByText("Home · See your progress.")).toBeTruthy();
    expect(screen.getByText("Prayer · Make time for prayer.")).toBeTruthy();
    expect(screen.getByText("Community · Compete with others.")).toBeTruthy();
    expect(screen.getByText("Profile · Update your information.")).toBeTruthy();
    expect(screen.getByLabelText("Home. See your progress.")).toBeTruthy();
    expect(screen.getByLabelText("Prayer. Make time for prayer.")).toBeTruthy();
    expect(screen.getByLabelText("Community. Compete with others.")).toBeTruthy();
    expect(screen.getByLabelText("Profile. Update your information.")).toBeTruthy();
  });

  it("uses the princess and Spanish content for female and unspecified profiles", async () => {
    await i18n.changeLanguage("es");
    const rendered = await render(<JourneyWelcomeCard displayName="Sofía" gender="female" />);

    expect(screen.getByRole("header", { name: "¡Tu camino comienza, Sofía!" })).toBeTruthy();
    expect(screen.getByText("Aquí tienes una descripción general de la app.")).toBeTruthy();
    expect(screen.getByText("Inicio · Mira tu progreso.")).toBeTruthy();
    expect(screen.getByLabelText("Inicio. Mira tu progreso.")).toBeTruthy();

    await rendered.rerender(<JourneyWelcomeCard displayName={null} gender={null} />);

    expect(screen.getByRole("header", { name: "¡Tu camino comienza!" })).toBeTruthy();
  });
});
